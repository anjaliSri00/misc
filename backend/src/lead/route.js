const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { validateCreateLead, validateGetLeads, validateGetLeadById } = require('./validation');

// POST /api/leads - Create new lead
router.post('/form', validateCreateLead, controller.createLead);

// GET /api/leads - Get all leads with filters
router.get('/list', validateGetLeads, controller.getLeads);

// GET /api/leads/:id - Get lead details by ID
router.get('/:id', validateGetLeadById, controller.getLeadById);

module.exports = router;
