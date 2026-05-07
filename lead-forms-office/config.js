// config.js - Fixed version
(function () {
  const env = (window && window.LEAD_FORMS_ENV) || {};

  window.CONFIG = {
    API: {
      BASE_URL: "http://localhost:8000",
      ENDPOINTS: {
        LEADS: {
          FORM: '/api/v1/lead/data',
        },
      },
    },
    UI: {
      LOADING_TEXT: env.UI_LOADING_TEXT || 'Submitting...',
      SUCCESS_REDIRECT: env.UI_SUCCESS_REDIRECT || 'success.html',
      ERROR_MESSAGE: env.UI_ERROR_MESSAGE || 'Error submitting form. Please try again.',
    },
    FORM: {
      FIELDS: {
        // Required fields
        customer_name: { required: true, source: 'name' },
        customer_contact: { required: true, source: 'phone' },
        customer_email: { required: true, source: 'email' },
        city: { required: true, source: 'city' },

        // Optional fields
        state: { required: false, source: 'state' },
        pincode: { required: false, source: 'pincode' },
        
        // Budget/Range
        range_label: { required: false, source: 'budget' },
        
        // Service related
        type_of_space: { required: false, source: 'type_of_space' },
        type_of_service: { required: false, source: 'serviceType' },
        
        // Property related
        property_type: { required: false, source: 'property_type' },
        property_size: { required: false, source: 'property_size' },
        project_type: { required: false, source: 'projectType' },
        
        // Decision
        hiring_decision: { required: false, source: 'hiringDecision' },
        
        // Additional fields
        claim_limit: { required: false, source: 'claimLimit', defaultValue: 3 },
        description: { required: false, source: 'description' },
        admin_approval: { required: false, source: 'adminApproval', defaultValue: 'pending' },
        
        // BHK configuration
        bhk_configuration: { required: false, source: 'bhkConfiguration' },
      },
      
      VALIDATION: {
        REQUIRED_FIELDS: ['customer_name', 'customer_contact', 'customer_email', 'city']
      },
      
      DEFAULTS: {
        claim_limit: 3,
        admin_approval: 'pending',
        property_type: 'Residential' // ✅ Add default property_type
      }
    },
    
    FIELD_MAPPINGS: {
      type_of_space: {
        'Office': 'Office',
        'Retail': 'Retail',
        'F & B': 'F & B',
        '1 BHK': '1 BHK',
        '2 BHK': '2 BHK',
        '3 BHK': '3 BHK',
        '4 BHK': '4 BHK',
        '5+ BHK': '5+ BHK'
      },
      
      serviceType: {
        'Design only': 'Design only',
        'Turnkey': 'Turnkey'
      },
      
      projectType: {
        'New Property': 'New Property',
        'Existing Property': 'Existing Property'
      },
      
      property_type: {
        'Residential': 'Residential',
        'Commercial': 'Commercial'
      },
      
      hiringDecision: {
        'I\'m ready to hire now': 'Immediate',
        'I\'m likely to hire someone': 'Likely',
        'I\'m planning and researching': 'Planning',
        'ready-to-hire-now': 'Immediate',
        'likely-to-hire': 'Likely',
        'planning-and-researching': 'Planning'
      },
      
      budget: {
        'Upto ₹10 Lakhs': 'Upto 10 Lakhs',
        '₹10 Lakhs - ₹20 Lakhs': '10 - 20 Lakhs',
        '₹20 Lakhs - ₹40 Lakhs': '20 - 40 Lakhs',
        '₹40 Lakhs or more': '40 Lakhs+',
        'I would like to discuss with the professional': 'Discuss with professional'
      },
      
      bhkConfiguration: {
        '1 BHK': '1 BHK',
        '2 BHK': '2 BHK',
        '3 BHK': '3 BHK',
        '4 BHK': '4 BHK',
        '5+ BHK': '5+ BHK'
      },
      
      property_size: {
        'Up to 1000 sqft': 'Up to 1000 sqft',
        '1000 - 2000 sqft': '1000 - 2000 sqft',
        '2000 - 4000 sqft': '2000 - 4000 sqft',
        '4000+ sqft': '4000+ sqft'
      }
    },
    
    transformData: function(data) {
      const transformed = {};
      
      // Map each field according to FIELDS configuration
      for (const [backendField, config] of Object.entries(this.FORM.FIELDS)) {
        let value = data[config.source];
        
        // Apply default value if field is missing or empty
        if ((value === undefined || value === null || value === '') && config.defaultValue !== undefined) {
          value = config.defaultValue;
        }
        
        // Apply field mapping if it exists
        if (value && this.FIELD_MAPPINGS[config.source] && this.FIELD_MAPPINGS[config.source][value]) {
          value = this.FIELD_MAPPINGS[config.source][value];
        }
        
        // Apply direct field mappings for specific fields
        if (value && this.FIELD_MAPPINGS[backendField] && this.FIELD_MAPPINGS[backendField][value]) {
          value = this.FIELD_MAPPINGS[backendField][value];
        }
        
        // Only add if value is present (or required field)
        if (config.required || (value !== undefined && value !== null && value !== '')) {
          transformed[backendField] = value;
        }
      }
      
      // ⭐ FIXED: Handle type_of_space - priority to original type_of_space
      if (data.type_of_space && data.type_of_space.trim() !== '') {
        transformed.type_of_space = data.type_of_space;
      } else if (data.bhk_type && !transformed.type_of_space) {
        transformed.type_of_space = data.bhk_type;
      } else if (data.bhkConfiguration && !transformed.type_of_space) {
        transformed.type_of_space = data.bhkConfiguration;
      }
      
      // ⭐ FIXED: Handle property_size properly
      if (data.property_size && data.property_size.trim() !== '') {
        transformed.property_size = data.property_size;
      } else if (data.propertyArea?.range) {
        transformed.property_size = data.propertyArea.range;
      } else if (data.propertyArea?.rangeLabel) {
        transformed.property_size = data.propertyArea.rangeLabel;
      }
      
      // ⭐ FIXED: Handle property_type with default
      if (data.property_type && data.property_type.trim() !== '') {
        transformed.property_type = data.property_type;
      } else if (!transformed.property_type) {
        transformed.property_type = 'Residential'; // Default value
      }
      
      // Handle description
      if (data.description && data.description.trim() !== '') {
        transformed.description = data.description;
      }
      
      // Handle range_label from budget
      if (!transformed.range_label && data.budget && this.FIELD_MAPPINGS.budget[data.budget]) {
        transformed.range_label = this.FIELD_MAPPINGS.budget[data.budget];
      }
      
      // Ensure admin_approval has a value
      if (!transformed.admin_approval) {
        transformed.admin_approval = 'pending';
      }
      
      // Ensure claim_limit has value
      if (!transformed.claim_limit) {
        transformed.claim_limit = 3;
      }
      
      // console.log('Original data:', data);
      // console.log('Transformed payload:', transformed);
      return transformed;
    }
  };
})();