/**
 * Vendor Dashboard Management System
 * Handles vendor list display, details view, and session management
 */
class VendorDashboard {
    constructor() {
        // Configuration
<<<<<<< Updated upstream
        this.baseURL = (window.DASHBOARD_CONFIG && window.DASHBOARD_CONFIG.API && window.DASHBOARD_CONFIG.API.BASE_URL) || 'http://localhost:3000';
=======
        this.baseURL = 'https://api-urban.zuhouz.com';
>>>>>>> Stashed changes
        this.sessionDuration = 30 * 60 * 1000; // 30 minutes
        
        // State management
        this.vendors = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.totalVendors = 0;
        this.totalPages = 0;
        this.searchTerm = '';
        this.debouncedSearchTerm = '';
        this.sortColumn = '';
        this.sortDirection = 'asc';
        this.loading = false;
        this.searchTimeout = null;
        this.sessionTimer = null;
        this.countdownTimer = null;

        // Current view state
        this.currentView = 'list'; // 'list' or 'details'
        this.selectedVendorId = null;

        // Filter options and selected filters
        this.filterOptions = {
            companyStatus: [],
            city: [],
            itemsInterested: []
        };
        this.selectedFilters = {
            companyStatus: '',
            city: '',
            itemsInterested: ''
        };

        // Partners state
        this.partners = [];
        this.partnerCurrentPage = 1;
        this.partnerItemsPerPage = 10;
        this.partnerTotal = 0;
        this.partnerTotalPages = 0;
        this.partnerSearchTerm = '';
        this.partnerDebouncedSearchTerm = '';
        this.partnerSearchTimeout = null;
        this.partnerLoading = false;

        // Leads state
        this.leads = [];
        this.leadCurrentPage = 1;
        this.leadItemsPerPage = 10;
        this.leadTotal = 0;
        this.leadTotalPages = 0;
        this.leadSearchTerm = '';
        this.leadDebouncedSearchTerm = '';
        this.leadSearchTimeout = null;
        this.leadLoading = false;

        try {
            // console.log('VendorDashboard: Starting initialization...');
            this.initializeElements();
            // console.log('VendorDashboard: Elements initialized');
            
            this.bindEvents();
            // console.log('VendorDashboard: Events bound');
            
            this.initializeSession();
            // console.log('VendorDashboard: Session initialized');
            
            this.initializeTableView();
            // console.log('VendorDashboard: Table view initialized');
            
            this.fetchVendors();
            // console.log('VendorDashboard: Vendor fetch initiated');
            
            this.fetchAndPopulateFilters();
            // console.log('VendorDashboard: Filters fetched and populated');
            
            // Initialize view state - show vendors, hide partners
            this.initializeViewState();
                
        } catch (error) {
            console.error('VendorDashboard initialization failed:', error);
            throw error;
        }
        
        // Add resize listener for responsive behavior
        window.addEventListener('resize', () => this.handleResize());
    }

    initializeElements() {
        // console.log('VendorDashboard: Initializing DOM elements...');
        
        // Navigation elements
        this.vendorsTab = document.getElementById('vendorsTab');
        this.partnersTab = document.getElementById('partnersTab');
        this.leadsTab = document.getElementById('leadsTab');
        this.logoutButton = document.getElementById('logoutButton');
        this.userNameDisplay = document.getElementById('userNameDisplay');
        this.sessionTimeRemaining = document.getElementById('sessionTimeRemaining');
        
        // Check critical elements
        const criticalElements = [
            { name: 'vendorsTab', element: this.vendorsTab },
            { name: 'logoutButton', element: this.logoutButton },
            { name: 'userNameDisplay', element: this.userNameDisplay }
        ];
        
        for (const { name, element } of criticalElements) {
            if (!element) {
                console.error(`Critical element missing: ${name}`);
            } else {
                console.log(`Element found: ${name}`);
            }
        }

        // Vendor list elements
        this.vendorListSection = document.getElementById('vendorListSection');
        this.searchInput = document.getElementById('searchInput');
        this.clearSearchBtn = document.getElementById('clearSearchBtn');
        this.exportCSVBtn = document.getElementById('exportCSVBtn');
        this.viewToggle = document.getElementById('viewToggle');
        this.tableViewBtn = document.getElementById('tableViewBtn');
        this.cardViewBtn = document.getElementById('cardViewBtn');
        this.vendorsTable = document.getElementById('vendorsTable');
        this.vendorsTableBody = document.getElementById('vendorsTableBody');
        this.loadingMessage = document.getElementById('loadingMessage');
        this.noDataMessage = document.getElementById('noDataMessage');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');

        // Pagination elements
        this.paginationContainer = document.getElementById('paginationContainer');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.itemsPerPageSelect = document.getElementById('itemsPerPageSelect');
        this.prevPageBtn = document.getElementById('prevPageBtn');
        this.nextPageBtn = document.getElementById('nextPageBtn');
        this.pageNumbers = document.getElementById('pageNumbers');

        // Vendor details elements
        this.vendorDetailsSection = document.getElementById('vendorDetailsSection');
        this.backToVendorsBtn = document.getElementById('backToVendorsBtn');
        this.vendorDetailsContent = document.getElementById('vendorDetailsContent');
        this.vendorDetailsLoading = document.getElementById('vendorDetailsLoading');

        // Message elements
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.closeErrorBtn = document.getElementById('closeErrorBtn');
        this.successMessage = document.getElementById('successMessage');
        this.successText = document.getElementById('successText');
        this.closeSuccessBtn = document.getElementById('closeSuccessBtn');

        // Page title
        this.pageTitle = document.getElementById('pageTitle');
        this.lastUpdated = document.getElementById('lastUpdated');

        // Filter dropdowns
        this.companyStatusFilter = document.getElementById('companyStatusFilter');
        this.cityFilter = document.getElementById('cityFilter');
        this.itemsInterestedFilter = document.getElementById('itemsInterestedFilter');

        // Partners elements
        this.partnersTab = document.getElementById('partnersTab');
        this.vendorsTab = this.vendorsTab || document.getElementById('vendorsTab');
        this.partnerListSection = document.getElementById('partnerListSection');
        this.partnerDetailsSection = document.getElementById('partnerDetailsSection');
        this.partnerSearchInput = document.getElementById('partnerSearchInput');
        this.partnerClearSearchBtn = document.getElementById('partnerClearSearchBtn');
        this.partnersTableBody = document.getElementById('partnersTableBody');
        this.partnerLoadingMessage = document.getElementById('partnerLoadingMessage');
        this.partnerNoDataMessage = document.getElementById('partnerNoDataMessage');
        this.partnerItemsPerPageSelect = document.getElementById('partnerItemsPerPageSelect');
        this.partnerPrevPageBtn = document.getElementById('partnerPrevPageBtn');
        this.partnerNextPageBtn = document.getElementById('partnerNextPageBtn');
        this.partnerPageNumbers = document.getElementById('partnerPageNumbers');
        this.partnerPaginationInfo = document.getElementById('partnerPaginationInfo');
        this.backToPartnersBtn = document.getElementById('backToPartnersBtn');
        this.partnerDetailsContent = document.getElementById('partnerDetailsContent');
        this.partnerDetailsLoading = document.getElementById('partnerDetailsLoading');

        // Leads elements
        this.leadListSection = document.getElementById('leadListSection');
        this.leadDetailsSection = document.getElementById('leadDetailsSection');
        this.leadSearchInput = document.getElementById('leadSearchInput');
        this.leadClearSearchBtn = document.getElementById('leadClearSearchBtn');
        this.leadsTableBody = document.getElementById('leadsTableBody');
        this.leadLoadingMessage = document.getElementById('leadLoadingMessage');
        this.leadNoDataMessage = document.getElementById('leadNoDataMessage');
        this.leadItemsPerPageSelect = document.getElementById('leadItemsPerPageSelect');
        this.leadPrevPageBtn = document.getElementById('leadPrevPageBtn');
        this.leadNextPageBtn = document.getElementById('leadNextPageBtn');
        this.leadPageNumbers = document.getElementById('leadPageNumbers');
        this.leadPaginationInfo = document.getElementById('leadPaginationInfo');
        this.backToLeadsBtn = document.getElementById('backToLeadsBtn');
        this.leadDetailsContent = document.getElementById('leadDetailsContent');
        this.leadDetailsLoading = document.getElementById('leadDetailsLoading');
        this.leadExportCSVBtn = document.getElementById('leadExportCSVBtn');
    }

    bindEvents() {
        // Navigation events
        if (this.logoutButton) this.logoutButton.addEventListener('click', () => this.handleLogout());

        // Search events
        if (this.searchInput) this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        if (this.clearSearchBtn) this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        if (this.clearFiltersBtn) this.clearFiltersBtn.addEventListener('click', () => this.clearSearch());

        // Table events
        if (this.vendorsTable) this.vendorsTable.addEventListener('click', (e) => this.handleTableClick(e));

        // Pagination events
        if (this.itemsPerPageSelect) this.itemsPerPageSelect.addEventListener('change', (e) => this.handleItemsPerPageChange(e));
        if (this.prevPageBtn) this.prevPageBtn.addEventListener('click', () => this.handlePreviousPage());
        if (this.nextPageBtn) this.nextPageBtn.addEventListener('click', () => this.handleNextPage());

        // Export events
        if (this.exportCSVBtn) this.exportCSVBtn.addEventListener('click', () => this.exportCSV());

        // View toggle events
        if (this.tableViewBtn) this.tableViewBtn.addEventListener('click', () => this.setTableView());
        if (this.cardViewBtn) this.cardViewBtn.addEventListener('click', () => this.setCardView());

        // Vendor details events
        if (this.backToVendorsBtn) this.backToVendorsBtn.addEventListener('click', () => this.showVendorList());

        // Message events
        if (this.closeErrorBtn) this.closeErrorBtn.addEventListener('click', () => this.hideErrorMessage());
        if (this.closeSuccessBtn) this.closeSuccessBtn.addEventListener('click', () => this.hideSuccessMessage());

        // Filter dropdown events
        if (this.companyStatusFilter) this.companyStatusFilter.addEventListener('change', (e) => this.handleFilterChange('companyStatus', e.target.value));
        if (this.cityFilter) this.cityFilter.addEventListener('change', (e) => this.handleFilterChange('city', e.target.value));
        if (this.itemsInterestedFilter) this.itemsInterestedFilter.addEventListener('change', (e) => this.handleFilterChange('itemsInterested', e.target.value));

        if (this.partnersTab) this.partnersTab.addEventListener('click', (e) => { e.preventDefault(); this.showPartnerList(); });
        if (this.vendorsTab) this.vendorsTab.addEventListener('click', (e) => { e.preventDefault(); this.showVendorList(); this.setActiveTab('vendors'); });
        if (this.leadsTab) this.leadsTab.addEventListener('click', (e) => { e.preventDefault(); this.showLeadList(); this.setActiveTab('leads'); });
        if (this.partnerSearchInput) this.partnerSearchInput.addEventListener('input', (e) => this.handlePartnerSearchInput(e));
        if (this.partnerClearSearchBtn) this.partnerClearSearchBtn.addEventListener('click', () => this.clearPartnerSearch());
        if (this.partnerItemsPerPageSelect) this.partnerItemsPerPageSelect.addEventListener('change', (e) => this.handlePartnerItemsPerPageChange(e));
        if (this.partnerPrevPageBtn) this.partnerPrevPageBtn.addEventListener('click', () => this.handlePartnerPreviousPage());
        if (this.partnerNextPageBtn) this.partnerNextPageBtn.addEventListener('click', () => this.handlePartnerNextPage());
        if (this.partnersTableBody) this.partnersTableBody.addEventListener('click', (e) => this.handlePartnersTableClick(e));
        if (this.backToPartnersBtn) this.backToPartnersBtn.addEventListener('click', () => this.showPartnerList());

        // Leads events
        if (this.leadSearchInput) this.leadSearchInput.addEventListener('input', (e) => this.handleLeadSearchInput(e));
        if (this.leadClearSearchBtn) this.leadClearSearchBtn.addEventListener('click', () => this.clearLeadSearch());
        if (this.leadItemsPerPageSelect) this.leadItemsPerPageSelect.addEventListener('change', (e) => this.handleLeadItemsPerPageChange(e));
        if (this.leadPrevPageBtn) this.leadPrevPageBtn.addEventListener('click', () => this.handleLeadPreviousPage());
        if (this.leadNextPageBtn) this.leadNextPageBtn.addEventListener('click', () => this.handleLeadNextPage());
        if (this.backToLeadsBtn) this.backToLeadsBtn.addEventListener('click', () => this.showLeadList());
        if (this.leadsTableBody) this.leadsTableBody.addEventListener('click', (e) => this.handleLeadsTableClick(e));
        if (this.leadExportCSVBtn) this.leadExportCSVBtn.addEventListener('click', () => this.exportLeadsCSV());
    }

    initializeSession() {
        const sessionData = localStorage.getItem('dashboardSession');
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                this.userNameDisplay.textContent = `Welcome back, ${session.username}!`;
                this.startSessionTimer();
            } catch (error) {
                console.error('Session initialization error:', error);
            }
        }
    }

    startSessionTimer() {
        const sessionData = JSON.parse(localStorage.getItem('dashboardSession'));
        
        this.countdownTimer = setInterval(() => {
            const currentTime = Date.now();
            const timeLeft = sessionData.expiryTime - currentTime;
            
            if (timeLeft <= 0) {
                this.handleSessionExpiry();
                return;
            }
            
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            this.sessionTimeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning when 5 minutes remaining
            if (timeLeft <= 5 * 60 * 1000 && timeLeft > 4 * 60 * 1000) {
                this.showErrorMessage('Your session will expire in 5 minutes!');
            }
        }, 1000);
    }

    handleSessionExpiry() {
        clearInterval(this.countdownTimer);
        localStorage.removeItem('dashboardSession');
        window.location.href = 'index.html';
    }

    handleLogout() {
        clearInterval(this.countdownTimer);
        localStorage.removeItem('dashboardSession');
        window.location.href = 'index.html';
    }

    // API Methods
    async makeAPICall(endpoint, options = {}) {
        const sessionData = localStorage.getItem('dashboardSession');
        if (!sessionData) {
            window.location.href = 'index.html';
            return null;
        }

        const session = JSON.parse(sessionData);
        
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token}`,
            },
            ...options
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, defaultOptions);
            
            if (response.status === 401) {
                this.handleSessionExpiry();
                return null;
            }

            return response;
        } catch (error) {
            console.error('API call failed:', error);
            this.showErrorMessage('Connection error. Please check your internet connection.');
            return null;
        }
    }

    async fetchVendors() {
        if (this.loading) return;

        this.setLoading(true);
        
        try {
            // Build query parameters
            const params = new URLSearchParams({
                page: this.currentPage.toString(),
                limit: this.itemsPerPage.toString(),
            });

            if (this.debouncedSearchTerm.trim()) {
                params.append('search', this.debouncedSearchTerm.trim());
            }

            if (this.selectedFilters.companyStatus) {
                params.append('company_status', this.selectedFilters.companyStatus);
            }
            if (this.selectedFilters.city) {
                params.append('city', this.selectedFilters.city);
            }
            if (this.selectedFilters.itemsInterested) {
                params.append('items_interested', this.selectedFilters.itemsInterested);
            }

            const response = await this.makeAPICall(`/api/vendor-list?${params.toString()}`);
            
            if (!response) return;

            if (response.ok) {
                const result = await response.json();
                
                if (result.data) {
                    this.vendors = result.data?.vendors || [];
                    this.totalVendors = result.data?.pagination?.total || this.vendors.length;
                    this.totalPages = result.data?.pagination?.totalPages || Math.ceil(this.vendors.length / this.itemsPerPage);
                    
                    this.renderVendorsTable();
                    this.updatePagination();
                    this.updateLastUpdated();
                } else {
                    this.vendors = [];
                    this.totalVendors = 0;
                    this.totalPages = 0;
                    this.renderVendorsTable();
                }
            } else {
                throw new Error('Failed to fetch vendors');
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            this.showErrorMessage('Failed to load vendors. Please try again.');
            this.vendors = [];
            this.renderVendorsTable();
        } finally {
            this.setLoading(false);
        }
    }

    async fetchVendorDetails(vendorId) {
        this.vendorDetailsLoading.style.display = 'block';
        this.vendorDetailsContent.style.display = 'none';

        try {
            const response = await this.makeAPICall(`/api/vendor-details/${vendorId}`);
            
            if (!response) return;

            if (response.ok) {
                const result = await response.json();
                
                if (result.data) {
                    this.renderVendorDetails(result.data);
                } else {
                    this.showErrorMessage('Failed to load vendor details');
                }
            } else {
                throw new Error('Failed to fetch vendor details');
            }
        } catch (error) {
            console.error('Error fetching vendor details:', error);
            this.showErrorMessage('Failed to load vendor details. Please try again.');
        } finally {
            this.vendorDetailsLoading.style.display = 'none';
            this.vendorDetailsContent.style.display = 'block';
        }
    }

    async fetchAndPopulateFilters() {
        const response = await this.makeAPICall('/api/vendor-filters');
        if (!response || !response.ok) return;
        const result = await response.json();
        const data = result.data || {};
        // Company Status: extract unique company_status from gst_details of all vendors
        let companyStatusSet = new Set();
        if (data.items_interested) this.filterOptions.itemsInterested = data.items_interested;
        if (data.cities) this.filterOptions.city = data.cities;
        if (data.company_status) {
            this.filterOptions.companyStatus = data.company_status;
        } else if (data.gst_details_list) {
            // fallback: extract from gst_details_list if backend provides
            data.gst_details_list.forEach(gst => {
                if (gst && gst.company_status) companyStatusSet.add(gst.company_status);
            });
            this.filterOptions.companyStatus = Array.from(companyStatusSet);
        }
        // fallback: try to extract from vendors if present
        if (!this.filterOptions.companyStatus.length && data.vendors) {
            data.vendors.forEach(vendor => {
                if (vendor.gst_details && vendor.gst_details.company_status) companyStatusSet.add(vendor.gst_details.company_status);
            });
            this.filterOptions.companyStatus = Array.from(companyStatusSet);
        }
        this.populateFilterDropdown(this.companyStatusFilter, this.filterOptions.companyStatus, 'Mode of Work Execution');
        this.populateFilterDropdown(this.cityFilter, this.filterOptions.city, 'All Cities');
        this.populateFilterDropdown(this.itemsInterestedFilter, this.filterOptions.itemsInterested, 'Category of Work');
    }

    populateFilterDropdown(selectElement, options, defaultText) {
        if (!selectElement) return;
        selectElement.innerHTML = `<option value="">${defaultText}</option>`;
        options.forEach(opt => {
            selectElement.innerHTML += `<option value="${opt}">${opt}</option>`;
        });
    }

    handleFilterChange(filterKey, value) {
        this.selectedFilters[filterKey] = value;
        this.currentPage = 1;
        this.fetchVendors();
    }

    // UI Rendering Methods
    renderVendorsTable() {
        const tbody = this.vendorsTableBody;
        tbody.innerHTML = '';

        if (this.vendors.length === 0) {
            this.showNoDataMessage();
            return;
        }

        this.hideNoDataMessage();

        this.vendors.forEach((vendor, index) => {
            const row = document.createElement('tr');
            row.dataset.vendorId = vendor.id;
            
            row.innerHTML = `
                <td data-label="Sr No.">${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>
                <td data-label="Vendor ID" data-priority="low">${vendor.id || '-'}</td>
                <td data-label="Firm Name" data-priority="high">${vendor.gst_details?.firm_name || '-'}</td>
                <td data-label="Contact Person" data-priority="high">${vendor.contact_person_name || '-'}</td>
                <td data-label="Email" data-priority="medium">${vendor.email || '-'}</td>
                <td data-label="Mobile" data-priority="high">${vendor.mobile || vendor.std_code_with_phone || '-'}</td>
                <td data-label="City" data-priority="medium">${vendor.city || '-'}</td>
                <td data-label="Mode of Work Execution" data-priority="low">${vendor.gst_details?.company_status || '-'}</td>
                <td data-label="Action">View Details</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    renderVendorDetails(vendor) {
        if (!vendor) {
            this.vendorDetailsContent.innerHTML = '<p>Vendor details not found</p>';
            return;
        }

        this.vendorDetailsContent.innerHTML = `
            <div class="details-grid">
                <!-- Basic Information -->
                <div class="details-section">
                    <h3>Basic Information</h3>
                    
                    <div class="detail-item">
                        <div class="detail-icon">🏢</div>
                        <div class="detail-content">
                            <label>Firm Name</label>
                            <p>${vendor.gst_details?.firm_name || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">👤</div>
                        <div class="detail-content">
                            <label>Contact Person</label>
                            <p>${vendor.contact_person_name || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">💼</div>
                        <div class="detail-content">
                            <label>Contact Person Designation</label>
                            <p>${vendor.contact_person_designation || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">🏢</div>
                        <div class="detail-content">
                            <label>Mode of Work Execution</label>
                            <p>${vendor.gst_details?.company_status || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">🏭</div>
                        <div class="detail-content">
                            <label>Nature of Company Registration</label>
                            <p>${vendor.gst_details?.firm_type || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">🆔</div>
                        <div class="detail-content">
                            <label>Vendor ID</label>
                            <p>${vendor.id || '-'}</p>
                        </div>
                    </div>
                </div>

                <!-- Contact Information -->
                <div class="details-section">
                    <h3>Contact Information</h3>
                    
                    <div class="detail-item">
                        <div class="detail-icon">📧</div>
                        <div class="detail-content">
                            <label>Email</label>
                            <p>${vendor.email || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">📱</div>
                        <div class="detail-content">
                            <label>Mobile</label>
                            <p>${vendor.mobile || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">☎️</div>
                        <div class="detail-content">
                            <label>Landline</label>
                            <p>${vendor.std_code_with_phone || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">📍</div>
                        <div class="detail-content">
                            <label>Address</label>
                            <p>${vendor.address || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">🏙️</div>
                        <div class="detail-content">
                            <label>City</label>
                            <p>${vendor.city || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">🗺️</div>
                        <div class="detail-content">
                            <label>State</label>
                            <p>${vendor.state || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">📮</div>
                        <div class="detail-content">
                            <label>PIN Code</label>
                            <p>${vendor.pin || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">📠</div>
                        <div class="detail-content">
                            <label>Fax</label>
                            <p>${vendor.fax || '-'}</p>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-icon">📅</div>
                        <div class="detail-content">
                            <label>Joined Date</label>
                            <p>${vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            ${this.renderGSTBusinessDetails(vendor)}
            ${this.renderBankDetails(vendor)}
            ${this.renderAdditionalInfo(vendor)}
            ${this.renderFinancialInfo(vendor)}
            ${this.renderDocuments(vendor)}
            ${this.renderWorkSamples(vendor)}
        `;
    }

    renderGSTBusinessDetails(vendor) {
        if (!vendor.gst_details) return '';

        return `
            <div class="details-section details-section-spacing">
                <h3>GST & Business Details</h3>
                <div class="details-grid details-grid-inner">
                    <div class="detail-item">
                        <div class="detail-icon">📄</div>
                        <div class="detail-content">
                            <label>GST Number</label>
                            <p>${vendor.gst_details.gst_number || '-'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🆔</div>
                        <div class="detail-content">
                            <label>PAN Number</label>
                            <p>${vendor.pan_details?.pan_number || '-'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🌍</div>
                        <div class="detail-content">
                            <label>GST Country</label>
                            <p>${vendor.gst_details.country || '-'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🇮🇳</div>
                        <div class="detail-content">
                            <label>Country</label>
                            <p>${vendor.country || '-'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🏭</div>
                        <div class="detail-content">
                            <label>MSME Status</label>
                            <p>${vendor.is_msme === "yes" ? "Yes" : "No"}</p>
                        </div>
                    </div>
                    ${vendor.gst_details.firm_type_specify ? `
                        <div class="detail-item">
                            <div class="detail-icon">📝</div>
                            <div class="detail-content">
                                <label>Firm Type Details</label>
                                <p>${vendor.gst_details.firm_type_specify}</p>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderBankDetails(vendor) {
        if (!vendor.bank_name && !vendor.account_number) return '';

        return `
            <div class="details-section details-section-spacing">
                <h3>Bank Details</h3>
                <div class="details-grid details-grid-inner">
                    <div class="detail-item">
                        <div class="detail-icon">🏦</div>
                        <div class="detail-content">
                            <label>Bank Name</label>
                            <p>${vendor.bank_name || '-'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">💳</div>
                        <div class="detail-content">
                            <label>Account Number</label>
                            <p>${vendor.account_number || '-'}</p>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-icon">🔢</div>
                        <div class="detail-content">
                            <label>IFSC Code</label>
                            <p>${vendor.ifsc_code || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAdditionalInfo(vendor) {
        if (!vendor.business_description && !vendor.items_interested && !vendor.website) return '';

        return `
            <div class="details-section details-section-spacing">
                <h3>Additional Information</h3>
                
                ${vendor.business_description ? `
                    <div class="detail-item">
                        <div class="detail-icon">📋</div>
                        <div class="detail-content">
                            <label>Business Description</label>
                            <p>${vendor.business_description}</p>
                        </div>
                    </div>
                ` : ''}

                ${vendor.items_interested && Array.isArray(vendor.items_interested) ? `
                    <div class="detail-item">
                        <div class="detail-icon">📦</div>
                        <div class="detail-content">
                            <label>Category of Work</label>
                            <div class="tags-container">
                                ${vendor.items_interested.map(item => `
                                    <span class="tag">${item.replace(/_/g, ' ').toUpperCase()}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                ` : ''}

                ${vendor.website ? `
                    <div class="detail-item">
                        <div class="detail-icon">🌐</div>
                        <div class="detail-content">
                            <label>Website</label>
                            <p><a href="${vendor.website}" target="_blank" rel="noopener noreferrer">${vendor.website}</a></p>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderFinancialInfo(vendor) {
        if (!vendor.company_financial || !Array.isArray(vendor.company_financial) || vendor.company_financial.length === 0) return '';

        return `
            <div class="details-section details-section-spacing">
                <h3>Financial Information</h3>
                <div class="documents-grid">
                    ${vendor.company_financial.map((financial, index) => `
                        <div class="document-card">
                            <h4>Year: ${financial.year}</h4>
                            ${financial.turnover ? `
                                <a href="${financial.turnover}" target="_blank" rel="noopener noreferrer">
                                    View Turnover Document
                                </a>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderDocuments(vendor) {
        const documents = [
            { key: 'company_profile', label: 'Company Profile' },
            { key: 'experience_and_reference', label: 'Experience & Reference' },
            { key: 'cancelled_cheque_copy', label: 'Cancelled Cheque Copy' },
            { key: 'msme_certificate', label: 'MSME Certificate' },
            { key: 'company_certificate', label: 'Company Certificate' }
        ];

        const availableDocuments = documents.filter(doc => vendor[doc.key]);
        
        if (availableDocuments.length === 0) return '';

        return `
            <div class="details-section details-section-spacing">
                <h3>Documents</h3>
                <div class="documents-grid">
                    ${availableDocuments.map(doc => `
                        <div class="document-card">
                            <h4>${doc.label}</h4>
                            <a href="${vendor[doc.key]}" target="_blank" rel="noopener noreferrer">
                                View ${doc.label}
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderWorkSamples(vendor) {
        const hasWorkOrders = vendor.work_order_copies && vendor.work_order_copies.length > 0;
        const hasProjectImages = vendor.project_images && vendor.project_images.length > 0;
        
        if (!hasWorkOrders && !hasProjectImages) return '';

        return `
            <div class="details-section details-section-spacing">
                <h3>Work Samples</h3>
                
                ${hasWorkOrders ? `
                    <div style="margin-bottom: 30px;">
                        <h4 style="margin-bottom: 15px; color: #333;">Work Order Copies</h4>
                        <div class="documents-grid">
                            ${vendor.work_order_copies.map((workOrder, index) => `
                                <div class="document-card">
                                    <h4>Work Order #${index + 1}</h4>
                                    <a href="${workOrder}" target="_blank" rel="noopener noreferrer">
                                        View Work Order
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${hasProjectImages ? `
                    <div>
                        <h4 style="margin-bottom: 15px; color: #333;">Project Images</h4>
                        <div class="images-grid">
                            ${vendor.project_images.map((image, index) => `
                                <div class="image-card">
                                    <h4>Project Image #${index + 1}</h4>
                                    <img src="${image}" alt="Project ${index + 1}" onclick="window.open('${image}', '_blank')">
                                    <a href="${image}" target="_blank" rel="noopener noreferrer" style="display: block; margin-top: 10px; font-size: 14px;">
                                        View Full Image
                                    </a>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Event Handlers
    handleSearchInput(e) {
        this.searchTerm = e.target.value;
        
        // Show/hide clear button
        this.clearSearchBtn.style.display = this.searchTerm ? 'block' : 'none';
        
        // Debounce search
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.debouncedSearchTerm = this.searchTerm;
            this.currentPage = 1;
            this.fetchVendors();
        }, 500);
    }

    clearSearch() {
        this.searchTerm = '';
        this.debouncedSearchTerm = '';
        this.searchInput.value = '';
        this.clearSearchBtn.style.display = 'none';
        this.currentPage = 1;
        this.fetchVendors();
    }

    handleTableClick(e) {
        const row = e.target.closest('tr[data-vendor-id]');
        if (row) {
            const vendorId = row.dataset.vendorId;
            this.showVendorDetails(vendorId);
        }

        // Handle sorting
        const sortable = e.target.closest('.sortable');
        if (sortable) {
            const column = sortable.dataset.column;
            this.handleSort(column);
        }
    }

    handleSort(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update UI
        document.querySelectorAll('.sortable').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        const currentHeader = document.querySelector(`[data-column="${column}"]`);
        currentHeader.classList.add(`sort-${this.sortDirection}`);

        // Sort vendors array
        this.vendors.sort((a, b) => {
            let valueA, valueB;
            
            switch(column) {
                case "firm_name":
                    valueA = a.gst_details?.firm_name?.toString().toLowerCase() || '';
                    valueB = b.gst_details?.firm_name?.toString().toLowerCase() || '';
                    break;
                case "contact_person_name":
                    valueA = a.contact_person_name?.toString().toLowerCase() || '';
                    valueB = b.contact_person_name?.toString().toLowerCase() || '';
                    break;
                case "company_status":
                    valueA = a.gst_details?.company_status?.toString().toLowerCase() || '';
                    valueB = b.gst_details?.company_status?.toString().toLowerCase() || '';
                    break;
                default:
                    valueA = a[column]?.toString().toLowerCase() || '';
                    valueB = b[column]?.toString().toLowerCase() || '';
            }
            
            if (valueA < valueB) return this.sortDirection === "asc" ? -1 : 1;
            if (valueA > valueB) return this.sortDirection === "asc" ? 1 : -1;
            return 0;
        });

        this.renderVendorsTable();
    }

    handleItemsPerPageChange(e) {
        this.itemsPerPage = parseInt(e.target.value);
        this.currentPage = 1;
        this.fetchVendors();
    }

    handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchVendors();
        }
    }

    handleNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.fetchVendors();
        }
    }

    handlePageClick(pageNumber) {
        this.currentPage = pageNumber;
        this.fetchVendors();
    }

    // View Management
    showVendorList() {
        this.currentView = 'list';
        this.hidePartnerList();
        this.hideLeadList();
        this.vendorListSection.style.display = 'block';
        this.vendorDetailsSection.style.display = 'none';
        this.pageTitle.textContent = 'Vendor Management';
    }

    hideVendorList() {
        if (this.vendorListSection) this.vendorListSection.style.display = 'none';
        if (this.vendorDetailsSection) this.vendorDetailsSection.style.display = 'none';
    }

    showVendorDetails(vendorId) {
        this.currentView = 'details';
        this.selectedVendorId = vendorId;
        this.vendorListSection.style.display = 'none';
        this.vendorDetailsSection.style.display = 'block';
        this.pageTitle.textContent = 'Vendor Details';
        this.fetchVendorDetails(vendorId);
    }

    // Partners API
    async fetchPartners() {
        if (this.partnerLoading) return;
        this.partnerLoading = true;
        if (this.partnerLoadingMessage) this.partnerLoadingMessage.style.display = 'block';
        try {
            const params = new URLSearchParams({
                page: this.partnerCurrentPage.toString(),
                limit: this.partnerItemsPerPage.toString(),
            });
            if (this.partnerDebouncedSearchTerm && this.partnerDebouncedSearchTerm.trim()) {
                params.append('search', this.partnerDebouncedSearchTerm.trim());
            }
            const response = await this.makeAPICall(`/api/partners?${params.toString()}`);
            if (!response) return;
            if (response.ok) {
                const result = await response.json();
                const data = result.data || {};
                this.partners = data.partners || data.rows || [];
                this.partnerTotal = (data.pagination && data.pagination.total) || data.total || this.partners.length;
                this.partnerTotalPages = (data.pagination && data.pagination.totalPages) || Math.ceil(this.partnerTotal / this.partnerItemsPerPage) || 1;
                this.renderPartnersTable();
                this.updatePartnerPagination();
            } else {
                throw new Error('Failed to fetch partners');
            }
        } catch (err) {
            console.error('Error fetching partners:', err);
            this.partners = [];
            this.renderPartnersTable();
        } finally {
            this.partnerLoading = false;
            if (this.partnerLoadingMessage) this.partnerLoadingMessage.style.display = 'none';
        }
    }

    async fetchPartnerDetails(partnerId) {
        if (!partnerId) return;
        this.partnerDetailsLoading.style.display = 'block';
        this.partnerDetailsContent.style.display = 'none';
        try {
            const response = await this.makeAPICall(`/api/partners/${partnerId}`);
            if (!response) return;
            if (response.ok) {
                const result = await response.json();
                const data = result.data || result;
                this.renderPartnerDetails(data);
            } else {
                throw new Error('Failed to fetch partner details');
            }
        } catch (e) {
            console.error('Error fetching partner details:', e);
            this.showErrorMessage('Failed to load partner details.');
        } finally {
            this.partnerDetailsLoading.style.display = 'none';
            this.partnerDetailsContent.style.display = 'block';
        }
    }

    // Partners UI
    renderPartnersTable() {
        const tbody = this.partnersTableBody;
        if (!tbody) return;
        tbody.innerHTML = '';
        if (this.partners.length === 0) {
            this.partnerNoDataMessage.style.display = 'block';
            return;
        }
        this.partnerNoDataMessage.style.display = 'none';
        this.partners.forEach((partner, index) => {
            const row = document.createElement('tr');
            row.dataset.partnerId = partner.id;
            const catsArray = this.normalizePartnerCategories(partner.category_of_work);
            const cats = catsArray.length ? catsArray.join(', ') : '-';
            row.innerHTML = `
                <td data-label="Sr No.">${(this.partnerCurrentPage - 1) * this.partnerItemsPerPage + index + 1}</td>
                <td data-label="Partner ID" data-priority="low">${partner.id || '-'}</td>
                <td data-label="Name" data-priority="high">${partner.name || '-'}</td>
                <td data-label="Mobile" data-priority="high">${partner.mobile || '-'}</td>
                <td data-label="City" data-priority="medium">${partner.city || '-'}</td>
                <td data-label="Categories" data-priority="low">${cats}</td>
                <td data-label="Action">View Details</td>
            `;
            tbody.appendChild(row);
        });
    }

    renderPartnerDetails(partner) {
        if (!partner) {
            this.partnerDetailsContent.innerHTML = '<p>Partner details not found</p>';
            return;
        }
        const cats = this.normalizePartnerCategories(partner.category_of_work);
        this.partnerDetailsContent.innerHTML = `
            <div class="details-grid">
                <div class="details-section">
                    <h3>Basic Information</h3>
                    <div class="detail-item"><div class="detail-icon">🆔</div><div class="detail-content"><label>Partner ID</label><p>${partner.id || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">👤</div><div class="detail-content"><label>Name</label><p>${partner.name || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">📱</div><div class="detail-content"><label>Mobile</label><p>${partner.mobile || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">🏙️</div><div class="detail-content"><label>City</label><p>${partner.city || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">📍</div><div class="detail-content"><label>Address</label><p>${partner.address || '-'}</p></div></div>
                </div>
                <div class="details-section">
                    <h3>Bank Details</h3>
                    <div class="detail-item"><div class="detail-icon">🏦</div><div class="detail-content"><label>Bank Name</label><p>${partner.bank_name || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">💳</div><div class="detail-content"><label>Account Number</label><p>${partner.account_number || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">🔢</div><div class="detail-content"><label>IFSC Code</label><p>${partner.ifsc_code || '-'}</p></div></div>
                </div>
                <div class="details-section">
                    <h3>Categories</h3>
                    <div class="detail-item"><div class="detail-icon">🧰</div><div class="detail-content"><label>Category of Work</label><p>${cats.length ? cats.join(', ') : '-'}</p></div></div>
                </div>
                <div class="details-section">
                    <h3>Timestamps</h3>
                    <div class="detail-item"><div class="detail-icon">📅</div><div class="detail-content"><label>Created</label><p>${partner.created_at ? new Date(partner.created_at).toLocaleString() : '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">🕒</div><div class="detail-content"><label>Updated</label><p>${partner.updated_at ? new Date(partner.updated_at).toLocaleString() : '-'}</p></div></div>
                </div>
            </div>
        `;
    }

    normalizePartnerCategories(value) {
        try {
            const parsed = typeof value === 'string' ? JSON.parse(value) : value;
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
            if (typeof parsed === 'string' && parsed) return [parsed];
        } catch (_) {
            // If not JSON, try comma-separated fallback
            if (typeof value === 'string' && value.includes(',')) {
                return value.split(',').map(s => s.trim()).filter(Boolean);
            }
            if (typeof value === 'string' && value.trim()) return [value.trim()];
        }
        return [];
    }

    // Partner handlers
    handlePartnerSearchInput(e) {
        const value = e.target.value;
        this.partnerSearchTerm = value;
        if (this.partnerSearchTimeout) clearTimeout(this.partnerSearchTimeout);
        this.partnerSearchTimeout = setTimeout(() => {
            this.partnerDebouncedSearchTerm = this.partnerSearchTerm;
            this.partnerCurrentPage = 1;
            this.fetchPartners();
        }, 300);
        this.partnerClearSearchBtn.style.display = value ? 'inline-flex' : 'none';
    }

    clearPartnerSearch() {
        this.partnerSearchTerm = '';
        this.partnerDebouncedSearchTerm = '';
        if (this.partnerSearchInput) this.partnerSearchInput.value = '';
        this.partnerCurrentPage = 1;
        this.partnerClearSearchBtn.style.display = 'none';
        this.fetchPartners();
    }

    handlePartnerItemsPerPageChange(e) {
        this.partnerItemsPerPage = parseInt(e.target.value, 10) || 10;
        this.partnerCurrentPage = 1;
        this.fetchPartners();
    }

    handlePartnerPreviousPage() {
        if (this.partnerCurrentPage > 1) {
            this.partnerCurrentPage--;
            this.fetchPartners();
        }
    }

    handlePartnerNextPage() {
        if (this.partnerCurrentPage < this.partnerTotalPages) {
            this.partnerCurrentPage++;
            this.fetchPartners();
        }
    }

    updatePartnerPagination() {
        if (!this.partnerPaginationInfo || !this.partnerPageNumbers) return;
        const start = (this.partnerCurrentPage - 1) * this.partnerItemsPerPage + 1;
        const end = Math.min(this.partnerCurrentPage * this.partnerItemsPerPage, this.partnerTotal);
        this.partnerPaginationInfo.textContent = `Showing ${start} to ${end} of ${this.partnerTotal} results`;
        this.partnerPageNumbers.innerHTML = '';
        for (let i = 1; i <= this.partnerTotalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `page-number ${i === this.partnerCurrentPage ? 'active' : ''}`;
            btn.addEventListener('click', () => {
                this.partnerCurrentPage = i;
                this.fetchPartners();
            });
            this.partnerPageNumbers.appendChild(btn);
        }
    }

    handlePartnersTableClick(e) {
        const row = e.target.closest('tr');
        if (!row) return;
        const partnerId = row.dataset.partnerId;
        if (partnerId) {
            if (this.partnerListSection) this.partnerListSection.style.display = 'none';
            if (this.partnerDetailsSection) this.partnerDetailsSection.style.display = 'block';
            this.fetchPartnerDetails(partnerId);
        }
    }

    // Leads API
    async fetchLeads() {
        if (this.leadLoading) return;
        this.leadLoading = true;
        if (this.leadLoadingMessage) this.leadLoadingMessage.style.display = 'block';
        try {
            const params = new URLSearchParams({
                page: this.leadCurrentPage.toString(),
                limit: this.leadItemsPerPage.toString(),
            });
            if (this.leadDebouncedSearchTerm && this.leadDebouncedSearchTerm.trim()) {
                params.append('search', this.leadDebouncedSearchTerm.trim());
            }
            const response = await this.makeAPICall(`/api/leads/list?${params.toString()}`);
            if (!response) return;
            if (response.ok) {
                const result = await response.json();
                const data = result.data || {};
                this.leads = data.leads || data.rows || [];
                this.leadTotal = (data.pagination && data.pagination.total) || data.total || this.leads.length;
                this.leadTotalPages = (data.pagination && data.pagination.totalPages) || Math.ceil(this.leadTotal / this.leadItemsPerPage) || 1;
                this.renderLeadsTable();
                this.updateLeadPagination();
            } else {
                throw new Error('Failed to fetch leads');
            }
        } catch (err) {
            console.error('Error fetching leads:', err);
            this.leads = [];
            this.renderLeadsTable();
        } finally {
            this.leadLoading = false;
            if (this.leadLoadingMessage) this.leadLoadingMessage.style.display = 'none';
        }
    }

    async fetchLeadDetails(leadId) {
        if (!leadId) return;
        this.leadDetailsLoading.style.display = 'block';
        this.leadDetailsContent.style.display = 'none';
        try {
            const response = await this.makeAPICall(`/api/leads/${leadId}`);
            if (!response) return;
            if (response.ok) {
                const result = await response.json();
                const data = result.data || result;
                this.renderLeadDetails(data);
            } else {
                throw new Error('Failed to fetch lead details');
            }
        } catch (e) {
            console.error('Error fetching lead details:', e);
            this.showErrorMessage('Failed to load lead details.');
        } finally {
            this.leadDetailsLoading.style.display = 'none';
            this.leadDetailsContent.style.display = 'block';
        }
    }

    // Leads UI
    renderLeadsTable() {
        const tbody = this.leadsTableBody;
        if (!tbody) return;
        tbody.innerHTML = '';
        if (this.leads.length === 0) {
            this.leadNoDataMessage.style.display = 'block';
            return;
        }
        this.leadNoDataMessage.style.display = 'none';
        this.leads.forEach((lead, index) => {
            const row = document.createElement('tr');
            row.dataset.leadId = lead.id;
            row.innerHTML = `
                <td data-label="Sr No.">${(this.leadCurrentPage - 1) * this.leadItemsPerPage + index + 1}</td>
                <td data-label="Lead ID" data-priority="low">${lead.id || '-'}</td>
                <td data-label="Name" data-priority="high">${lead.name || '-'}</td>
                <td data-label="Email" data-priority="high">${lead.email || '-'}</td>
                <td data-label="Mobile" data-priority="high">${lead.mobile || '-'}</td>
                <td data-label="City" data-priority="medium">${lead.city || '-'}</td>
                <td data-label="Service Type" data-priority="medium">${lead.interior_service || '-'}</td>
                <td data-label="Project Type" data-priority="medium">${lead.type_of_project || '-'}</td>
                <td data-label="Created Date" data-priority="low">${lead.created_at ? new Date(lead.created_at).toLocaleDateString() : '-'}</td>
                <td data-label="Action">
                    <button class="btn btn-secondary btn-sm" onclick="dashboard.showLeadDetails(${lead.id})">
                       <span>View</span>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    renderLeadDetails(lead) {
        if (!lead) {
            this.leadDetailsContent.innerHTML = '<p>Lead details not found</p>';
            return;
        }
        this.leadDetailsContent.innerHTML = `
            <div class="details-grid">
                <div class="details-section">
                    <h3>Basic Information</h3>
                    <div class="detail-item"><div class="detail-icon">🆔</div><div class="detail-content"><label>Lead ID</label><p>${lead.id || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">👤</div><div class="detail-content"><label>Name</label><p>${lead.name || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">📧</div><div class="detail-content"><label>Email</label><p>${lead.email || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">📱</div><div class="detail-content"><label>Mobile</label><p>${lead.mobile || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">🏙️</div><div class="detail-content"><label>City</label><p>${lead.city || '-'}</p></div></div>
                </div>
                <div class="details-section">
                    <h3>Project Details</h3>
                    <div class="detail-item"><div class="detail-icon">🏗️</div><div class="detail-content"><label>Interior Service</label><p>${lead.interior_service || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">📋</div><div class="detail-content"><label>Project Type</label><p>${lead.type_of_project || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">📏</div><div class="detail-content"><label>Property Size</label><p>${lead.property_size || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">💰</div><div class="detail-content"><label>Budget</label><p>${lead.budget || '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">🤝</div><div class="detail-content"><label>Hiring Decision</label><p>${lead.hiring_decision || '-'}</p></div></div>
                </div>
                <div class="details-section">
                    <h3>Marketing</h3>
                    <div class="detail-item"><div class="detail-icon">📢</div><div class="detail-content"><label>Marketing Opt-in</label><p>${lead.marketing_optin ? 'Yes' : 'No'}</p></div></div>
                </div>
                <div class="details-section">
                    <h3>Timestamps</h3>
                    <div class="detail-item"><div class="detail-icon">📅</div><div class="detail-content"><label>Created</label><p>${lead.created_at ? new Date(lead.created_at).toLocaleString() : '-'}</p></div></div>
                    <div class="detail-item"><div class="detail-icon">🕒</div><div class="detail-content"><label>Updated</label><p>${lead.updated_at ? new Date(lead.updated_at).toLocaleString() : '-'}</p></div></div>
                </div>
            </div>
        `;
    }

    // Leads handlers
    handleLeadSearchInput(e) {
        const value = e.target.value;
        this.leadSearchTerm = value;
        if (this.leadSearchTimeout) clearTimeout(this.leadSearchTimeout);
        this.leadSearchTimeout = setTimeout(() => {
            this.leadDebouncedSearchTerm = this.leadSearchTerm;
            this.leadCurrentPage = 1;
            this.fetchLeads();
        }, 300);
        this.leadClearSearchBtn.style.display = value ? 'inline-flex' : 'none';
    }

    clearLeadSearch() {
        this.leadSearchTerm = '';
        this.leadDebouncedSearchTerm = '';
        if (this.leadSearchInput) this.leadSearchInput.value = '';
        this.leadCurrentPage = 1;
        this.leadClearSearchBtn.style.display = 'none';
        this.fetchLeads();
    }

    handleLeadItemsPerPageChange(e) {
        this.leadItemsPerPage = parseInt(e.target.value, 10) || 10;
        this.leadCurrentPage = 1;
        this.fetchLeads();
    }

    handleLeadPreviousPage() {
        if (this.leadCurrentPage > 1) {
            this.leadCurrentPage--;
            this.fetchLeads();
        }
    }

    handleLeadNextPage() {
        if (this.leadCurrentPage < this.leadTotalPages) {
            this.leadCurrentPage++;
            this.fetchLeads();
        }
    }

    updateLeadPagination() {
        if (!this.leadPaginationInfo || !this.leadPageNumbers) return;
        const start = (this.leadCurrentPage - 1) * this.leadItemsPerPage + 1;
        const end = Math.min(this.leadCurrentPage * this.leadItemsPerPage, this.leadTotal);
        this.leadPaginationInfo.textContent = `Showing ${start} to ${end} of ${this.leadTotal} results`;
        this.leadPageNumbers.innerHTML = '';
        for (let i = 1; i <= this.leadTotalPages; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.className = `page-number ${i === this.leadCurrentPage ? 'active' : ''}`;
            btn.addEventListener('click', () => {
                this.leadCurrentPage = i;
                this.fetchLeads();
            });
            this.leadPageNumbers.appendChild(btn);
        }
    }

    handleLeadsTableClick(e) {
        const row = e.target.closest('tr');
        if (!row) return;
        const leadId = row.dataset.leadId;
        if (leadId) {
            if (this.leadListSection) this.leadListSection.style.display = 'none';
            if (this.leadDetailsSection) this.leadDetailsSection.style.display = 'block';
            this.fetchLeadDetails(leadId);
        }
    }

    showLeadDetails(leadId) {
        if (this.leadListSection) this.leadListSection.style.display = 'none';
        if (this.leadDetailsSection) this.leadDetailsSection.style.display = 'block';
        this.fetchLeadDetails(leadId);
    }

    exportLeadsCSV() {
        if (this.leads.length === 0) {
            this.showErrorMessage('No leads to export');
            return;
        }

        const headers = [
            'Lead ID', 'Name', 'Email', 'Mobile', 'City', 'Interior Service', 
            'Project Type', 'Property Size', 'Budget', 'Hiring Decision', 
            'Marketing Opt-in', 'Created Date'
        ];

        const rows = this.leads.map(lead => [
            lead.id || '',
            lead.name || '',
            lead.email || '',
            lead.mobile || '',
            lead.city || '',
            lead.interior_service || '',
            lead.type_of_project || '',
            lead.property_size || '',
            lead.budget || '',
            lead.hiring_decision || '',
            lead.marketing_optin ? 'Yes' : 'No',
            lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''
        ]);

        const csvContent = [
            headers.map(header => `"${header}"`).join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Utility Methods
    setLoading(isLoading, isPartner = false) {
        this.loading = isLoading;
        if (isPartner) {
            if (this.partnerLoadingMessage) this.partnerLoadingMessage.style.display = isLoading ? 'block' : 'none';
        } else {
            if (this.loadingMessage) this.loadingMessage.style.display = isLoading ? 'block' : 'none';
        }
        
        if (isLoading) {
            this.hideNoDataMessage();
        }
    }

    showNoDataMessage() {
        this.noDataMessage.style.display = 'block';
        this.clearFiltersBtn.style.display = this.searchTerm ? 'block' : 'none';
        this.paginationContainer.style.display = 'none';
    }

    hideNoDataMessage() {
        this.noDataMessage.style.display = 'none';
        this.paginationContainer.style.display = this.vendors.length > 0 ? 'flex' : 'none';
    }

    updatePagination() {
        // Update pagination info
        const start = (this.currentPage - 1) * this.itemsPerPage + 1;
        const end = Math.min(this.currentPage * this.itemsPerPage, this.totalVendors);
        this.paginationInfo.textContent = `Showing ${start} to ${end} of ${this.totalVendors} results`;

        // Update pagination buttons
        this.prevPageBtn.disabled = this.currentPage <= 1;
        this.nextPageBtn.disabled = this.currentPage >= this.totalPages;

        // Update page numbers
        this.updatePageNumbers();
    }

    updatePageNumbers() {
        this.pageNumbers.innerHTML = '';
        
        const maxVisible = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.handlePageClick(i));
            this.pageNumbers.appendChild(pageBtn);
        }
    }

    updateLastUpdated() {
        this.lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }

    showErrorMessage(message) {
        this.errorText.textContent = message;
        this.errorMessage.style.display = 'flex';
        setTimeout(() => this.hideErrorMessage(), 5000);
    }

    hideErrorMessage() {
        this.errorMessage.style.display = 'none';
    }

    showSuccessMessage(message) {
        this.successText.textContent = message;
        this.successMessage.style.display = 'flex';
        setTimeout(() => this.hideSuccessMessage(), 5000);
    }

    hideSuccessMessage() {
        this.successMessage.style.display = 'none';
    }

    // Export functionality
    async exportCSV() {
        try {
            // Get all vendors for export (without pagination)
            const params = new URLSearchParams({
                page: '1',
                limit: '1000', // Get a large number to export all
            });

            if (this.searchTerm.trim()) {
                params.append('search', this.searchTerm.trim());
            }

            const response = await this.makeAPICall(`/api/vendor-list?${params.toString()}`);
            
            if (!response || !response.ok) {
                throw new Error('Export failed');
            }

            const result = await response.json();
            const vendors = result.data?.vendors || [];

            // Generate CSV content
            const csvContent = this.generateCSV(vendors);
            
            // Create and download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const filename = `vendors_export_${new Date().toISOString().split('T')[0]}.csv`;
            
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);

            this.showSuccessMessage('CSV exported successfully!');
        } catch (error) {
            console.error('Export error:', error);
            this.showErrorMessage('Failed to export CSV. Please try again.');
        }
    }

    generateCSV(vendors) {
        // CSV headers
        const headers = [
            'ID',
            'Firm Name',
            'Contact Person',
            'Email',
            'Mobile',
            'City',
            'State',
            'Country',
            'GST Number',
            'PAN Number',
            'Company Status',
            'MSME Status',
            'Created Date'
        ];

        // Convert vendors to CSV rows
        const rows = vendors.map(vendor => {
            const gstDetails = vendor.gst_details ? 
                (typeof vendor.gst_details === 'string' ? JSON.parse(vendor.gst_details) : vendor.gst_details) : {};
            const panDetails = vendor.pan_details ? 
                (typeof vendor.pan_details === 'string' ? JSON.parse(vendor.pan_details) : vendor.pan_details) : {};
            
            return [
                vendor.id || '',
                gstDetails.firm_name || '',
                vendor.contact_person_name || '',
                vendor.email || '',
                vendor.mobile || '',
                vendor.city || '',
                vendor.state || '',
                vendor.country || '',
                gstDetails.gst_number || '',
                panDetails.pan_number || '',
                gstDetails.company_status || '',
                vendor.is_msme === 'yes' ? 'Yes' : 'No',
                vendor.created_at ? new Date(vendor.created_at).toLocaleDateString() : ''
            ].map(field => `"${String(field).replace(/"/g, '""')}"`); // Escape quotes and wrap in quotes
        });

        // Combine headers and rows
        return [
            headers.map(header => `"${header}"`).join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
    }

    // View Toggle Methods
    setTableView() {
        if (this.tableViewBtn && this.cardViewBtn) {
            this.tableViewBtn.classList.add('active');
            this.cardViewBtn.classList.remove('active');
        }
        
        if (this.vendorsTable) {
            this.vendorsTable.classList.remove('card-view');
            this.vendorsTable.classList.add('table-view');
        }
        
        // Store preference
        localStorage.setItem('dashboardTableView', 'table');
    }

    setCardView() {
        if (this.tableViewBtn && this.cardViewBtn) {
            this.cardViewBtn.classList.add('active');
            this.tableViewBtn.classList.remove('active');
        }
        
        if (this.vendorsTable) {
            this.vendorsTable.classList.add('card-view');
            this.vendorsTable.classList.remove('table-view');
        }
        
        // Store preference
        localStorage.setItem('dashboardTableView', 'card');
    }

    initializeTableView() {
        // Always use table view on mobile as requested
        const savedView = localStorage.getItem('dashboardTableView');
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Force table view on mobile
            this.setTableView();
        } else if (savedView === 'card') {
            this.setCardView();
        } else {
            this.setTableView();
        }
    }

    setActiveTab(tab) {
        if (!this.vendorsTab || !this.partnersTab || !this.leadsTab) return;
        
        // Remove active class from all tabs
        this.vendorsTab.classList.remove('active');
        this.partnersTab.classList.remove('active');
        this.leadsTab.classList.remove('active');
        
        // Add active class to selected tab
        if (tab === 'partners') {
            this.partnersTab.classList.add('active');
        } else if (tab === 'leads') {
            this.leadsTab.classList.add('active');
        } else {
            this.vendorsTab.classList.add('active');
        }
    }

    // Navigation
    showPartnerList() {
        this.setActiveTab('partners');
        this.hideVendorList();
        this.hideLeadList();
        if (this.partnerDetailsSection) this.partnerDetailsSection.style.display = 'none';
        if (this.partnerListSection) this.partnerListSection.style.display = 'block';
        if (this.pageTitle) this.pageTitle.textContent = 'Partners Management';
        this.fetchPartners();
    }

    hidePartnerList() {
        if (this.partnerListSection) this.partnerListSection.style.display = 'none';
        if (this.partnerDetailsSection) this.partnerDetailsSection.style.display = 'none';
    }

    showLeadList() {
        this.setActiveTab('leads');
        this.hideVendorList();
        this.hidePartnerList();
        if (this.leadDetailsSection) this.leadDetailsSection.style.display = 'none';
        if (this.leadListSection) this.leadListSection.style.display = 'block';
        if (this.pageTitle) this.pageTitle.textContent = 'Leads Management';
        this.fetchLeads();
    }

    hideLeadList() {
        if (this.leadListSection) this.leadListSection.style.display = 'none';
        if (this.leadDetailsSection) this.leadDetailsSection.style.display = 'none';
    }

    // Handle responsive view changes
    handleResize() {
        const isMobile = window.innerWidth <= 768;
        
        if (this.viewToggle) {
            // Hide view toggle on mobile since we only want table view
            this.viewToggle.style.display = isMobile ? 'none' : 'flex';
        }
        
        // Force table view on mobile
        if (isMobile) {
            this.setTableView();
        }
    }

    // Initialize view state
    initializeViewState() {
        // Show vendor list by default, hide partner and lead sections
        if (this.vendorListSection) this.vendorListSection.style.display = 'block';
        if (this.vendorDetailsSection) this.vendorDetailsSection.style.display = 'none';
        if (this.partnerListSection) this.partnerListSection.style.display = 'none';
        if (this.partnerDetailsSection) this.partnerDetailsSection.style.display = 'none';
        if (this.leadListSection) this.leadListSection.style.display = 'none';
        if (this.leadDetailsSection) this.leadDetailsSection.style.display = 'none';
        
        // Set active tab to vendors
        this.setActiveTab('vendors');
    }
} 