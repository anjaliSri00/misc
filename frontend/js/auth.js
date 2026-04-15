// Authentication Functions with OTP

let otpTimer = null;
let otpCountdown = 0;

async function generateOTP(mobile) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                mobile: mobile, 
                action: 'generate' 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.meta?.message || 'Failed to send OTP');
        }
        
        return {
            success: true,
            session_id: data.data?.session_id,
            message: data.message || 'OTP sent successfully'
        };
    } catch (error) {
        console.error('Generate OTP error:', error);
        throw error;
    }
}

async function verifyOTP(mobile, otp, session_id) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                mobile: mobile, 
                action: 'verify',
                otp: otp,
                session_id: session_id
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.meta?.message || 'OTP verification failed');
        }
        
        // Store tokens
        if (data.data?.access_token && data.data?.refresh_token) {
            setTokens(data.data.access_token, data.data.refresh_token);
        } else if (data.access_token && data.refresh_token) {
            setTokens(data.access_token, data.refresh_token);
        }
        
        // Store vendor information from login response
        const vendorData = data.data?.vendor || data.vendor;
        if (vendorData) {
            const vendor = vendorData;
            const vendorId = vendor.id || vendor.vendor_id;
            sessionStorage.setItem(STORAGE_KEYS.vendorId, vendorId);
            sessionStorage.setItem(STORAGE_KEYS.mobileNumber, mobile);
            
            // Fetch complete vendor details using the details API
            console.log('Fetching complete vendor details for ID:', vendorId);
            const completeVendorDetails = await getVendorDetails(vendorId);
            return completeVendorDetails;
        }
        
        throw new Error('Vendor data not found in response');
    } catch (error) {
        console.error('Verify OTP error:', error);
        throw error;
    }
}

async function getVendorDetails(vendorId) {
    try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        
        // console.log('Fetching vendor details for ID:', vendorId);
        // console.log('AccessToken:', accessToken);
        // console.log('RefreshToken:', refreshToken);
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add tokens as AccessToken and RefreshToken headers
        if (accessToken) {
            headers['Access-Token'] = accessToken;
        }
        if (refreshToken) {
            headers['Refresh-Token'] = refreshToken;
        }
        
        const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.vendorDetails}`;
        // console.log('Request URL:', url);
        // console.log('Request Headers:', headers);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        });
        
        // console.log('Response status:', response.status);
        
        const data = await response.json();
        // console.log('Response data:', data);
        
        if (!response.ok) {
            // If token expired, clear session and redirect to login
            if (response.status === 401 || response.status === 403) {
                logout();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || 'Failed to fetch vendor details');
        }
        
        const vendor = data.data || data.vendor || data;
        // console.log('Complete vendor details:', vendor);
        
        // Update stored vendor data with complete details
        sessionStorage.setItem(STORAGE_KEYS.vendorData, JSON.stringify(vendor));
        
        return vendor;
    } catch (error) {
        console.error('Get vendor details error:', error);
        throw error;
    }
}

async function updateVendorDetails(vendorId, vendorData) {
    try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();
        
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add tokens as AccessToken and RefreshToken headers
        if (accessToken) {
            headers['Access-Token'] = accessToken;
        }
        if (refreshToken) {
            headers['Refresh-Token'] = refreshToken;
        }
        
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.updateVendor}/${vendorId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(vendorData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                logout();
                throw new Error('Session expired. Please login again.');
            }
            throw new Error(data.message || 'Update failed');
        }
        
        // Update stored vendor data
        const freshVendorDetails = await getVendorDetails(vendorId);
        sessionStorage.setItem(STORAGE_KEYS.vendorData, JSON.stringify(freshVendorDetails));
        
        return freshVendorDetails;
    } catch (error) {
        console.error('Update vendor error:', error);
        throw error;
    }
}

function logout() {
    // Clear timer if running
    if (otpTimer) {
        clearInterval(otpTimer);
    }
    
    sessionStorage.removeItem(STORAGE_KEYS.vendorId);
    sessionStorage.removeItem(STORAGE_KEYS.vendorData);
    sessionStorage.removeItem(STORAGE_KEYS.mobileNumber);
    clearTokens();
    
    // Redirect to login view
    if (typeof renderLoginView === 'function') {
        renderLoginView();
    } else {
        window.location.reload();
    }
}

function isAuthenticated() {
    return !!sessionStorage.getItem(STORAGE_KEYS.vendorId) && !!getAccessToken();
}

function getCurrentVendor() {
    const vendorData = sessionStorage.getItem(STORAGE_KEYS.vendorData);
    return vendorData ? JSON.parse(vendorData) : null;
}

function startOTPTimer(duration, onTick, onComplete) {
    otpCountdown = duration;
    
    if (otpTimer) {
        clearInterval(otpTimer);
    }
    
    otpTimer = setInterval(() => {
        if (otpCountdown <= 0) {
            clearInterval(otpTimer);
            if (onComplete) onComplete();
        } else {
            otpCountdown--;
            if (onTick) onTick(otpCountdown);
        }
    }, 1000);
    
    return () => {
        if (otpTimer) {
            clearInterval(otpTimer);
        }
    };
}