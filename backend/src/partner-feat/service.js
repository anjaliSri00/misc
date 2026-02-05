const { knex } = require("../db/connection");

async function createPartner({
  name,
  mobile,
  pan_number,
  address = null,
  city,
  category_of_work,
  bank_name,
  account_number,
  ifsc_code,
}) {
  try {
    if (
      !name ||
      !mobile ||
      !pan_number ||
      !city ||
      !category_of_work ||
      !bank_name ||
      !account_number ||
      !ifsc_code
    ) {
      return { success: false, message: "Missing required fields" };
    }

    // Validate category_of_work is an array
    if (!Array.isArray(category_of_work) || category_of_work.length === 0) {
      return {
        success: false,
        message: "category_of_work must be a non-empty array",
      };
    }

    // Check for duplicate mobile or PAN
    const existing = await knex("partners")
      .where("mobile", mobile)
      .orWhere("pan_number", pan_number)
      .first();
    if (existing) {
      if (existing.mobile === mobile)
        return { success: false, message: "Mobile already exists" };
      if (existing.pan_number === pan_number)
        return { success: false, message: "PAN number already exists" };
    }

    // Store category_of_work as JSON
    const categoryOfWorkJson = JSON.stringify(category_of_work);

    const inserted = await knex("partners")
      .insert({
        name,
        mobile,
        pan_number,
        address,
        city,
        category_of_work: categoryOfWorkJson,
        bank_name,
        account_number,
        ifsc_code,
      })
      .returning("*");

    // Parse the JSON back for the response
    const result = { ...inserted[0] };
    try {
      result.category_of_work = JSON.parse(result.category_of_work);
    } catch (e) {
      result.category_of_work = category_of_work; // fallback to original
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("createPartner error:", error);
    return { success: false, message: error.message };
  }
}

async function getPartnerList(page = 1, limit = 10, search = "") {
  try {
    const offset = (page - 1) * limit;

    let query = knex("partners").select(
      "id",
      "name",
      "mobile",
      "city",
      "category_of_work",
      "bank_name",  
      "account_number",
      "ifsc_code",
      "created_at"
    );
    if (search) {
      query = query.where(function () {
        this.where("name", "ilike", `%${search}%`)
          .orWhere("mobile", "ilike", `%${search}%`)
          .orWhere("city", "ilike", `%${search}%`)
          .orWhereRaw("category_of_work::jsonb ->> 0 ILIKE ?", [`%${search}%`]);
      });
    }

    const [rows, countRow] = await Promise.all([
      query.orderBy("created_at", "desc").limit(limit).offset(offset),
      knex("partners")
        .modify((q) => {
          if (search) {
            q.where(function () {
              this.where("name", "ilike", `%${search}%`)
                .orWhere("mobile", "ilike", `%${search}%`)
                .orWhere("city", "ilike", `%${search}%`)
                .orWhereRaw("category_of_work::jsonb ->> 0 ILIKE ?", [
                  `%${search}%`,
                ]);
            });
          }
        })
        .count("* as total")
        .first(),
    ]);

    // Parse JSON fields
    const processedRows = rows.map((row) => {
      const processed = { ...row };
      try {
        const raw = row.category_of_work;
        let categories = [];
        if (raw == null || raw === '') {
          categories = [];
        } else if (Array.isArray(raw)) {
          categories = raw.filter(Boolean);
        } else if (typeof raw === 'object') {
          // If DB returns JSON already parsed
          categories = Array.isArray(raw) ? raw.filter(Boolean) : [];
        } else if (typeof raw === 'string') {
          try {
            const parsed = JSON.parse(raw);
            categories = Array.isArray(parsed) ? parsed.filter(Boolean) : (parsed ? [String(parsed)] : []);
          } catch (_e) {
            // Not JSON, try comma-separated or single token
            categories = raw.includes(',')
              ? raw.split(',').map(s => s.trim()).filter(Boolean)
              : (raw.trim() ? [raw.trim()] : []);
          }
        }
        processed.category_of_work = categories;
      } catch (e) {
        console.error(
          "Error parsing category_of_work for partner",
          row.id,
          ":",
          e
        );
        processed.category_of_work = [];
      }
      return processed;
    });

    return {
      success: true,
      data: {
        partners: processedRows,
        pagination: {
          page,
          limit,
          total: countRow.total,
          totalPages: Math.ceil(countRow.total / limit),
        },
      },
    };
  } catch (error) {
    console.error("getPartnerList error:", error);
    return { success: false, message: error.message };
  }
}

async function getPartnerDetails(id) {
  try {
    const row = await knex("partners").where({ id }).first();
    if (!row)
      return { success: false, notFound: true, message: "Partner not found" };

    // Parse JSON fields
    const result = { ...row };
    // try {
    //   if (row.category_of_work) {
    //     result.category_of_work = JSON.parse(row.category_of_work);
    //   }
    // } catch (e) {
    //   console.error(
    //     "Error parsing category_of_work for partner",
    //     row.id,
    //     ":",
    //     e
    //   );
    //   result.category_of_work = [];
    // }

    return { success: true, data: result };
  } catch (error) {
    console.error("getPartnerDetails error:", error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  createPartner,
  getPartnerList,
  getPartnerDetails,
};
