/**
 * Vendor Registration Form JavaScript
 * 
 * API Integration for: /vendor-details
 * 
 * Expected Request Format:
 * POST /vendor-details
 * Content-Type: application/json
 * {
 *   "gst_details": {
 *     "firm_name": "string",
 *     "firm_type": "string",
 *     "country": "string",
 *     "gst_number": "string",
 *     "company_status": "string"
 *   },
 *   "pan_details": {
 *     "pan_number": "string"
 *   },
 *   "address": "string",
 *   "std_code_with_phone": "string",
 *   "contact_person_name": "string",
 *   "items_interested": ["string"],
 *   "city": "string",
 *   "fax": "string",
 *   "contact_person_designation": "string",
 *   "state": "string",
 *   "website": "string",
 *   "is_msme": "string",
 *   "country": "string",
 *   "mobile": "string",
 *   "business_description": "string",
 *   "pin": "string",
 *   "email": "string",
 *   "submitted_at": "ISO 8601 timestamp",
 *   "form_version": "1.0"
 * }
 * 
 * Expected Success Response:
 * {
 *   "success": true,
 *   "message": "Vendor registered successfully",
 *   "vendorId": "VEN001234",
 *   "submissionId": "SUB567890"
 * }
 * 
 * Expected Error Response:
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": {
 *     "fieldName": "Error message"
 *   }
 * }
 */

// Configuration
const API_CONFIG = {
    baseUrl: 'https://api-urban.zuhouz.com', // Backend server URL
    endpoint: '/api/vendor-details', // Direct endpoint
    timeout: 30000 // 30 seconds
};



// Bank details functionality
async function loadBankNames() {
    const bankSelect = document.getElementById('bankName');

    try {
        // Comprehensive list of Indian banks
        const indianBanks = [
            'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Punjab National Bank',
            'Canara Bank', 'Union Bank of India', 'Bank of Baroda', 'Indian Bank',
            'Central Bank of India', 'Indian Overseas Bank', 'UCO Bank', 'Bank of Maharashtra',
            'Punjab & Sind Bank', 'Bank of India', 'Axis Bank', 'Kotak Mahindra Bank',
            'IndusInd Bank', 'Yes Bank', 'IDFC First Bank', 'Federal Bank',
            'South Indian Bank', 'Karnataka Bank', 'City Union Bank', 'DCB Bank',
            'RBL Bank', 'Bandhan Bank', 'IDBI Bank', 'Jammu & Kashmir Bank',
            'Karur Vysya Bank', 'Nainital Bank', 'Tamilnad Mercantile Bank',
            'Lakshmi Vilas Bank', 'Dhanlaxmi Bank', 'Catholic Syrian Bank',
            'ESAF Small Finance Bank', 'Equitas Small Finance Bank', 'Jana Small Finance Bank',
            'AU Small Finance Bank', 'Ujjivan Small Finance Bank', 'Suryoday Small Finance Bank',
            'FINO Payments Bank', 'Paytm Payments Bank', 'Airtel Payments Bank',
            'India Post Payments Bank', 'Jio Payments Bank'
        ].sort();

        // Clear existing options
        bankSelect.innerHTML = '<option value="">--- Select Bank ---</option>';

        // Add bank options
        indianBanks.forEach(bank => {
            const option = document.createElement('option');
            option.value = bank.toLowerCase().replace(/\s+/g, '_');
            option.textContent = bank;
            bankSelect.appendChild(option);
        });

        console.log('✅ Bank names loaded successfully');
    } catch (error) {
        console.error('❌ Failed to load bank names:', error);
        bankSelect.innerHTML = `
            <option value="">--- Select Bank ---</option>
            <option value="state_bank_of_india">State Bank of India</option>
            <option value="hdfc_bank">HDFC Bank</option>
            <option value="icici_bank">ICICI Bank</option>
            <option value="punjab_national_bank">Punjab National Bank</option>
            <option value="axis_bank">Axis Bank</option>
            <option value="kotak_mahindra_bank">Kotak Mahindra Bank</option>
            <option value="other">Other</option>
        `;
    }
}

// Handle cancelled cheque upload
async function handleCancelledChequeUpload(event) {
    const file = event.target.files[0];
    const errorElement = document.getElementById('cancelledChequeError');

    if (!file) {
        uploadedCancelledChequeUrl = null;
        return;
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        errorElement.textContent = 'Please upload a PDF, JPG, JPEG or PNG file';
        event.target.value = '';
        uploadedCancelledChequeUrl = null;
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        errorElement.textContent = 'File size should be less than 5MB';
        event.target.value = '';
        uploadedCancelledChequeUrl = null;
        return;
    }

    try {
        // Show uploading state
        errorElement.textContent = 'Uploading...';
        errorElement.style.color = '#8B4513';

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", "cancelled_cheque");

        const response = await fetch(`${API_CONFIG.baseUrl}/api/upload-image`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.meta?.status === 200 || response.ok) {
            uploadedCancelledChequeUrl = result.data?.image_url || result.data?.file_url || result.url;
            errorElement.textContent = 'File uploaded successfully';
            errorElement.style.color = 'green';

            // Clear success message after 3 seconds
            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.color = 'red';
            }, 3000);
        } else {
            throw new Error(result.meta?.message || result.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Cancelled cheque upload error:', error);
        errorElement.textContent = 'Upload failed. Please try again.';
        errorElement.style.color = 'red';
        event.target.value = '';
        uploadedCancelledChequeUrl = null;
    }
}

// Setup bank details event listeners
function setupBankDetailsListeners() {
    // Add file upload handler for cancelled cheque
    document.getElementById('cancelledCheque').addEventListener('change', handleCancelledChequeUpload);
}

// Multiple upload functionality
function addUploadField(fieldPrefix, containerId, maxFiles) {
    const container = document.getElementById(containerId);
    const currentItems = container.querySelectorAll('.upload-item').length;

    if (currentItems >= maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
    }

    let counter;
    switch (fieldPrefix) {
        case 'workOrder':
            counter = ++workOrderCounter;
            break;
        case 'projectImage':
            counter = ++projectImageCounter;
            break;
        case 'financialDoc':
            counter = ++financialDocCounter;
            break;
        default:
            counter = currentItems + 1;
    }

    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';

    // Create input element
    const input = document.createElement('input');
    input.type = 'file';
    input.id = `${fieldPrefix}_${counter}`;
    input.name = `${fieldPrefix}[]`;
    input.accept = getAcceptedFileTypes(fieldPrefix);
    input.onchange = function () { handleMultipleFileUpload(this, fieldPrefix); };

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-upload-btn';
    removeBtn.textContent = '×';
    removeBtn.onclick = function () { removeUploadField(this); };

    // Add elements to upload item
    uploadItem.appendChild(input);
    uploadItem.appendChild(removeBtn);

    // Remove + button from previous item if this is not the first
    if (currentItems > 0) {
        const lastItem = container.querySelector('.upload-item:last-child .add-upload-btn');
        if (lastItem) lastItem.remove();
    }

    // Add + button to new item
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-upload-btn';
    addBtn.textContent = '+';
    addBtn.onclick = function () { addUploadField(fieldPrefix, containerId, maxFiles); };
    uploadItem.appendChild(addBtn);

    container.appendChild(uploadItem);
}

function removeUploadField(button) {
    const uploadItem = button.closest('.upload-item');
    const container = uploadItem.parentElement;
    const input = uploadItem.querySelector('input[type="file"]');
    const fieldPrefix = input.name.replace('[]', '').replace(/\d+$/, '');

    // Don't allow removing the last item
    const totalItems = container.querySelectorAll('.upload-item').length;
    if (totalItems <= 1) {
        alert('At least one upload field is required');
        return;
    }

    // Remove uploaded file from tracking if it exists
    if (input.dataset.uploadedUrl) {
        removeFromUploadedArray(fieldPrefix, input.dataset.uploadedUrl);
    }

    uploadItem.remove();

    // Ensure the last remaining item has an add button
    const lastItem = container.querySelector('.upload-item:last-child');
    if (lastItem && !lastItem.querySelector('.add-upload-btn')) {
        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'add-upload-btn';
        addBtn.textContent = '+';
        addBtn.onclick = function () { addUploadField(fieldPrefix, container.id, getMaxFiles(fieldPrefix)); };
        lastItem.appendChild(addBtn);
    }
}

function getAcceptedFileTypes(fieldPrefix) {
    switch (fieldPrefix) {
        case 'workOrder':
            return '.pdf,.jpg,.jpeg,.png';
        case 'projectImage':
            return '.jpg,.jpeg,.png';
        default:
            return '.pdf,.jpg,.jpeg,.png';
    }
}

function getMaxFiles(fieldPrefix) {
    switch (fieldPrefix) {
        case 'workOrder':
            return 5;
        case 'projectImage':
            return 10;
        default:
            return 5;
    }
}

function removeFromUploadedArray(fieldPrefix, url) {
    switch (fieldPrefix) {
        case 'workOrder':
            uploadedWorkOrders = uploadedWorkOrders.filter(item => item !== url);
            break;
        case 'projectImage':
            uploadedProjectImages = uploadedProjectImages.filter(item => item !== url);
            break;
    }
}

// Handle multiple file uploads
async function handleMultipleFileUpload(input, fieldPrefix) {
    console.log(`🔄 handleMultipleFileUpload called for ${fieldPrefix}`);
    const file = input.files[0];
    const uploadItem = input.closest('.upload-item');

    if (!file) {
        console.log(`❌ No file selected for ${fieldPrefix}`);
        // Clear any existing upload data
        if (input.dataset.uploadedUrl) {
            removeFromUploadedArray(fieldPrefix, input.dataset.uploadedUrl);
            delete input.dataset.uploadedUrl;
        }
        clearUploadStatus(uploadItem);
        return;
    }

    console.log(`📁 File selected for ${fieldPrefix}:`, file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file
    const validation = validateUploadFile(file, fieldPrefix);
    if (!validation.valid) {
        console.log(`❌ File validation failed for ${fieldPrefix}:`, validation.message);
        showUploadError(uploadItem, validation.message);
        input.value = '';
        return;
    }

    console.log(`✅ File validation passed for ${fieldPrefix}`);

    try {
        showUploadProgress(uploadItem);

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", fieldPrefix);

        console.log(`🌐 Making upload API call for ${fieldPrefix} to:`, `${API_CONFIG.baseUrl}/api/upload-image`);

        const response = await fetch(`${API_CONFIG.baseUrl}/api/upload-image`, {
            method: "POST",
            body: formData,
        });

        console.log(`📡 Upload API response for ${fieldPrefix}:`, response.status, response.ok);

        const result = await response.json();
        console.log(`📋 Upload API result for ${fieldPrefix}:`, result);

        if (result.meta?.status === 200 || response.ok) {
            const uploadedUrl = result.data?.image_url || result.data?.file_url || result.url;
            input.dataset.uploadedUrl = uploadedUrl;

            console.log(`✅ Upload successful for ${fieldPrefix}, URL:`, uploadedUrl);

            // Add to appropriate tracking array
            switch (fieldPrefix) {
                case 'workOrder':
                    uploadedWorkOrders.push(uploadedUrl);
                    console.log(`📁 Added to uploadedWorkOrders. Total count:`, uploadedWorkOrders.length);
                    break;
                case 'projectImage':
                    uploadedProjectImages.push(uploadedUrl);
                    console.log(`🖼️ Added to uploadedProjectImages. Total count:`, uploadedProjectImages.length);
                    break;
            }

            showUploadSuccess(uploadItem);
        } else {
            throw new Error(result.meta?.message || result.message || 'Upload failed');
        }
    } catch (error) {
        console.error(`❌ ${fieldPrefix} upload error:`, error);
        showUploadError(uploadItem, 'Upload failed. Please try again.');
        input.value = '';
    }
}

function validateUploadFile(file, fieldPrefix) {
    // File type validation
    const allowedTypes = {
        'workOrder': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        'projectImage': ['image/jpeg', 'image/jpg', 'image/png'],
        'companyProfile': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'completionCertificate': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        'experienceReference': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'],
        'financialDocument1': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        'financialDocument2': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        'financialDocument3': ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    };

    if (allowedTypes[fieldPrefix] && !allowedTypes[fieldPrefix].includes(file.type)) {
        return { valid: false, message: 'Invalid file type' };
    }

    // File size validation (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return { valid: false, message: 'File size should be less than 5MB' };
    }

    return { valid: true };
}

function showUploadProgress(uploadItem) {
    clearUploadStatus(uploadItem);
    const progressDiv = document.createElement('div');
    progressDiv.className = 'upload-progress';
    progressDiv.textContent = 'Uploading...';
    uploadItem.appendChild(progressDiv);
}

function showUploadSuccess(uploadItem) {
    clearUploadStatus(uploadItem);
    const successDiv = document.createElement('div');
    successDiv.className = 'upload-success';
    successDiv.textContent = 'Uploaded successfully';
    uploadItem.appendChild(successDiv);

    // Clear success message after 3 seconds
    setTimeout(() => {
        clearUploadStatus(uploadItem);
    }, 3000);
}

function showUploadError(uploadItem, message) {
    clearUploadStatus(uploadItem);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'upload-error';
    errorDiv.textContent = message;
    uploadItem.appendChild(errorDiv);
}

function clearUploadStatus(uploadItem) {
    const statusElements = uploadItem.querySelectorAll('.upload-progress, .upload-success, .upload-error');
    statusElements.forEach(el => el.remove());
}

// Single file upload handlers
async function handleSingleFileUpload(input, uploadType, trackingVariable) {
    const file = input.files[0];
    const errorElementId = uploadType + 'Error';
    const errorElement = document.getElementById(errorElementId);

    if (!file) {
        // Clear tracking variable
        if (trackingVariable === 'companyProfile') uploadedCompanyProfileUrl = null;
        else if (trackingVariable === 'completionCertificate') uploadedCompletionCertificateUrl = null;
        else if (trackingVariable === 'experienceReference') uploadedExperienceReferenceUrl = null;
        else if (trackingVariable === 'financialDocument1') uploadedFinancialDocument1Url = null;
        else if (trackingVariable === 'financialDocument2') uploadedFinancialDocument2Url = null;
        else if (trackingVariable === 'financialDocument3') uploadedFinancialDocument3Url = null;
        return;
    }

    // Validate file
    const validation = validateUploadFile(file, uploadType);
    if (!validation.valid) {
        errorElement.textContent = validation.message;
        errorElement.style.color = 'red';
        input.value = '';
        return;
    }

    try {
        errorElement.textContent = 'Uploading...';
        errorElement.style.color = '#8B4513';

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", uploadType);

        const response = await fetch(`${API_CONFIG.baseUrl}/api/upload-image`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.meta?.status === 200 || response.ok) {
            const uploadedUrl = result.data?.image_url || result.data?.file_url || result.url;

            // Set tracking variable
            if (trackingVariable === 'companyProfile') uploadedCompanyProfileUrl = uploadedUrl;
            else if (trackingVariable === 'completionCertificate') uploadedCompletionCertificateUrl = uploadedUrl;
            else if (trackingVariable === 'experienceReference') uploadedExperienceReferenceUrl = uploadedUrl;
            else if (trackingVariable === 'financialDocument1') uploadedFinancialDocument1Url = uploadedUrl;
            else if (trackingVariable === 'financialDocument2') uploadedFinancialDocument2Url = uploadedUrl;
            else if (trackingVariable === 'financialDocument3') uploadedFinancialDocument3Url = uploadedUrl;

            errorElement.textContent = 'File uploaded successfully';
            errorElement.style.color = 'green';

            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.color = 'red';
            }, 3000);
        } else {
            throw new Error(result.meta?.message || result.message || 'Upload failed');
        }
    } catch (error) {
        console.error(`${uploadType} upload error:`, error);
        errorElement.textContent = 'Upload failed. Please try again.';
        errorElement.style.color = 'red';
        input.value = '';
    }
}

// Setup document upload listeners
function setupDocumentUploadListeners() {
    document.getElementById('companyProfile').addEventListener('change', function () {
        handleSingleFileUpload(this, 'companyProfile', 'companyProfile');
    });

    document.getElementById('completionCertificate').addEventListener('change', function () {
        handleSingleFileUpload(this, 'completionCertificate', 'completionCertificate');
    });

    document.getElementById('financialDocument1').addEventListener('change', function () {
        handleSingleFileUpload(this, 'financialDocument1', 'financialDocument1');
    });

    document.getElementById('financialDocument2').addEventListener('change', function () {
        handleSingleFileUpload(this, 'financialDocument2', 'financialDocument2');
    });

    document.getElementById('financialDocument3').addEventListener('change', function () {
        handleSingleFileUpload(this, 'financialDocument3', 'financialDocument3');
    });

    document.getElementById('experienceReference').addEventListener('change', function () {
        handleSingleFileUpload(this, 'experienceReference', 'experienceReference');
    });
}

// Reset multiple upload containers
function resetMultipleUploadContainer(containerId, fieldPrefix) {
    const container = document.getElementById(containerId);
    const maxFiles = getMaxFiles(fieldPrefix);

    // Clear container
    container.innerHTML = '';

    // Create initial upload item
    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';

    // Create input element
    const input = document.createElement('input');
    input.type = 'file';
    input.id = `${fieldPrefix}_1`;
    input.name = `${fieldPrefix}[]`;
    input.accept = getAcceptedFileTypes(fieldPrefix);
    input.onchange = function () { handleMultipleFileUpload(this, fieldPrefix); };

    // Create add button (no remove button for first item)
    const addBtn = document.createElement('button');
    addBtn.type = 'button';
    addBtn.className = 'add-upload-btn';
    addBtn.textContent = '+';
    addBtn.onclick = function () { addUploadField(fieldPrefix, containerId, maxFiles); };

    // Add elements to upload item
    uploadItem.appendChild(input);
    uploadItem.appendChild(addBtn);

    // Add to container
    container.appendChild(uploadItem);
}

// Make functions globally accessible
window.addUploadField = addUploadField;
window.removeUploadField = removeUploadField;
window.handleMultipleFileUpload = handleMultipleFileUpload;



// Firm Type conditional field handling
function setupFirmTypeConditionalField() {
    const firmTypeSelect = document.getElementById('firmType');
    const specifyField = document.getElementById('firmTypeSpecifyField');
    const specifyInput = document.getElementById('firmTypeSpecify');

    firmTypeSelect.addEventListener('change', function () {
        if (this.value === 'others') {
            specifyField.style.display = 'flex';
            specifyInput.required = true;
        } else {
            specifyField.style.display = 'none';
            specifyInput.required = false;
            specifyInput.value = ''; // Clear the input
            document.getElementById('firmTypeSpecifyError').textContent = ''; // Clear any error
        }
    });
}

// MSME conditional field handling
let uploadedMSMECertificateUrl = null;

// Bank details handling
let uploadedCancelledChequeUrl = null;

// Document uploads tracking
let uploadedCompanyProfileUrl = null;
let uploadedCompletionCertificateUrl = null;
let uploadedExperienceReferenceUrl = null;

// Financial documents tracking (3 years)
let uploadedFinancialDocument1Url = null;
let uploadedFinancialDocument2Url = null;
let uploadedFinancialDocument3Url = null;

// Multiple file uploads tracking
let uploadedWorkOrders = [];
let uploadedProjectImages = [];

// Upload counters for multiple uploads
let workOrderCounter = 1;
let projectImageCounter = 1;

function setupMSMEConditionalField() {
    const msmeSelect = document.getElementById('msme');
    const certificateField = document.getElementById('msmeCertificateField');
    const certificateInput = document.getElementById('msmeCertificate');

    msmeSelect.addEventListener('change', function () {
        if (this.value === 'yes') {
            certificateField.style.display = 'flex';
            certificateInput.required = true;
        } else {
            certificateField.style.display = 'none';
            certificateInput.required = false;
            certificateInput.value = ''; // Clear the file input
            uploadedMSMECertificateUrl = null; // Clear uploaded URL
            document.getElementById('msmeCertificateError').textContent = ''; // Clear any error
        }
    });

    // Add file upload handler
    certificateInput.addEventListener('change', handleMSMECertificateUpload);
}

// Handle MSME certificate upload
async function handleMSMECertificateUpload(event) {
    const file = event.target.files[0];
    const errorElement = document.getElementById('msmeCertificateError');

    if (!file) {
        uploadedMSMECertificateUrl = null;
        return;
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        errorElement.textContent = 'Please upload a PDF, JPG, JPEG or PNG file';
        event.target.value = '';
        uploadedMSMECertificateUrl = null;
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        errorElement.textContent = 'File size should be less than 5MB';
        event.target.value = '';
        uploadedMSMECertificateUrl = null;
        return;
    }

    try {
        // Show uploading state
        errorElement.textContent = 'Uploading...';
        errorElement.style.color = '#8B4513';

        const formData = new FormData();
        formData.append("image", file);
        formData.append("type", "msme_certificate");

        const response = await fetch(`${API_CONFIG.baseUrl}/api/upload-image`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (result.meta?.status === 200 || response.ok) {
            uploadedMSMECertificateUrl = result.data?.image_url || result.data?.file_url || result.url;
            errorElement.textContent = 'File uploaded successfully';
            errorElement.style.color = 'green';

            // Clear success message after 3 seconds
            setTimeout(() => {
                errorElement.textContent = '';
                errorElement.style.color = 'red';
            }, 3000);
        } else {
            throw new Error(result.meta?.message || result.message || 'Upload failed');
        }
    } catch (error) {
        console.error('MSME certificate upload error:', error);
        errorElement.textContent = 'Upload failed. Please try again.';
        errorElement.style.color = 'red';
        event.target.value = '';
        uploadedMSMECertificateUrl = null;
    }
}

// Form validation
function validateField(fieldId, errorId, validationFunction) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(errorId);
    const value = field.value.trim();

    if (validationFunction(value)) {
        errorElement.textContent = '';
        field.style.borderColor = '#ccc';
        return true;
    } else {
        field.style.borderColor = 'red';
        return false;
    }
}

// Validation functions
function validateRequired(value) {
    return value !== '';
}

function validateEmail(value) {
    if (value === '') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
}

function validatePhone(value) {
    if (value === '') return false;
    const phoneRegex = /^[0-9\-\+\(\)\s]{10,}$/;
    return phoneRegex.test(value);
}

function validateGST(value) {
    if (value === '') return false;
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(value);
}

function validatePAN(value) {
    if (value === '') return false;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(value);
}

function validatePIN(value) {
    if (value === '') return false;
    const pinRegex = /^[1-9][0-9]{5}$/;
    return pinRegex.test(value);
}

function validateAccountNumber(value) {
    if (value === '') return false;
    // Account number should be 9-18 digits
    const accountRegex = /^[0-9]{9,18}$/;
    return accountRegex.test(value);
}

function validateIFSC(value) {
    if (value === '') return false;
    // IFSC format: 4 letters followed by 7 digits/letters
    const ifscRegex = /^[A-Z]{4}[0][A-Z0-9]{6}$/;
    return ifscRegex.test(value.toUpperCase());
}

function validateAccountHolderName(value) {
    if (value === '') return false;
    // Only letters, spaces, dots, and hyphens allowed
    const nameRegex = /^[A-Za-z\s\.\-]+$/;
    return nameRegex.test(value) && value.length >= 2;
}

// Real-time validation event listeners
function setupValidationListeners() {
    document.getElementById('firmName').addEventListener('blur', function () {
        if (!validateField('firmName', 'firmNameError', validateRequired)) {
            document.getElementById('firmNameError').textContent = 'Firm name is required';
        }
    });

    document.getElementById('gstNo').addEventListener('blur', function () {
        if (!validateField('gstNo', 'gstNoError', validateGST)) {
            document.getElementById('gstNoError').textContent = 'Invalid GST number format';
        }
    });

    document.getElementById('panNo').addEventListener('blur', function () {
        if (!validateField('panNo', 'panNoError', validatePAN)) {
            document.getElementById('panNoError').textContent = 'Invalid PAN number format';
        }
    });

    document.getElementById('email').addEventListener('blur', function () {
        if (!validateField('email', 'emailError', validateEmail)) {
            document.getElementById('emailError').textContent = 'Invalid email address';
        }
    });

    document.getElementById('mobile').addEventListener('blur', function () {
        if (!validateField('mobile', 'mobileError', validatePhone)) {
            document.getElementById('mobileError').textContent = 'Invalid mobile number';
        }
    });

    document.getElementById('pin').addEventListener('blur', function () {
        if (!validateField('pin', 'pinError', validatePIN)) {
            document.getElementById('pinError').textContent = 'Invalid PIN code';
        }
    });

    // Bank details validation listeners
    document.getElementById('accountNumber').addEventListener('blur', function () {
        if (!validateField('accountNumber', 'accountNumberError', validateAccountNumber)) {
            document.getElementById('accountNumberError').textContent = 'Account number should be 9-18 digits';
        }
    });

    document.getElementById('ifscCode').addEventListener('blur', function () {
        if (!validateField('ifscCode', 'ifscCodeError', validateIFSC)) {
            document.getElementById('ifscCodeError').textContent = 'Invalid IFSC code format (e.g., SBIN0001234)';
        }
    });

    document.getElementById('accountHolderName').addEventListener('blur', function () {
        if (!validateField('accountHolderName', 'accountHolderNameError', validateAccountHolderName)) {
            document.getElementById('accountHolderNameError').textContent = 'Invalid account holder name';
        }
    });

    // Reference email validation (optional field) - REMOVED since referenceEmail field was removed


}

// Form submission handler
function setupFormSubmission() {
    const form = document.getElementById('vendorForm');
    if (!form) {
        console.error('❌ Form with ID "vendorForm" not found!');
        return;
    }
    console.log('✅ Form found, setting up submission handler');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('🚀 Form submission started');

        let isValid = true;
        const requiredFields = [
            'firmName', 'firmType', 'gstNo', 'panNo', 'companyStatus',
            'address', 'contactPerson', 'itemsInterested', 'designation',
            'msme', 'state', 'mobile', 'pin',
            'bankName', 'accountNumber', 'ifscCode', 'accountHolderName',
            'financialYear1', 'financialYear2', 'financialYear3'
        ];

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        // Validate firm type specify if "others" is selected
        const firmTypeValue = document.getElementById('firmType').value;
        const firmTypeSpecifyField = document.getElementById('firmTypeSpecify');
        if (firmTypeValue === 'others') {
            if (!firmTypeSpecifyField.value.trim()) {
                document.getElementById('firmTypeSpecifyError').textContent = 'Please specify the firm type';
                isValid = false;
            }
        }

        // Validate MSME certificate if MSME is "yes"
        const msmeValue = document.getElementById('msme').value;
        if (msmeValue === 'yes') {
            if (!uploadedMSMECertificateUrl) {
                document.getElementById('msmeCertificateError').textContent = 'MSME certificate upload is required';
                document.getElementById('msmeCertificateError').style.color = 'red';
                isValid = false;
            }
        }

        // Validate cancelled cheque upload
        if (!uploadedCancelledChequeUrl) {
            document.getElementById('cancelledChequeError').textContent = 'Cancelled cheque upload is required';
            document.getElementById('cancelledChequeError').style.color = 'red';
            isValid = false;
        }

        // Validate company profile upload (required)
        if (!uploadedCompanyProfileUrl) {
            document.getElementById('companyProfileError').textContent = 'Company profile upload is required';
            document.getElementById('companyProfileError').style.color = 'red';
            isValid = false;
        }

        // Validate financial documents uploads (required for company_financial array)
        if (!uploadedFinancialDocument1Url) {
            document.getElementById('financialDocument1Error').textContent = 'Financial document for Year 1 is required';
            document.getElementById('financialDocument1Error').style.color = 'red';
            isValid = false;
        }

        if (!uploadedFinancialDocument2Url) {
            document.getElementById('financialDocument2Error').textContent = 'Financial document for Year 2 is required';
            document.getElementById('financialDocument2Error').style.color = 'red';
            isValid = false;
        }

        if (!uploadedFinancialDocument3Url) {
            document.getElementById('financialDocument3Error').textContent = 'Financial document for Year 3 is required';
            document.getElementById('financialDocument3Error').style.color = 'red';
            isValid = false;
        }

        // Experience and reference is optional - no validation needed
        // if (!uploadedExperienceReferenceUrl) {
        //     document.getElementById('experienceReferenceError').textContent = 'Experience & Reference document upload is required';
        //     document.getElementById('experienceReferenceError').style.color = 'red';
        //     isValid = false;
        // }



        // Validate required fields
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorId = fieldId + 'Error';

            if (fieldId === 'itemsInterested') {
                const checkboxes = document.querySelectorAll('input[name="itemsInterested"]:checked');
                if (checkboxes.length === 0) {
                    document.getElementById(errorId).textContent = 'Please select at least one item';
                    isValid = false;
                } else {
                    document.getElementById(errorId).textContent = '';
                }
            } else if (!field.value.trim()) {
                document.getElementById(errorId).textContent = 'This field is required';
                field.style.borderColor = 'red';
                isValid = false;
            } else {
                field.style.borderColor = '#ccc';
            }
        });

        // Validate specific formats (only if fields have values)
        if (document.getElementById('gstNo').value && !validateGST(document.getElementById('gstNo').value)) {
            document.getElementById('gstNoError').textContent = 'Invalid GST number format';
            isValid = false;
        }

        if (document.getElementById('panNo').value && !validatePAN(document.getElementById('panNo').value)) {
            document.getElementById('panNoError').textContent = 'Invalid PAN number format';
            isValid = false;
        }

        // Email format validation only if email is provided
        const emailValue = document.getElementById('email').value.trim();
        if (emailValue && !validateEmail(emailValue)) {
            document.getElementById('emailError').textContent = 'Invalid email address';
            isValid = false;
        }

        if (document.getElementById('pin').value && !validatePIN(document.getElementById('pin').value)) {
            document.getElementById('pinError').textContent = 'Invalid PIN code';
            isValid = false;
        }

        // Validate bank details formats
        if (document.getElementById('accountNumber').value && !validateAccountNumber(document.getElementById('accountNumber').value)) {
            document.getElementById('accountNumberError').textContent = 'Account number should be 9-18 digits';
            isValid = false;
        }

        if (document.getElementById('ifscCode').value && !validateIFSC(document.getElementById('ifscCode').value)) {
            document.getElementById('ifscCodeError').textContent = 'Invalid IFSC code format';
            isValid = false;
        }

        if (document.getElementById('accountHolderName').value && !validateAccountHolderName(document.getElementById('accountHolderName').value)) {
            document.getElementById('accountHolderNameError').textContent = 'Invalid account holder name';
            isValid = false;
        }



        console.log('🔍 Validation result:', isValid);
        if (isValid) {
            console.log('✅ Form validation passed, submitting to API...');
            // Show loading state
            document.body.classList.add('loading');

            // Submit form to API
            submitFormToAPI();
        } else {
            console.log('❌ Form validation failed');
            console.log('🔍 Checking for validation errors...');

            // Find all non-empty error messages
            const allErrors = document.querySelectorAll('.error-message:not(:empty)');
            console.log('📝 All validation errors found:', allErrors.length);
            allErrors.forEach((error, index) => {
                console.log(`Error ${index + 1}:`, error.textContent, 'Element:', error.previousElementSibling?.id);
            });

            // Scroll to first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                console.log('📍 Scrolling to first error:', firstError.textContent);
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// API submission function - Direct call to /vendor-details
async function submitFormToAPI() {
    console.log('🔄 submitFormToAPI function called');
    try {
        // Collect form data
        console.log('📊 Collecting form data...');
        const formData = collectFormData();
        console.log('📤 Form data collected:', formData);
        console.log('📁 Work Orders uploaded:', uploadedWorkOrders);
        console.log('🖼️ Project Images uploaded:', uploadedProjectImages);
        console.log('📄 Experience Reference uploaded:', uploadedExperienceReferenceUrl);
        console.log('📤 Sending data to:', API_CONFIG.baseUrl + API_CONFIG.endpoint);

        // Direct API call
        console.log('🌐 Making fetch request...');
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log('📡 Response received:', response);
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        // Handle response
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Success response:', result);
            showSuccessMessage(result);
            resetForm();
        } else {
            const errorData = await response.json();
            console.log('❌ Error response:', errorData);
            showErrorMessage(errorData);
        }
    } catch (error) {
        console.error('❌ API call failed:', error);

        const port = new URL(API_CONFIG.baseUrl).port || '80';
        let errorMessage = `Unable to connect to server. Please ensure your backend is running on port ${port}.`;

        if (error.message.includes('fetch')) {
            errorMessage = 'Connection failed. Check if backend server is running.';
        }

        showErrorMessage({
            message: errorMessage
        });
    } finally {
        // Remove loading state
        document.body.classList.remove('loading');
    }
}

// Collect form data into object
function collectFormData() {
    console.log('🔍 Starting form data collection...');
    const form = document.getElementById('vendorForm');

    // Helper function to safely get element values
    const getElementValue = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`❌ Element with ID '${id}' not found in HTML`);
            return '';
        }
        return element.value.trim();
    };

    // Helper function to check if a value should be included in payload
    const hasValue = (value) => {
        if (value === null || value === undefined || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === 'object' && Object.keys(value).length === 0) return false;
        return true;
    };

    // Helper function to clean object - only include properties with values
    const cleanObject = (obj) => {
        const cleaned = {};
        for (const [key, value] of Object.entries(obj)) {
            if (hasValue(value)) {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    const cleanedNested = cleanObject(value);
                    if (Object.keys(cleanedNested).length > 0) {
                        cleaned[key] = cleanedNested;
                    }
                } else {
                    cleaned[key] = value;
                }
            }
        }
        return cleaned;
    };

    // Handle checkboxes manually
    const checkedItems = document.querySelectorAll('input[name="itemsInterested"]:checked');
    const itemsInterested = Array.from(checkedItems).map(checkbox => checkbox.value).filter(value => value !== 'select_all');

    // Get firm type and specify value
    const firmTypeValue = getElementValue('firmType');
    const firmTypeSpecify = getElementValue('firmTypeSpecify');
    const finalFirmType = firmTypeValue === 'others' ? firmTypeSpecify : firmTypeValue;

    // Create company financial array (3 years)
    const companyFinancial = [
        {
            year: getElementValue('financialYear1'),
            turnover: uploadedFinancialDocument1Url || ""
        },
        {
            year: getElementValue('financialYear2'),
            turnover: uploadedFinancialDocument2Url || ""
        },
        {
            year: getElementValue('financialYear3'),
            turnover: uploadedFinancialDocument3Url || ""
        }
    ];

    // Structure data according to backend validation schema
    const data = {
        gst_details: {
            firm_name: getElementValue('firmName'),
            firm_type: finalFirmType,
            firm_type_specify: firmTypeValue === 'others' ? firmTypeSpecify : null,
            country: "India", // Default to India since country field was removed
            gst_number: getElementValue('gstNo'),
            company_status: getElementValue('companyStatus')
        },
        pan_details: {
            pan_number: getElementValue('panNo')
        },
        address: getElementValue('address'),
        std_code_with_phone: getElementValue('stdPhone'),
        contact_person_name: getElementValue('contactPerson'),
        items_interested: itemsInterested,
        city: getElementValue('city'),
        fax: getElementValue('fax'),
        contact_person_designation: getElementValue('designation'),
        state: getElementValue('state'),
        website: getElementValue('website'),
        is_msme: getElementValue('msme'),
        country: "India", // Required by backend validation
        mobile: getElementValue('mobile'),
        business_description: getElementValue('businessDescription'),
        pin: getElementValue('pin'),
        email: getElementValue('email'),

        // Add MSME certificate if uploaded
        msme_certificate: uploadedMSMECertificateUrl || null,

        // Experience and reference as string
        experience_and_reference: uploadedExperienceReferenceUrl || null,

        // Company profile (required)
        company_profile: uploadedCompanyProfileUrl || "",

        // Work order copies (optional array)
        work_order_copies: uploadedWorkOrders || [],

        // Project images (optional array)  
        project_images: uploadedProjectImages || [],

        // Company financial (required array of 3 objects)
        company_financial: companyFinancial,

        // Bank details (flattened to match backend schema)
        bank_name: getElementValue('bankName'),
        account_number: getElementValue('accountNumber'),
        ifsc_code: getElementValue('ifscCode').toUpperCase(),
        cancelled_cheque_copy: uploadedCancelledChequeUrl || "",

        // Additional bank fields for internal use
        account_holder_name: getElementValue('accountHolderName'),

        // Add timestamp and metadata
        submitted_at: new Date().toISOString(),
        form_version: '2.0'
    };

    // Clean the data object to remove empty fields before sending
    const cleanedData = cleanObject(data);
    
    console.log('📊 Original data:', data);
    console.log('🧹 Cleaned data (only fields with values):', cleanedData);

    return cleanedData;
}

// Show success message
function showSuccessMessage(result) {
    console.log(result, "result------------------------");
    const message = result.message || 'Form submitted successfully! Thank you for registering as a vendor with Urban Village Projects Pvt Ltd.';

    // Create success modal/alert
    if (typeof result.vendorId !== 'undefined') {
        alert(`${message}\n\nVendor ID: ${result.vendorId}\n\nPlease save this ID for future reference.`);
    } else {
        alert(message);
    }
}

// Show error message
function showErrorMessage(errorData) {
    let message = 'Form submission failed. Please try again.';

    if (errorData.message) {
        message = errorData.message;
    }

    // Handle validation errors from server
    if (errorData.errors && typeof errorData.errors === 'object') {
        const errorList = Object.entries(errorData.errors)
            .map(([field, error]) => `${field}: ${error}`)
            .join('\n');
        message += '\n\nValidation Errors:\n' + errorList;

        // Highlight fields with server-side errors
        highlightServerErrors(errorData.errors);
    }

    alert(message);
}

// Highlight fields that have server-side validation errors
function highlightServerErrors(errors) {
    // Map API field names to form field IDs (now using flattened structure)
    const fieldMapping = {
        'gst_details.firm_name': 'firmName',
        'gst_details.firm_type': 'firmType',
        'gst_details.country': 'country',
        'gst_details.gst_number': 'gstNo',
        'gst_details.company_status': 'companyStatus',
        'pan_details.pan_number': 'panNo',
        'contact_person_name': 'contactPerson',
        'items_interested': 'itemsInterested',
        'contact_person_designation': 'designation',
        'is_msme': 'msme',
        'business_description': 'businessDescription',
        'bank_name': 'bankName',
        'account_number': 'accountNumber',
        'ifsc_code': 'ifscCode',
        'cancelled_cheque_copy': 'cancelledCheque',
        'account_holder_name': 'accountHolderName',
        'msme_certificate': 'msmeCertificate',
        'experience_and_reference': 'experienceReference',
        'company_profile': 'companyProfile',
        'work_order_copies': 'workOrderContainer',
        'project_images': 'projectImagesContainer',
        'company_financial': 'financialYear1' // Map to first financial year field
    };

    Object.keys(errors).forEach(apiFieldName => {
        // Map API field name to form field ID
        const formFieldId = fieldMapping[apiFieldName] || apiFieldName;
        const field = document.getElementById(formFieldId);
        const errorElement = document.getElementById(formFieldId + 'Error');

        if (field && errorElement) {
            if (formFieldId === 'itemsInterested') {
                // For checkboxes, highlight the container and show error
                const checkboxContainer = document.querySelector('.checkbox-container');
                if (checkboxContainer) {
                    checkboxContainer.style.borderColor = 'red';
                }
                errorElement.textContent = errors[apiFieldName];
            } else {
                field.style.borderColor = 'red';
                errorElement.textContent = errors[apiFieldName];
            }
        }
    });
}

// Reset form function
function resetForm() {
    document.getElementById('vendorForm').reset();
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.style.color = 'red'; // Reset error color
    });
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '#ccc';
    });
    // Reset all checkboxes
    document.querySelectorAll('input[name="itemsInterested"]').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset firm type specify field
    document.getElementById('firmTypeSpecifyField').style.display = 'none';
    document.getElementById('firmTypeSpecify').required = false;

    // Reset MSME certificate upload
    uploadedMSMECertificateUrl = null;
    document.getElementById('msmeCertificateField').style.display = 'none';
    document.getElementById('msmeCertificate').required = false;

    // Reset bank details
    uploadedCancelledChequeUrl = null;
    loadBankNames(); // Reload bank names dropdown

    // Reset document uploads
    uploadedCompanyProfileUrl = null;
    uploadedCompletionCertificateUrl = null;
    uploadedExperienceReferenceUrl = null;

    // Reset financial document uploads
    uploadedFinancialDocument1Url = null;
    uploadedFinancialDocument2Url = null;
    uploadedFinancialDocument3Url = null;

    // Reset multiple file uploads
    uploadedWorkOrders = [];
    uploadedProjectImages = [];

    // Reset upload counters
    workOrderCounter = 1;
    projectImageCounter = 1;

    // Reset multiple upload containers to initial state
    // resetMultipleUploadContainer('workOrderContainer', 'workOrder');
    // resetMultipleUploadContainer('projectImagesContainer', 'projectImage');

    // Re-setup event handlers for existing HTML inputs
    setupMultipleUploadHandlers();
}

// Checkbox functionality: Handle "Select all" checkbox
function setupCheckboxHandlers() {
    const selectAllCheckbox = document.getElementById('select_all');
    const itemCheckboxes = document.querySelectorAll('input[name="itemsInterested"]:not(#select_all)');

    // Handle "Select all" checkbox
    selectAllCheckbox.addEventListener('change', function () {
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Handle individual checkboxes
    itemCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Check if all items are selected
            const allChecked = Array.from(itemCheckboxes).every(cb => cb.checked);
            const noneChecked = Array.from(itemCheckboxes).every(cb => !cb.checked);

            // Update "Select all" checkbox state
            selectAllCheckbox.checked = allChecked;
            selectAllCheckbox.indeterminate = !allChecked && !noneChecked;
        });
    });
}

// Handle responsive behavior for checkbox container
function handleResize() {
    const checkboxContainer = document.querySelector('.checkbox-container');
    if (window.innerWidth <= 768) {
        checkboxContainer.style.height = '150px';
    } else if (window.innerWidth <= 1024) {
        checkboxContainer.style.height = '200px';
    } else {
        checkboxContainer.style.height = '300px';
    }
}

// Setup responsive handlers
function setupResponsiveHandlers() {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
}

// Setup event handlers for existing multiple upload fields in HTML
function setupMultipleUploadHandlers() {
    console.log('🔧 Setting up multiple upload handlers...');

    // Setup Work Order upload handler
    const workOrderInput = document.getElementById('workOrder_1');
    if (workOrderInput) {
        console.log('✅ Found workOrder_1 input, attaching handler');
        workOrderInput.onchange = function () {
            console.log('🔄 workOrder_1 onchange triggered');
            handleMultipleFileUpload(this, 'workOrder');
        };
    } else {
        console.error('❌ workOrder_1 input not found');
    }

    // Setup Project Image upload handler  
    const projectImageInput = document.getElementById('projectImage_1');
    if (projectImageInput) {
        console.log('✅ Found projectImage_1 input, attaching handler');
        projectImageInput.onchange = function () {
            console.log('🔄 projectImage_1 onchange triggered');
            handleMultipleFileUpload(this, 'projectImage');
        };
    } else {
        console.error('❌ projectImage_1 input not found');
    }
}


// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎯 DOM Content Loaded - Initializing form...');

    setupFirmTypeConditionalField();
    setupMSMEConditionalField();
    setupBankDetailsListeners();
    setupDocumentUploadListeners();
    loadBankNames();
    setupValidationListeners();
    setupFormSubmission();
    setupCheckboxHandlers();
    setupResponsiveHandlers();
    setupMultipleUploadHandlers(); // Call the new function here

    // Set default values
    const countryField = document.getElementById('country');
    const vendorCountryField = document.getElementById('vendorCountry');

    if (countryField) countryField.value = 'India';
    if (vendorCountryField) vendorCountryField.value = 'India';

    console.log('✅ Form initialization complete!');
});

// Global function for reset button (called from HTML)
window.resetForm = resetForm; 