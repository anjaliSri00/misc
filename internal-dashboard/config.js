// Environment-driven config for Internal Dashboard
// Override by defining window.DASHBOARD_ENV before this file or by editing values below
(function () {
  const env = (window && window.DASHBOARD_ENV) || {};

  window.DASHBOARD_CONFIG = {
    API: {
      BASE_URL: env.API_BASE_URL || 'http://localhost:3000',
      ENDPOINTS: {
        LEADS: {
          LIST: '/api/leads/list',
          DETAILS: (id) => `/api/leads/${id}`,
        },
        PARTNERS: {
          LIST: '/api/partners',
          DETAILS: (id) => `/api/partners/${id}`,
        },
        VENDORS: {
          EXPORT: '/api/vendors/export',
        },
      },
    },
  };
})();



