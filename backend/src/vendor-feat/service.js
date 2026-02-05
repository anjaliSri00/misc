const { knex } = require('../db/connection');
const bcrypt = require('bcryptjs');

async function loginUser(email, password) {
  try {
    const user = await knex('users')
      .where({ email, is_active: true })
      .whereNull('deleted_at')
      .first();
    if (!user) return null;
    
    // Direct password comparison (no bcrypt)
    const isMatch = password === user.password;
    if (!isMatch) return null;
    return user;
  } catch (err) {
    console.error('loginUser error:', err);
    throw err;
  }
}

async function createVendorDetails({
  gst_details,
  pan_details,
  address,
  std_code_with_phone,
  contact_person_name,
  items_interested,
  city,
  fax,
  contact_person_designation,
  state,
  website,
  is_msme,
  country,
  mobile,
  business_description,
  pin,
  email,
  msme_certificate,
  experience_and_reference,
  company_profile,
  work_order_copies,
  project_images,
  company_financial,
  bank_name,
  account_number,
  ifsc_code,
  cancelled_cheque_copy,
  company_certificate // new field
}) {
  try {
    // Validate msme_certificate is required when is_msme is true
    if (is_msme === 'true' || is_msme === true) {
      if (!msme_certificate || msme_certificate.trim() === '') {
        return { success: false, message: 'MSME certificate is required when is_msme is true' };
      }
    }

    // Validate required fields
    if (!company_profile) {
      return { success: false, message: 'company_profile is required' };
    }
    if (!company_financial) {
      return { success: false, message: 'company_financial is required' };
    }
    // Validate company_financial is an array of three objects with turnover and year
    if (!Array.isArray(company_financial) || company_financial.length !== 3 ||
      !company_financial.every(
        (item) => item && typeof item === 'object' && typeof item.turnover === 'string' && typeof item.year === 'string'
      )
    ) {
      return {
        success: false,
        message: 'company_financial must be an array of three objects, each with turnover and year as strings'
      };
    }
    if (!bank_name) {
      return { success: false, message: 'bank_name is required' };
    }
    if (!account_number) {
      return { success: false, message: 'account_number is required' };
    }
    if (!ifsc_code) {
      return { success: false, message: 'ifsc_code is required' };
    }
    if (!cancelled_cheque_copy) {
      return { success: false, message: 'cancelled_cheque_copy is required' };
    }

    // Handle JSON fields - stringify if they are objects/arrays
    const processedGstDetails = gst_details ? 
      (typeof gst_details === 'object' ? JSON.stringify(gst_details) : gst_details) : null;
    
    const processedPanDetails = pan_details ? 
      (typeof pan_details === 'object' ? JSON.stringify(pan_details) : pan_details) : null;

    const processedItemsInterested = items_interested ? 
      (Array.isArray(items_interested) ? JSON.stringify(items_interested) : items_interested) : null;

    const processedWorkOrderCopies = work_order_copies ?
      (Array.isArray(work_order_copies) ? JSON.stringify(work_order_copies) : work_order_copies) : null;

    const processedProjectImages = project_images ?
      (Array.isArray(project_images) ? JSON.stringify(project_images) : project_images) : null;

    // company_financial is already validated as array of three objects
    const processedCompanyFinancial = JSON.stringify(company_financial);

    // Check for duplicate mobile or email
    const existingVendor = await knex('vendors')
      .where('mobile', mobile)
      .orWhere('email', email)
      .first();
    if (existingVendor) {
      if (existingVendor.mobile === mobile) {
        return { success: false, message: 'Mobile number already exists' };
      }
      if (existingVendor.email === email) {
        return { success: false, message: 'Email already exists' };
      }
    }

    const result = await knex('vendors').insert({
      gst_details: processedGstDetails,
      pan_details: processedPanDetails,
      address,
      std_code_with_phone,
      contact_person_name,
      items_interested: processedItemsInterested,
      city,
      fax,
      contact_person_designation,
      state,
      website,
      is_msme,
      country,
      mobile,
      business_description,
      pin,
      email,
      msme_certificate,
      experience_and_reference,
      company_profile,
      work_order_copies: processedWorkOrderCopies,
      project_images: processedProjectImages,
      company_financial: processedCompanyFinancial,
      bank_name,
      account_number,
      ifsc_code,
      cancelled_cheque_copy,
      company_certificate // new field
    }).returning('*');
    
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in createVendorDetails:', error);
    return { success: false, message: error.message };
  }
}

async function getVendorList(page = 1, limit = 10, search = '', filters = {}, user = null) {
  try {
    const offset = (page - 1) * limit;
    const isSuperAdmin = user && user.is_superadmin === true;
    
    let query = knex('vendors')
      .select(
        'id',
        'contact_person_name',
        'company_profile',
        'city',
        'state',
        'country',
        'mobile',
        'email',
        'is_msme',
        'items_interested',
        'created_at'
      )
      .select(knex.raw(`gst_details->>'company_status' as company_status`));

    // If super admin, include all fields
    if (isSuperAdmin) {
      query = knex('vendors').select('*');
    }

    // Apply search filter
    if (search) {
      query = query.where(function() {
        this.where('contact_person_name', 'ilike', `%${search}%`)
          .orWhere('company_profile', 'ilike', `%${search}%`)
          .orWhere('city', 'ilike', `%${search}%`)
          .orWhere('state', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`);
      });
    }

    // Apply filters
    if (filters.state) {
      query = query.where('state', filters.state);
    }
    if (filters.city) {
      query = query.where('city', filters.city);
    }
    if (filters.is_msme) {
      query = query.where('is_msme', filters.is_msme);
    }
    if (filters.country) {
      query = query.where('country', filters.country);
    }
    if (filters.company_status) {
      query = query.whereRaw("gst_details::jsonb ->> 'company_status' = ?", [filters.company_status]);
    }
    if (filters.items_interested) {
      query = query.whereRaw('items_interested::jsonb @> ?', [JSON.stringify([filters.items_interested])]);
    }
    // Get total count for pagination (separate query)
    let countQuery = knex('vendors');
    
    // Apply same search filters to count query
    if (search) {
      countQuery = countQuery.where(function() {
        this.where('contact_person_name', 'ilike', `%${search}%`)
          .orWhere('company_profile', 'ilike', `%${search}%`)
          .orWhere('city', 'ilike', `%${search}%`)
          .orWhere('state', 'ilike', `%${search}%`)
          .orWhere('email', 'ilike', `%${search}%`);
      });
    }

    // Apply same filters to count query
    if (filters.state) {
      countQuery = countQuery.where('state', filters.state);
    }
    if (filters.city) {
      countQuery = countQuery.where('city', filters.city);
    }
    if (filters.is_msme) {
      countQuery = countQuery.where('is_msme', filters.is_msme);
    }
    if (filters.country) {
      countQuery = countQuery.where('country', filters.country);
    }
    if (filters.company_status) {
      countQuery = countQuery.whereRaw("gst_details::jsonb ->> 'company_status' = ?", [filters.company_status]);
    }
    if (filters.items_interested) {
      countQuery = countQuery.whereRaw('items_interested::jsonb @> ?', [JSON.stringify([filters.items_interested])]);
    }
    const totalCount = await countQuery.count('* as total').first();

    // Apply pagination and ordering to main query
    const vendors = await query
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    // Parse JSON fields with error handling
    const processedVendors = vendors.map(vendor => {
      const processedVendor = { ...vendor };
      
      // Parse items_interested with error handling
      try {
        if (vendor.items_interested) {
          if (typeof vendor.items_interested === 'string') {
            processedVendor.items_interested = JSON.parse(vendor.items_interested);
          } else {
            processedVendor.items_interested = vendor.items_interested;
          }
        } else {
          processedVendor.items_interested = [];
        }
      } catch (error) {
        console.error('Error parsing items_interested for vendor', vendor.id, ':', error);
        console.error('Raw items_interested value:', vendor.items_interested);
        processedVendor.items_interested = [];
      }

      // Parse additional JSON fields only for super admin
      if (isSuperAdmin) {
        try {
          if (vendor.gst_details) {
            if (typeof vendor.gst_details === 'string') {
              processedVendor.gst_details = JSON.parse(vendor.gst_details);
            } else {
              processedVendor.gst_details = vendor.gst_details;
            }
          }
        } catch (error) {
          console.error('Error parsing gst_details for vendor', vendor.id, ':', error);
          processedVendor.gst_details = {};
        }

        try {
          if (vendor.pan_details) {
            if (typeof vendor.pan_details === 'string') {
              processedVendor.pan_details = JSON.parse(vendor.pan_details);
            } else {
              processedVendor.pan_details = vendor.pan_details;
            }
          }
        } catch (error) {
          console.error('Error parsing pan_details for vendor', vendor.id, ':', error);
          processedVendor.pan_details = {};
        }

        try {
          if (vendor.work_order_copies) {
            if (typeof vendor.work_order_copies === 'string') {
              processedVendor.work_order_copies = JSON.parse(vendor.work_order_copies);
            } else {
              processedVendor.work_order_copies = vendor.work_order_copies;
            }
          }
        } catch (error) {
          console.error('Error parsing work_order_copies for vendor', vendor.id, ':', error);
          processedVendor.work_order_copies = [];
        }

        try {
          if (vendor.project_images) {
            if (typeof vendor.project_images === 'string') {
              processedVendor.project_images = JSON.parse(vendor.project_images);
            } else {
              processedVendor.project_images = vendor.project_images;
            }
          }
        } catch (error) {
          console.error('Error parsing project_images for vendor', vendor.id, ':', error);
          processedVendor.project_images = [];
        }

        try {
          if (vendor.company_financial) {
            if (typeof vendor.company_financial === 'string') {
              processedVendor.company_financial = JSON.parse(vendor.company_financial);
            } else {
              processedVendor.company_financial = vendor.company_financial;
            }
          }
        } catch (error) {
          console.error('Error parsing company_financial for vendor', vendor.id, ':', error);
          processedVendor.company_financial = [];
        }
      }

      return processedVendor;
    });

    return {
      success: true,
      data: {
        vendors: processedVendors,
        pagination: {
          page,
          limit,
          total: totalCount.total,
          totalPages: Math.ceil(totalCount.total / limit)
        }
      }
    };
  } catch (error) {
    console.error('Error in getVendorList:', error);
    return { success: false, message: error.message };
  }
}

async function getVendorDetails(vendorId, user = null) {
  try {
    const isSuperAdmin = user && user.is_superadmin === true;
    
    let query = knex('vendors').where('id', vendorId);
    
    // If not super admin, select only limited fields
    if (!isSuperAdmin) {
      query = query.select(
        'id',
        'contact_person_name',
        'company_profile',
        'city',
        'state',
        'country',
        'mobile',
        'email',
        'is_msme',
        'items_interested',
        'created_at'
      );
    }

    const vendor = await query.first();

    if (!vendor) {
      return { success: false, message: 'Vendor not found' };
    }

    // Parse JSON fields with error handling
    const processedVendor = { ...vendor };
    
    // Parse items_interested with error handling
    try {
      if (vendor.items_interested) {
        if (typeof vendor.items_interested === 'string') {
          processedVendor.items_interested = JSON.parse(vendor.items_interested);
        } else {
          processedVendor.items_interested = vendor.items_interested;
        }
      } else {
        processedVendor.items_interested = [];
      }
    } catch (error) {
      console.error('Error parsing items_interested for vendor', vendor.id, ':', error);
      console.error('Raw items_interested value:', vendor.items_interested);
      processedVendor.items_interested = [];
    }

    // Parse additional JSON fields only for super admin
    if (isSuperAdmin) {
      try {
        if (vendor.gst_details) {
          if (typeof vendor.gst_details === 'string') {
            processedVendor.gst_details = JSON.parse(vendor.gst_details);
          } else {
            processedVendor.gst_details = vendor.gst_details;
          }
        }
      } catch (error) {
        console.error('Error parsing gst_details for vendor', vendor.id, ':', error);
        processedVendor.gst_details = {};
      }

      try {
        if (vendor.pan_details) {
          if (typeof vendor.pan_details === 'string') {
            processedVendor.pan_details = JSON.parse(vendor.pan_details);
          } else {
            processedVendor.pan_details = vendor.pan_details;
          }
        }
      } catch (error) {
        console.error('Error parsing pan_details for vendor', vendor.id, ':', error);
        processedVendor.pan_details = {};
      }

      try {
        if (vendor.work_order_copies) {
          if (typeof vendor.work_order_copies === 'string') {
            processedVendor.work_order_copies = JSON.parse(vendor.work_order_copies);
          } else {
            processedVendor.work_order_copies = vendor.work_order_copies;
          }
        }
      } catch (error) {
        console.error('Error parsing work_order_copies for vendor', vendor.id, ':', error);
        processedVendor.work_order_copies = [];
      }

      try {
        if (vendor.project_images) {
          if (typeof vendor.project_images === 'string') {
            processedVendor.project_images = JSON.parse(vendor.project_images);
          } else {
            processedVendor.project_images = vendor.project_images;
          }
        }
      } catch (error) {
        console.error('Error parsing project_images for vendor', vendor.id, ':', error);
        processedVendor.project_images = [];
      }

      try {
        if (vendor.company_financial) {
          if (typeof vendor.company_financial === 'string') {
            processedVendor.company_financial = JSON.parse(vendor.company_financial);
          } else {
            processedVendor.company_financial = vendor.company_financial;
          }
        }
      } catch (error) {
        console.error('Error parsing company_financial for vendor', vendor.id, ':', error);
        processedVendor.company_financial = [];
      }
    }

    return { success: true, data: processedVendor };
  } catch (error) {
    console.error('Error in getVendorDetails:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Fetch distinct filter values from vendors table: cities, experience_and_reference, items_interested
 * Accepts optional filters: city, experience_and_reference, items_interested
 */
async function getVendorFilters(filters = {}) {
  try {
    let query = knex('vendors');
    // Apply filters if provided
    if (filters.city) {
      query = query.where('city', filters.city);
    }
    if (filters.items_interested) {
      query = query.whereRaw('items_interested::jsonb @> ?', [JSON.stringify([filters.items_interested])]);
    }
    if (filters.company_status) {
      query = query.where('company_status', filters.company_status);
    }

    // Get all matching vendors
    const vendors = await query.select('city', 'items_interested', 'company_profile', 'gst_details');

    // Distinct cities
    const cities = Array.from(new Set(vendors.map(row => row.city).filter(Boolean)));

    // Distinct items_interested (flatten all arrays, dedupe)
    let allItems = [];
    for (const row of vendors) {
      if (row.items_interested) {
        try {
          const arr = typeof row.items_interested === 'string' ? JSON.parse(row.items_interested) : row.items_interested;
          if (Array.isArray(arr)) {
            allItems = allItems.concat(arr);
          }
        } catch (e) {
          // skip parse errors
        }
      }
    }
    const items_interested = Array.from(new Set(allItems.filter(Boolean)));

    // Distinct company_status from gst_details
    let allCompanyStatus = [];
    for (const row of vendors) {
      if (row.gst_details) {
        try {
          const gst = typeof row.gst_details === 'string' ? JSON.parse(row.gst_details) : row.gst_details;
          if (gst && gst.company_status) {
            allCompanyStatus.push(gst.company_status);
          }
        } catch (e) {
          // skip parse errors
        }
      }
    }
    const company_status = Array.from(new Set(allCompanyStatus.filter(Boolean)));

    return {
      success: true,
      data: {
        cities,
        items_interested,
        company_status
      }
    };
  } catch (error) {
    console.error('Error in getVendorFilters:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  loginUser,
  createVendorDetails,
  getVendorList,
  getVendorDetails,
  getVendorFilters // <-- export new function
};
