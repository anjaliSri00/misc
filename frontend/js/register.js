// Registration Functions

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'aadhar_photo');
    
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.uploadImage}`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Upload failed');
        }
        
        const imageUrl = result.data?.image_url?.url || result.data?.file_url || result.url;
        
        if (!imageUrl) {
            throw new Error('No image URL returned');
        }
        
        return imageUrl;
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

async function registerVendor(formData) {
    try {
        const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.register}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.meta?.message || 'Registration failed');
        }
        
        const vendor = data.data || data.vendor || data;
        const vendorId = vendor.id || vendor.vendor_id || vendor._id;
        
        if (vendorId) {
            sessionStorage.setItem(STORAGE_KEYS.vendorId, vendorId);
            sessionStorage.setItem(STORAGE_KEYS.vendorData, JSON.stringify(vendor));
            sessionStorage.setItem(STORAGE_KEYS.mobileNumber, formData.mobile);
        }
        
        return vendor;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

function renderRegistrationForm() {
    return `
        <div class="auth-container">
            <div class="card">
                <div class="card-header">Vendor Registration</div>
                <form id="registrationForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Full Name <span class="required">*</span></label>
                            <input type="text" id="regName" required>
                            <div class="error-message" id="regNameError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Mobile Number <span class="required">*</span></label>
                            <input type="tel" id="regMobile" maxlength="10" required>
                            <div class="error-message" id="regMobileError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Email <span class="required">*</span></label>
                            <input type="email" id="regEmail" required>
                            <div class="error-message" id="regEmailError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Firm/Company Name <span class="required">*</span></label>
                            <input type="text" id="regFirmName" required>
                            <div class="error-message" id="regFirmNameError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Aadhar Number <span class="required">*</span></label>
                            <input type="text" id="regAadhar" maxlength="12" required>
                            <div class="error-message" id="regAadharError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Aadhar Photo <span class="required">*</span></label>
                            <input type="file" id="regAadharPhoto" accept=".pdf,.jpg,.jpeg,.png" required>
                            <div class="error-message" id="regAadharPhotoError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Address <span class="required">*</span></label>
                            <textarea id="regAddress" rows="3" required></textarea>
                            <div class="error-message" id="regAddressError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>City</label>
                            <input type="text" id="regCity">
                        </div>
                        
                        <div class="form-group">
                            <label>State <span class="required">*</span></label>
                            <select id="regState" required>
                                <option value="">Select State</option>
                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Delhi">Delhi</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Tamil Nadu">Tamil Nadu</option>
                                <option value="West Bengal">West Bengal</option>
                                <option value="Uttar Pradesh">Uttar Pradesh</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Rajasthan">Rajasthan</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Bihar">Bihar</option>
                                <option value="Punjab">Punjab</option>
                                <option value="Haryana">Haryana</option>
                            </select>
                            <div class="error-message" id="regStateError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Pincode <span class="required">*</span></label>
                            <input type="text" id="regPincode" maxlength="6" required>
                            <div class="error-message" id="regPincodeError"></div>
                        </div>
                        
                        <div class="form-group">
                            <label>Category of Work <span class="required">*</span></label>
                            <div class="checkbox-container" id="workCategories">
                                <div class="checkbox-item">
                                    <input type="checkbox" value="lowside_ac_works"> Low side AC Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="highside_ac_works"> High side AC Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="lowside_electrical_works"> Low side Electrical Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="highside_electrical_works"> High side Electrical Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="ms_fabrication"> MS Fabrication Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="plumbing"> Plumbing Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="fire_fighting_works"> Fire Fighting Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="cctv_network_cabling_works"> CCTV Network Cabling Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="civil_works"> Civil Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="tile_stove_works"> Tile/Stone Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="carpentry_works"> Carpentry Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="gypsum_works"> Gypsum Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="pop_works"> POP Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="painting_coating_works"> Painting/Coating Work
                                </div>
                                <div class="checkbox-item">
                                    <input type="checkbox" value="other"> Other
                                </div>
                            </div>
                            <div class="error-message" id="regWorkError"></div>
                        </div>
                    </div>
                    
                    <div class="button-group">
                        <button type="submit" class="btn btn-primary">Register</button>
                        <button type="button" id="showLoginBtn" class="btn btn-secondary">Already Registered? Login</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function handleRegistrationSubmit(event) {
    event.preventDefault();
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Get form values
    const name = document.getElementById('regName').value.trim();
    const mobile = document.getElementById('regMobile').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const company_name = document.getElementById('regFirmName').value.trim();
    const aadhaar_number = document.getElementById('regAadhar').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    const city = document.getElementById('regCity').value.trim();
    const state = document.getElementById('regState').value;
    const pincode = document.getElementById('regPincode').value.trim();
    const aadharPhoto = document.getElementById('regAadharPhoto').files[0];
    
    // Get selected work categories
    const selectedWork = Array.from(document.querySelectorAll('#workCategories input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Validation
    let isValid = true;
    
    if (!name) {
        document.getElementById('regNameError').textContent = 'Name is required';
        isValid = false;
    }
    
    if (!validateMobile(mobile)) {
        document.getElementById('regMobileError').textContent = 'Valid 10-digit mobile number required';
        isValid = false;
    }
    
    if (!validateEmail(email)) {
        document.getElementById('regEmailError').textContent = 'Valid email address required';
        isValid = false;
    }
    
    if (!company_name) {
        document.getElementById('regFirmNameError').textContent = 'Firm/Company name is required';
        isValid = false;
    }
    
    if (!validateAadhar(aadhaar_number)) {
        document.getElementById('regAadharError').textContent = 'Valid 12-digit Aadhar number required';
        isValid = false;
    }
    
    if (!aadharPhoto) {
        document.getElementById('regAadharPhotoError').textContent = 'Aadhar photo is required';
        isValid = false;
    }
    
    if (!address) {
        document.getElementById('regAddressError').textContent = 'Address is required';
        isValid = false;
    }
    
    if (!state) {
        document.getElementById('regStateError').textContent = 'Please select state';
        isValid = false;
    }
    
    if (!validatePincode(pincode)) {
        document.getElementById('regPincodeError').textContent = 'Valid 6-digit pincode required';
        isValid = false;
    }
    
    if (selectedWork.length === 0) {
        document.getElementById('regWorkError').textContent = 'Please select at least one work category';
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    showLoading(true);
    
    // Upload aadhar photo first
    uploadFile(aadharPhoto)
        .then(aadhaar_photo => {
            const formData = {
                name,
                mobile,
                email,
                company_name,
                aadhaar_number,
                aadhaar_photo,
                address,
                city,
                state,
                pincode,
                category_of_work: selectedWork
            };
            
            return registerVendor(formData);
        })
        .then(vendor => {
            showLoading(false);
            showMessage('Registration successful! Please login with OTP.', 'success');
            renderLoginView();
        })
        .catch(error => {
            showLoading(false);
            showMessage(error.message || 'Registration failed. Please try again.', 'error');
        });
}