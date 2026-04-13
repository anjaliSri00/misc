const API_CONFIG = {
    baseUrl: 'http://localhost:8000',
    endpoint: '/api/v1/vendor/register',
    timeout: 30000
};

// Global upload tracking
let uploadedAadharPhotoUrl = null;

// Aadhar photo upload handler
async function handleAadharPhotoUpload(event) {
    const file = event.target.files[0];
    const errorElement = document.getElementById('aadhar_photo_error');

    if (!file) {
        uploadedAadharPhotoUrl = null;
        return;
    }

    // Validate file type and size (5MB max)
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        errorElement.textContent = 'Please upload PDF, JPG, JPEG or PNG';
        event.target.value = '';
        uploadedAadharPhotoUrl = null;
        return;
    }

    if (file.size > 5 * 1024 * 1024) {
        errorElement.textContent = 'File size must be less than 5MB';
        event.target.value = '';
        uploadedAadharPhotoUrl = null;
        return;
    }

    try {
        errorElement.textContent = 'Uploading...';
        errorElement.style.color = '#444';

        const formData = new FormData();
        formData.append('image', file);
        formData.append('type', 'aadhar_photo');

        const response = await fetch(`${API_CONFIG.baseUrl}/api/v1/common/upload-image`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.meta?.status === 200 || response.ok) {
            uploadedAadharPhotoUrl = result.data?.image_url.url || result.data?.file_url || result.url;
            errorElement.textContent = '✅ Uploaded successfully';
            errorElement.style.color = 'green';
            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.color = 'red';
            }, 3000);
        } else {
            throw new Error(result.meta?.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Aadhar upload error:', error);
        errorElement.textContent = 'Upload failed. Try again.';
        errorElement.style.color = 'red';
        event.target.value = '';
        uploadedAadharPhotoUrl = null;
    }
}

// Validation functions
function validateRequired(value) {
    return value.trim() !== '';
}

function setupInputCleaners() {
    // Mobile - numbers only, max 10 digits
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 10);
        });
    }
    
    // Aadhar - numbers only, max 12 digits
    const aadharInput = document.getElementById('aadhar_number');
    if (aadharInput) {
        aadharInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 12);
        });
    }
    
    // PIN - numbers only, max 6 digits
    const pinInput = document.getElementById('pin');
    if (pinInput) {
        pinInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
        });
    }
    
    // Name - no special characters (optional)
    const nameInput = document.getElementById('contactPerson');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
        });
    }
}

function validateMobile(value) {
    const cleaned = value.toString().replace(/[^0-9]/g, '');
    const isValid = /^\d{10}$/.test(cleaned);
    console.log('Mobile validation:', { original: value, cleaned, isValid });
    return isValid;
}

function validateAadhar(value) {
    const cleaned = value.toString().replace(/[^0-9]/g, '');
    const isValid = /^\d{12}$/.test(cleaned);
    console.log('Aadhar validation:', { original: value, cleaned, isValid });
    return isValid;
}

function validatePin(value) {
    const cleaned = value.toString().replace(/[^0-9]/g, '');
    const isValid = /^\d{6}$/.test(cleaned);
    console.log('PIN validation:', { original: value, cleaned, isValid });
    return isValid;
}

function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value.trim());
    console.log('Email validation:', { value: value.trim(), isValid });
    return isValid;
}

function validateField(fieldId, errorId, validator, errorMsg) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(errorId);
    
    if (!field || !errorEl) {
        console.error('Field or error element not found:', fieldId, errorId);
        return false;
    }
    
    let value = field.value;
    
    // Special handling for different field types
    if (fieldId === 'mobile' || fieldId === 'aadhar_number' || fieldId === 'pin') {
        // Clean the value for number fields
        value = value.replace(/[^0-9]/g, '');
    }
    
    const isValid = validator(value);
    
    if (isValid) {
        errorEl.textContent = '';
        field.style.borderColor = '#ccc';
        return true;
    } else {
        errorEl.textContent = errorMsg;
        field.style.borderColor = '#f44336';
        return false;
    }
}

// Real-time validation setup
function setupValidationListeners() {
    // Name
    document.getElementById('contactPerson').addEventListener('blur', () => {
        validateField('contactPerson', 'contactPersonError', validateRequired, 'Name is required');
    });

    // Mobile
    document.getElementById('mobile').addEventListener('blur', () => {
        validateField('mobile', 'mobileError', validateMobile, 'Enter valid 10-digit mobile');
    });

    // Email
    document.getElementById('email').addEventListener('blur', () => {
        if (!validateField('email', 'emailError', validateEmail, 'Enter valid email')) {
            document.getElementById('emailError').textContent = 'Enter valid email address';
        }
    });

    // Firm name
    document.getElementById('firmName').addEventListener('blur', () => {
        validateField('firmName', 'firmNameError', validateRequired, 'Firm name is required');
    });

    // Aadhar number
    document.getElementById('aadhar_number').addEventListener('blur', () => {
        validateField('aadhar_number', 'aadharNoError', validateAadhar, 'Enter valid 12-digit Aadhar');
    });

    // Address
    document.getElementById('address').addEventListener('blur', () => {
        validateField('address', 'addressError', validateRequired, 'Address is required');
    });

    // State
    document.getElementById('state').addEventListener('change', () => {
        validateField('state', 'stateError', validateRequired, 'Select state');
    });

    // Pin
    document.getElementById('pin').addEventListener('blur', () => {
        validateField('pin', 'pinError', validatePin, 'Enter valid 6-digit PIN');
    });
}

// Checkbox handlers (select all)
function setupCheckboxHandlers() {
    const selectAll = document.getElementById('select_all');
    const checkboxes = document.querySelectorAll('input[name="itemsInterested"]:not(#select_all)');

    if (selectAll) {
        selectAll.addEventListener('change', () => {
            checkboxes.forEach(cb => cb.checked = selectAll.checked);
        });
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const allChecked = Array.from(checkboxes).every(c => c.checked);
            const noneChecked = Array.from(checkboxes).every(c => !c.checked);
            if (selectAll) {
                selectAll.checked = allChecked;
                selectAll.indeterminate = !allChecked && !noneChecked;
            }
        });
    });
}

// Collect form data
function collectFormData() {
    const checkedBoxes = document.querySelectorAll('input[name=\"itemsInterested\"]:checked');
    const itemsInterested = Array.from(checkedBoxes)
        .map(cb => cb.value)
        .filter(val => val !== 'select_all');

    return {
        name: document.getElementById('contactPerson').value.trim(),
        mobile: document.getElementById('mobile').value.trim(),
        email: document.getElementById('email').value.trim(),
        company_name: document.getElementById('firmName').value.trim(),
        aadhaar_number: document.getElementById('aadhar_number').value.trim(),
        aadhaar_photo: uploadedAadharPhotoUrl || '',
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value,
        pincode: document.getElementById('pin').value.trim(),
        category_of_work: itemsInterested
    };
}

// Form submission
async function submitFormToAPI() {
    try {
        // Client-side validation
        let isValid = true;

        // Check aadhar photo upload
        if (!uploadedAadharPhotoUrl) {
            document.getElementById('aadhar_photo_error').textContent = 'Aadhar photo upload is required';
            document.getElementById('aadhar_photo_error').style.color = 'red';
            isValid = false;
        }

        // Check checkboxes
        const checkedCount = document.querySelectorAll('input[name=\"itemsInterested\"]:checked').length;
        if (checkedCount === 0 || (checkedCount === 1 && document.getElementById('select_all').checked)) {
            document.getElementById('itemsInterestedError').textContent = 'Select at least one category';
            isValid = false;
        }

        // Run field validations
        isValid = isValid && 
            validateField('contactPerson', 'contactPersonError', validateRequired, 'Name is required') &&
            validateField('mobile', 'mobileError', validateMobile, 'Enter valid 10-digit mobile') &&
            validateField('email', 'emailError', validateEmail, 'Enter valid email') &&
            validateField('firmName', 'firmNameError', validateRequired, 'Firm name is required') &&
            validateField('aadhar_number', 'aadharNoError', validateAadhar, 'Enter valid 12-digit Aadhar') &&
            validateField('address', 'addressError', validateRequired, 'Address is required') &&
            validateField('state', 'stateError', validateRequired, 'Select state') &&
            validateField('pin', 'pinError', validatePin, 'Enter valid 6-digit PIN');

        if (!isValid) {
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        // Show loading
        document.body.classList.add('loading');

        const formData = collectFormData();
        console.log('Submitting:', formData);

        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message || '✅ Vendor registration successful!');
            resetForm();
        } else {
            const error = await response.json();
            alert('❌ ' + (error.message || 'Registration failed'));
        }
    } catch (error) {
        console.error('Submission error:', error);
        alert('❌ Network error. Check if backend is running on localhost:8000');
    } finally {
        document.body.classList.remove('loading');
    }
}

// Setup form submission
function setupFormSubmission() {
    document.getElementById('vendorForm').addEventListener('submit', (e) => {
        e.preventDefault();
        submitFormToAPI();
    });
}

// Reset form
function resetForm() {
    document.getElementById('vendorForm').reset();
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.color = 'red';
    });
    document.querySelectorAll('input:not([type=checkbox]), select, textarea').forEach(field => {
        field.style.borderColor = '#ccc';
    });
    document.querySelectorAll('input[name=\"itemsInterested\"]').forEach(cb => cb.checked = false);
    uploadedAadharPhotoUrl = null;
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Vendor form initialized');
    
    setupInputCleaners();
    // Setup handlers
    setupValidationListeners();
    setupCheckboxHandlers();
    setupFormSubmission();
    
    // Aadhar photo upload
    document.getElementById('aadhar_photo').addEventListener('change', handleAadharPhotoUpload);
    
    // Global reset
    window.resetForm = resetForm;
});

// Expose for Cancel button onclick
window.resetForm = resetForm;

