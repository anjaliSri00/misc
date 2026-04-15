// API Configuration
const API_CONFIG = {
    baseUrl: 'http://localhost:8000',
    endpoints: {
        register: '/api/v1/vendor/register',
        login: '/api/v1/vendor/login',  // Now uses OTP with mobile
        vendorDetails: '/api/v1/vendor/details',
        updateVendor: '/api/v1/vendor/update',
        uploadImage: '/api/v1/common/upload-image'
    },
    timeout: 30000,
    otp: {
        resendDelay: 30, // seconds
        expiryTime: 300 // seconds
    }
};

// Storage Keys
const STORAGE_KEYS = {
    vendorId: 'vendorId',
    vendorData: 'vendorData',
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    mobileNumber: 'mobileNumber'
};

// Helper Functions
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function showMessage(message, type = 'success') {
    const mainContent = document.getElementById('mainContent');
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`;
    messageDiv.innerHTML = message;
    
    // Insert at the top
    if (mainContent.firstChild) {
        mainContent.insertBefore(messageDiv, mainContent.firstChild);
    } else {
        mainContent.appendChild(messageDiv);
    }
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 4000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

function validateAadhar(aadhar) {
    return /^\d{12}$/.test(aadhar);
}

function validatePincode(pincode) {
    return /^\d{6}$/.test(pincode);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Token management functions
function setTokens(accessToken, refreshToken) {
    sessionStorage.setItem(STORAGE_KEYS.accessToken, accessToken);
    sessionStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
}

function getAccessToken() {
    return sessionStorage.getItem(STORAGE_KEYS.accessToken);
}

function getRefreshToken() {
    return sessionStorage.getItem(STORAGE_KEYS.refreshToken);
}

function clearTokens() {
    sessionStorage.removeItem(STORAGE_KEYS.accessToken);
    sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
}

// Generic authenticated fetch function
async function authenticatedFetch(url, options = {}) {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (accessToken) {
        headers['Access-Token'] = accessToken;
    }
    if (refreshToken) {
        headers['Refresh-Token'] = refreshToken;
    }
    
    const response = await fetch(url, {
        ...options,
        headers: headers
    });
    
    // If unauthorized, clear session and redirect to login
    if (response.status === 401 || response.status === 403) {
        logout();
        throw new Error('Session expired. Please login again.');
    }
    
    return response;
}