const service = require('./service');

exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;
    
    // Create lead using service
    const result = await service.createLead(leadData);
    
    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const filters = req.query;
    
    // Get leads using service
    const result = await service.getLeads(filters);
    
    res.status(200).json({
      success: true,
      message: 'Leads retrieved successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error getting leads:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

exports.getLeadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get lead by ID using service
    const result = await service.getLeadById(id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found',
        error: 'Lead with the specified ID does not exist'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Lead retrieved successfully',
      data: result
    });
    
  } catch (error) {
    console.error('Error getting lead by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
