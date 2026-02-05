/**
 * Login System with Session Management
 * 
 * Configuration Options:
 * - baseURL: Your backend API base URL (default: 'http://localhost:3000')
 * - sessionDuration: Session timeout in milliseconds (default: 30 minutes)
 * 
 * API Requirements:
 * - POST {baseURL}/api/login endpoint
 * - Expected request: {"email": "...", "password": "..."}
 * - Expected response: {"token": "..."}
 * 
 * Examples:
 * - new LoginSystem() // Uses defaults
 * - new LoginSystem({baseURL: 'https://api.example.com'})
 * - new LoginSystem({baseURL: 'http://localhost:8080'})
 */
class LoginSystem {
    constructor(config = {}) {
        // Configuration - You can pass these when creating the LoginSystem
        this.baseURL = config.baseURL || 'https://api-urban.zuhouz.com'; // Your backend base URL
        this.sessionDuration = config.sessionDuration || 30 * 60 * 1000; // 30 minutes in milliseconds
        this.sessionTimer = null;
        this.countdownTimer = null;
        this.initializeElements();
        this.bindEvents();
        this.checkSession();
    }

    // Method to update base URL after initialization
    setBaseURL(url) {
        this.baseURL = url.replace(/\/$/, ''); // Remove trailing slash if present
        console.log(`Base URL updated to: ${this.baseURL}`);
    }

    // Method to test API connectivity
    async testConnection() {
        try {
            console.log(`Testing connection to: ${this.baseURL}/login`);
            const response = await fetch(`${this.baseURL}/api/login`, {
                method: 'OPTIONS'
            });
            console.log(`Connection test result: ${response.status}`);
            return response.ok;
        } catch (error) {
            console.error('Connection test failed:', error);
            this.showAlert(`Cannot connect to server: ${this.baseURL}. Please check your backend URL.`);
            return false;
        }
    }

    initializeElements() {
        this.loginSection = document.getElementById('loginSection');
        this.dashboardSection = document.getElementById('dashboardSection');
        this.loginForm = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('loginBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.alertBox = document.getElementById('alertBox');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.timeRemaining = document.getElementById('timeRemaining');
    }

    bindEvents() {
        this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.emailInput.addEventListener('input', () => this.clearFieldError('emailGroup'));
        this.passwordInput.addEventListener('input', () => this.clearFieldError('passwordGroup'));
    }

    validateForm() {
        let isValid = true;
        
        // Validate email
        if (!this.emailInput.value.trim()) {
            this.showFieldError('emailGroup', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(this.emailInput.value.trim())) {
            this.showFieldError('emailGroup', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate password
        if (!this.passwordInput.value.trim()) {
            this.showFieldError('passwordGroup', 'Password is required');
            isValid = false;
        } else if (this.passwordInput.value.length < 6) {
            this.showFieldError('passwordGroup', 'Password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(groupId, message) {
        const group = document.getElementById(groupId);
        group.classList.add('error');
        const errorMessage = group.querySelector('.error-message');
        errorMessage.textContent = message;
    }

    clearFieldError(groupId) {
        const group = document.getElementById(groupId);
        group.classList.remove('error');
    }

    showAlert(message, type = 'error') {
        this.alertBox.textContent = message;
        this.alertBox.className = `alert ${type}`;
        this.alertBox.style.display = 'block';
        
        setTimeout(() => {
            this.alertBox.style.display = 'none';
        }, 5000);
    }

    async handleLogin(e) {
        e.preventDefault();
        
        // Clear previous errors
        this.clearFieldError('emailGroup');
        this.clearFieldError('passwordGroup');
        this.alertBox.style.display = 'none';

        if (!this.validateForm()) {
            return;
        }

        this.loginBtn.disabled = true;
        this.loginBtn.textContent = 'Signing In...';
        this.loginSection.classList.add('loading');

        try {
            const loginData = {
                email: this.emailInput.value.trim(),
                password: this.passwordInput.value
            };

            const response = await fetch(`${this.baseURL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (response.ok && result.token) {
                // Store session data with token
                const sessionData = {
                    token: result.token,
                    email: loginData.email,
                    username: loginData.email.split('@')[0], // Use email prefix as username
                    loginTime: Date.now(),
                    expiryTime: Date.now() + this.sessionDuration
                };
                
                localStorage.setItem('dashboardSession', JSON.stringify(sessionData));
                this.showAlert('Login successful! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                this.showAlert(result.message || 'Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Connection error. Please check your internet connection and try again.');
        } finally {
            this.loginBtn.disabled = false;
            this.loginBtn.textContent = 'Sign In';
            this.loginSection.classList.remove('loading');
        }
    }

    checkSession() {
        const sessionData = localStorage.getItem('dashboardSession');
        
        if (sessionData) {
            try {
                const session = JSON.parse(sessionData);
                const currentTime = Date.now();
                
                                        if (currentTime < session.expiryTime) {
                            // Session is still valid - redirect to dashboard
                            window.location.href = 'dashboard.html';
                            return;
                        } else {
                    // Session expired
                    localStorage.removeItem('dashboardSession');
                    this.showAlert('Your session has expired. Please login again.');
                }
            } catch (error) {
                console.error('Session check error:', error);
                localStorage.removeItem('dashboardSession');
            }
        }
        
        this.showLogin();
    }

    showDashboard(username) {
        this.loginSection.classList.add('hidden');
        this.dashboardSection.classList.remove('hidden');
        this.welcomeMessage.textContent = `Welcome back, ${username}!`;
        
        this.startSessionTimer();
        this.updateActivityLog(`User ${username} logged in successfully`);
    }

    showLogin() {
        this.dashboardSection.classList.add('hidden');
        this.loginSection.classList.remove('hidden');
        this.clearForm();
        this.stopSessionTimer();
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
            this.timeRemaining.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Warning when 5 minutes remaining
            if (timeLeft <= 5 * 60 * 1000 && timeLeft > 4 * 60 * 1000) {
                this.showAlert('Your session will expire in 5 minutes!', 'error');
            }
        }, 1000);
    }

    stopSessionTimer() {
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }

    handleSessionExpiry() {
        this.stopSessionTimer();
        localStorage.removeItem('dashboardSession');
        this.showLogin();
        this.showAlert('Your session has expired. Please login again to continue.');
    }

    handleLogout() {
        this.stopSessionTimer();
        localStorage.removeItem('dashboardSession');
        this.showLogin();
        this.showAlert('You have been logged out successfully.', 'success');
    }

    clearForm() {
        this.loginForm.reset();
        this.clearFieldError('emailGroup');
        this.clearFieldError('passwordGroup');
    }

    updateActivityLog(activity) {
        const activityLog = document.querySelector('.activity-log');
        const newActivity = document.createElement('div');
        newActivity.className = 'activity-item';
        newActivity.textContent = `✅ ${activity} - ${new Date().toLocaleTimeString()}`;
        
        const firstActivity = activityLog.querySelector('.activity-item');
        if (firstActivity) {
            activityLog.insertBefore(newActivity, firstActivity);
        } else {
            activityLog.appendChild(newActivity);
        }
        
        // Keep only last 5 activities
        const activities = activityLog.querySelectorAll('.activity-item');
        if (activities.length > 5) {
            activities[activities.length - 1].remove();
        }
    }
}

// Initialize the login system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Option 1: Use default configuration
    // new LoginSystem();
    
    // Option 2: Configure with custom base URL
    const loginSystem = new LoginSystem({
        baseURL: 'https://api-urban.zuhouz.com', // Change this to your backend URL
        sessionDuration: 30 * 60 * 1000   // Optional: change session duration
    });
    
    // Option 3: Update base URL after initialization
    // loginSystem.setBaseURL('https://your-api-domain.com/api/v1');
    
    // Option 4: Test API connection (optional)
    // loginSystem.testConnection();
});

// Handle page visibility change to check session
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible, check if session is still valid
        const sessionData = localStorage.getItem('dashboardSession');
        if (sessionData) {
            const session = JSON.parse(sessionData);
            if (Date.now() >= session.expiryTime) {
                localStorage.removeItem('dashboardSession');
                window.location.reload();
            }
        }
    }
}); 