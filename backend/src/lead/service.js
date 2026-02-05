const { knex } = require("../db/connection");   
exports.createLead = async (leadData) => {
  try {
    // Prepare data for insertion
    const leadToInsert = {
      interior_service: leadData.interior_service,
      type_of_project: leadData.type_of_project,
      property_size: leadData.property_size,
      budget: leadData.budget,
      hiring_decision: leadData.hiring_decision,
      city: leadData.city,
      name: leadData.name,
      email: leadData.email,
      mobile: leadData.mobile.replace(/^\+91/, ''), // Remove +91 prefix if present
      marketing_optin: leadData.marketingOptIn || false,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Insert into database
    const [id] = await knex('lead_data').insert(leadToInsert).returning('id');
    
    // Return the created lead with ID
    return {
      id,
      ...leadToInsert
    };
    
  } catch (error) {
    console.error('Database error creating lead:', error);
    throw new Error('Failed to create lead in database');
  }
};

exports.getLeads = async (filters) => {
  try {
    // Build base query for filtering
    let baseQuery = knex('lead_data');
    
    // Apply filters
    if (filters.interior_service) {
      baseQuery = baseQuery.where('interior_service', filters.interior_service);
    }
    
    if (filters.type_of_project) {
      baseQuery = baseQuery.where('type_of_project', filters.type_of_project);
    }
    
    if (filters.city) {
      baseQuery = baseQuery.whereILike('city', `%${filters.city}%`);
    }
    
    if (filters.search) {
      baseQuery = baseQuery.where(function() {
        this.whereILike('name', `%${filters.search}%`)
          .orWhereILike('email', `%${filters.search}%`)
          .orWhereILike('mobile', `%${filters.search}%`)
          .orWhereILike('city', `%${filters.search}%`);
      });
    }
    
    if (filters.start_date) {
      baseQuery = baseQuery.where('created_at', '>=', filters.start_date);
    }
    
    if (filters.end_date) {
      baseQuery = baseQuery.where('created_at', '<=', filters.end_date);
    }
    
    // Get total count for pagination (separate query)
    const totalCount = await baseQuery.clone().count('* as total').first();
    
    // Apply pagination and get actual data
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const offset = (page - 1) * limit;
    
    const leads = await baseQuery
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
    
    return {
      leads,
      pagination: {
        page,
        limit,
        total: parseInt(totalCount.total),
        totalPages: Math.ceil(totalCount.total / limit)
      }
    };
    
  } catch (error) {
    console.error('Database error getting leads:', error);
    throw new Error('Failed to retrieve leads from database');
  }
};

exports.getLeadById = async (id) => {
  try {
    const lead = await knex('lead_data')
      .select('*')
      .where('id', id)
      .first();

    return lead;
  } catch (error) {
    console.error('Database error getting lead by ID:', error);
    throw new Error('Failed to retrieve lead from database');
  }
};
