// config.js
(function () {
  const env = (window && window.LEAD_FORMS_ENV) || {};

  window.CONFIG = {
    API: {
      BASE_URL: env.API_BASE_URL || 'http://react.radheyradheyproperties.in',
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
      // Define all possible fields and their mapping
      FIELDS: {
        // Required fields
        customer_name: { required: true, source: 'name' },
        customer_contact: { required: true, source: 'phone' },
        customer_email: { required: true, source: 'email' },
        city: { required: true, source: 'city' },

        // Optional fields
        budget: { required: false, source: 'budget' },
        state: { required: false, source: 'state' },
        pincode: { required: false, source: 'pincode' },
        type_of_service: { required: false, source: 'serviceType' },
        project_type: { required: false, source: 'projectType' },
        property_type: { required: false, source: 'propertyType' },
        property_size: { required: false, source: 'areaSize' },
        hiring_decision: { required: false, source: 'hiringDecision' },
      },
      VALIDATION: {
        REQUIRED_FIELDS: ['customer_name', 'customer_contact', 'customer_email', 'city']
      }
    },
  };
})();