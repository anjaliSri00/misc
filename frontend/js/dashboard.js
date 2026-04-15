// Dashboard Functions with OTP Login

function renderLoginForm() {
    return `
        <div class="auth-container">
            <div class="card">
                <div class="card-header">Vendor Login</div>
                <form id="loginForm">
                    <div class="form-group">
                        <label>Mobile Number <span class="required">*</span></label>
                        <input type="tel" id="mobileNumber" maxlength="10" placeholder="Enter 10-digit mobile number" autocomplete="off" autofill="off" required >
                        <div class="error-message" id="mobileError"></div>
                    </div>
                    
                    <div id="otpSection" style="display: none;">
                        <div class="form-group">
                            <label>OTP <span class="required">*</span></label>
                            <input type="text" id="otpInput" maxlength="6" placeholder="Enter 6-digit OTP" autocomplete="off" autofill="off" autocomplete="one-time-code"
                                   inputmode="numeric" pattern="[0-9]*" >
                            <div class="error-message" id="otpError"></div>
                        </div>
                        <div class="form-group">
                            <button type="button" id="resendOtpBtn" class="btn btn-secondary" style="width: auto; padding: 0.5rem 1rem;" disabled>
                                Resend OTP (<span id="timerDisplay">30</span>s)
                            </button>
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button type="button" id="sendOtpBtn" class="btn btn-primary">Send OTP</button>
                        <button type="submit" id="verifyOtpBtn" class="btn btn-primary" style="display: none;">Verify & Login</button>
                        <button type="button" id="showRegisterBtn" class="btn btn-secondary">New Vendor? Register</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

let currentSessionId = null;
let currentMobile = null;

function handleSendOTP() {
    const mobile = document.getElementById('mobileNumber').value.trim();
    const mobileError = document.getElementById('mobileError');
    
    if (!mobile) {
        mobileError.textContent = 'Mobile number is required';
        return;
    }
    
    if (!validateMobile(mobile)) {
        mobileError.textContent = 'Please enter a valid 10-digit mobile number';
        return;
    }
    
    mobileError.textContent = '';
    showLoading(true);
    
    generateOTP(mobile)
        .then(result => {
            showLoading(false);
            currentSessionId = result.session_id;
            currentMobile = mobile;
            
            showMessage(result.message, 'success');
            
            // Show OTP section
            document.getElementById('otpSection').style.display = 'block';
            document.getElementById('sendOtpBtn').style.display = 'none';
            document.getElementById('verifyOtpBtn').style.display = 'block';
            
            // Start timer for resend
            startOTPTimer(30, 
                (seconds) => {
                    const timerDisplay = document.getElementById('timerDisplay');
                    if (timerDisplay) timerDisplay.textContent = seconds;
                },
                () => {
                    const resendBtn = document.getElementById('resendOtpBtn');
                    if (resendBtn) {
                        resendBtn.disabled = false;
                        resendBtn.textContent = 'Resend OTP';
                    }
                }
            );
            
            // Setup resend button
            const resendBtn = document.getElementById('resendOtpBtn');
            resendBtn.onclick = () => {
                resendBtn.disabled = true;
                resendBtn.textContent = 'Sending...';
                handleSendOTP();
            };
        })
        .catch(error => {
            showLoading(false);
            showMessage(error.message || 'Failed to send OTP', 'error');
        });
}

function handleVerifyOTP(event) {
    event.preventDefault();
    
    const otp = document.getElementById('otpInput').value.trim();
    const otpError = document.getElementById('otpError');
    
    if (!otp) {
        otpError.textContent = 'OTP is required';
        return;
    }
    
    if (otp.length !== 6) {
        otpError.textContent = 'Please enter 6-digit OTP';
        return;
    }
    
    otpError.textContent = '';
    showLoading(true);
    
    verifyOTP(currentMobile, otp, currentSessionId)
        .then(vendor => {
            showLoading(false);
            showMessage('Login successful! Welcome back.', 'success');
            // Render the dashboard with complete vendor details
            renderDashboard(vendor);
        })
        .catch(error => {
            showLoading(false);
            showMessage(error.message || 'OTP verification failed', 'error');
        });
}

function renderDashboard(vendor) {
    console.log('Rendering dashboard with vendor:', vendor);
    
    const mainContent = document.getElementById('mainContent');
    const header = document.getElementById('header');
    const vendorNameSpan = document.getElementById('vendorName');
    
    if (!mainContent) {
        console.error('Main content element not found');
        return;
    }
    
    // Render the dashboard view
    mainContent.innerHTML = renderDashboardView(vendor);
    header.style.display = 'block';
    vendorNameSpan.textContent = `${vendor.name} (${vendor.company_name})`;
    
    // Setup event listeners
    const editBtn = document.getElementById('editVendorBtn');
    const refreshBtn = document.getElementById('refreshDashboardBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (editBtn) {
        editBtn.addEventListener('click', () => handleEditVendor(vendor));
    }
    
   // Update the refresh button handler in renderDashboard function
if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
        const vendorId = vendor.id || vendor.vendor_id || vendor._id;
        console.log('Manual refresh triggered for vendor ID:', vendorId);
        showLoading(true);
        
        // Clear cached data to force fresh fetch
        sessionStorage.removeItem(STORAGE_KEYS.vendorData);
        
        getVendorDetails(vendorId)
            .then(refreshedVendor => {
                showLoading(false);
                console.log('Refresh successful:', refreshedVendor);
                renderDashboard(refreshedVendor);
                showMessage('Dashboard refreshed successfully!', 'success');
            })
            .catch(error => {
                showLoading(false);
                console.error('Refresh failed:', error);
                showMessage('Failed to refresh: ' + error.message, 'error');
                
                // If token expired, redirect to login
                if (error.message.includes('expired') || error.message.includes('login')) {
                    logout();
                    renderLoginView();
                }
            });
    });
}
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout();
            renderLoginView();
        });
    }
}

function renderDashboardView(vendor) {
    const workCategories = vendor.category_of_work || [];
    
    // Format the display values
    const displayAadhar = vendor.aadhaar_number ? vendor.aadhaar_number : 'N/A';
    const displayAadharPhoto = vendor.aadhaar_photo ? 
        `<a href="${vendor.aadhaar_photo}" target="_blank" style="color: #1a3a2b;">View Document</a>` : 
        'Not uploaded';
    const displayCity = vendor.city && vendor.city !== 'null' ? vendor.city : 'N/A';
    const displayState = vendor.state && vendor.state !== 'null' ? vendor.state : 'N/A';
    const displayPincode = vendor.pincode && vendor.pincode !== 'null' ? vendor.pincode : 'N/A';
    const displayAddress = vendor.address && vendor.address !== 'null' ? vendor.address : 'N/A';
    
    return `
        <div class="card">
            <div class="card-header">
                Vendor Dashboard
                <button id="editVendorBtn" class="btn btn-warning" style="float: right; margin-left: 1rem;">Edit Details</button>
                <button id="refreshDashboardBtn" class="btn btn-secondary" style="float: right;">Refresh</button>
            </div>
            
            <div id="vendorDetailsView">
                <div class="detail-grid">
                    <div class="detail-row">
                        <div class="detail-label">Vendor ID:</div>
                        <div class="detail-value">${vendor.id || vendor.vendor_id || vendor._id || 'N/A'}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Full Name:</div>
                        <div class="detail-value">${escapeHtml(vendor.name)}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Mobile Number:</div>
                        <div class="detail-value">${vendor.mobile}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Email:</div>
                        <div class="detail-value">${vendor.email || 'N/A'}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Firm/Company:</div>
                        <div class="detail-value">${escapeHtml(vendor.company_name)}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Aadhar Number:</div>
                        <div class="detail-value">${displayAadhar}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Aadhar Photo:</div>
                        <div class="detail-value">${displayAadharPhoto}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Address:</div>
                        <div class="detail-value">${escapeHtml(displayAddress)}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">City:</div>
                        <div class="detail-value">${displayCity}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">State:</div>
                        <div class="detail-value">${displayState}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Pincode:</div>
                        <div class="detail-value">${displayPincode}</div>
                    </div>
                    
                    <div class="detail-row">
                        <div class="detail-label">Category of Work:</div>
                        <div class="detail-value">
                            ${workCategories.length > 0 ? 
                                workCategories.map(cat => 
                                    `<span class="work-badge">${cat.replace(/_/g, ' ').toUpperCase()}</span>`
                                ).join('') : 
                                'No categories selected'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function handleEditVendor(vendor) {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = renderEditForm(vendor);
    
    const editForm = document.getElementById('editVendorForm');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const vendorId = vendor.id || vendor.vendor_id || vendor._id;
            const selectedWork = Array.from(document.querySelectorAll('#editWorkCategories input[type="checkbox"]:checked'))
                .map(cb => cb.value);
            
            const updatedData = {
                name: document.getElementById('editName').value.trim(),
                mobile: document.getElementById('editMobile').value.trim(),
                email: document.getElementById('editEmail').value.trim(),
                company_name: document.getElementById('editFirmName').value.trim(),
                address: document.getElementById('editAddress').value.trim(),
                city: document.getElementById('editCity').value.trim(),
                state: document.getElementById('editState').value,
                pincode: document.getElementById('editPincode').value.trim(),
                category_of_work: selectedWork
            };
            
            // Validation
            if (!updatedData.name || !updatedData.mobile || !updatedData.email || 
                !updatedData.company_name || !updatedData.address || !updatedData.state || 
                !updatedData.pincode || selectedWork.length === 0) {
                showMessage('Please fill all required fields', 'error');
                return;
            }
            
            if (!validateMobile(updatedData.mobile)) {
                showMessage('Valid 10-digit mobile number required', 'error');
                return;
            }
            
            if (!validateEmail(updatedData.email)) {
                showMessage('Valid email address required', 'error');
                return;
            }
            
            if (!validatePincode(updatedData.pincode)) {
                showMessage('Valid 6-digit pincode required', 'error');
                return;
            }
            
            showLoading(true);
            
            updateVendorDetails(vendorId, updatedData)
                .then(updatedVendor => {
                    showLoading(false);
                    showMessage('Vendor details updated successfully!', 'success');
                    renderDashboard(updatedVendor);
                })
                .catch(error => {
                    showLoading(false);
                    showMessage(error.message || 'Update failed. Please try again.', 'error');
                });
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            renderDashboard(vendor);
        });
    }
}

function renderEditForm(vendor) {
    const workCategories = vendor.category_of_work || [];
    
    const workOptions = [
        'lowside_ac_works', 'highside_ac_works', 'lowside_electrical_works', 
        'highside_electrical_works', 'ms_fabrication', 'plumbing', 'fire_fighting_works',
        'cctv_network_cabling_works', 'civil_works', 'tile_stove_works', 
        'carpentry_works', 'gypsum_works', 'pop_works', 'painting_coating_works', 'other'
    ];
    
    const workCheckboxes = workOptions.map(opt => {
        const isChecked = workCategories.includes(opt);
        const label = opt.replace(/_/g, ' ').toUpperCase();
        return `
            <div class="checkbox-item">
                <input type="checkbox" value="${opt}" ${isChecked ? 'checked' : ''}>
                <label>${label}</label>
            </div>
        `;
    }).join('');
    
    return `
        <div class="card">
            <div class="card-header">Edit Vendor Details</div>
            <form id="editVendorForm">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Full Name <span class="required">*</span></label>
                        <input type="text" id="editName" value="${escapeHtml(vendor.name)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Mobile Number <span class="required">*</span></label>
                        <input type="tel" id="editMobile" value="${vendor.mobile}" maxlength="10" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Email <span class="required">*</span></label>
                        <input type="email" id="editEmail" value="${vendor.email || ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Firm/Company Name <span class="required">*</span></label>
                        <input type="text" id="editFirmName" value="${escapeHtml(vendor.company_name)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Address <span class="required">*</span></label>
                        <textarea id="editAddress" rows="3" required>${escapeHtml(vendor.address || '')}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>City</label>
                        <input type="text" id="editCity" value="${vendor.city || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label>State <span class="required">*</span></label>
                        <select id="editState" required>
                            <option value="">Select State</option>
                            <option value="Andhra Pradesh" ${vendor.state === 'Andhra Pradesh' ? 'selected' : ''}>Andhra Pradesh</option>
                            <option value="Maharashtra" ${vendor.state === 'Maharashtra' ? 'selected' : ''}>Maharashtra</option>
                            <option value="Delhi" ${vendor.state === 'Delhi' ? 'selected' : ''}>Delhi</option>
                            <option value="Karnataka" ${vendor.state === 'Karnataka' ? 'selected' : ''}>Karnataka</option>
                            <option value="Tamil Nadu" ${vendor.state === 'Tamil Nadu' ? 'selected' : ''}>Tamil Nadu</option>
                            <option value="West Bengal" ${vendor.state === 'West Bengal' ? 'selected' : ''}>West Bengal</option>
                            <option value="Haryana" ${vendor.state === 'haryana' ? 'selected' : ''}>Haryana</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Pincode <span class="required">*</span></label>
                        <input type="text" id="editPincode" value="${vendor.pincode || ''}" maxlength="6" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Category of Work <span class="required">*</span></label>
                        <div class="checkbox-container" id="editWorkCategories">
                            ${workCheckboxes}
                        </div>
                    </div>
                </div>
                
                <div class="button-group">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" id="cancelEditBtn" class="btn btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    `;
}

function renderLoginView() {
    const mainContent = document.getElementById('mainContent');
    const header = document.getElementById('header');
    
    if (!mainContent) return;
    
    mainContent.innerHTML = renderLoginForm();
    header.style.display = 'none';
    
    // Reset state
    currentSessionId = null;
    currentMobile = null;
    
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    
    if (sendOtpBtn) sendOtpBtn.addEventListener('click', handleSendOTP);
    if (verifyOtpBtn) verifyOtpBtn.addEventListener('click', handleVerifyOTP);
    if (showRegisterBtn) showRegisterBtn.addEventListener('click', renderRegistrationView);
}

function renderRegistrationView() {
    const mainContent = document.getElementById('mainContent');
    const header = document.getElementById('header');
    
    if (!mainContent) return;
    
    mainContent.innerHTML = renderRegistrationForm();
    header.style.display = 'none';
    
    const regForm = document.getElementById('registrationForm');
    const showLoginBtn = document.getElementById('showLoginBtn');
    
    if (regForm) regForm.addEventListener('submit', handleRegistrationSubmit);
    if (showLoginBtn) showLoginBtn.addEventListener('click', renderLoginView);
}

// Make functions available globally
window.renderLoginView = renderLoginView;
window.renderRegistrationView = renderRegistrationView;
window.renderDashboard = renderDashboard;