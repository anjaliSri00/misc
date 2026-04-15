// Main Application Entry Point

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initialized');
    
    // Make sure global functions are available
    window.renderLoginView = renderLoginView;
    window.renderRegistrationView = renderRegistrationView;
    window.renderDashboard = renderDashboard;
    window.logout = logout;
    
    // Check if user is already logged in
    if (isAuthenticated()) {
        const vendor = getCurrentVendor();
        if (vendor && vendor.id) {
            console.log('Found existing session, loading dashboard');
            renderDashboard(vendor);
        } else {
            // Try to fetch vendor details
            const vendorId = sessionStorage.getItem(STORAGE_KEYS.vendorId);
            if (vendorId) {
                showLoading(true);
                getVendorDetails(vendorId)
                    .then(vendor => {
                        showLoading(false);
                        renderDashboard(vendor);
                    })
                    .catch(error => {
                        showLoading(false);
                        console.error('Failed to load vendor details:', error);
                        // Token might be expired, clear and show login
                        logout();
                        renderLoginView();
                    });
            } else {
                renderLoginView();
            }
        }
    } else {
        renderLoginView();
    }
});

// Global error handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (event.reason && event.reason.message) {
        showMessage(event.reason.message, 'error');
    } else {
        showMessage('An unexpected error occurred. Please try again.', 'error');
    }
});