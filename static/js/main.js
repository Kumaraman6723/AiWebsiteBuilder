/**
 * Main JavaScript file for AI Website Builder
 * Contains shared functionality used across multiple pages
 */

// Handle JWT token storage and retrieval
const authManager = {
    // Store token in sessionStorage
    storeToken: function(token) {
        sessionStorage.setItem('accessToken', token);
    },
    
    // Get token from sessionStorage
    getToken: function() {
        return sessionStorage.getItem('accessToken');
    },
    
    // Check if user is authenticated
    isAuthenticated: function() {
        return !!this.getToken();
    },
    
    // Clear token on logout
    clearToken: function() {
        sessionStorage.removeItem('accessToken');
    }
};

// Configure Axios defaults if Axios is available
if (typeof axios !== 'undefined') {
    // Add authorization header to all requests
    axios.interceptors.request.use(function(config) {
        const token = authManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }, function(error) {
        return Promise.reject(error);
    });
    
    // Handle 401 Unauthorized responses
    axios.interceptors.response.use(function(response) {
        return response;
    }, function(error) {
        if (error.response && error.response.status === 401) {
            // Redirect to login page if unauthorized
            window.location.href = '/login';
        }
        return Promise.reject(error);
    });
}

// Show notification
function showNotification(message, type = 'success') {
    // Check if Bootstrap toast is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            document.body.appendChild(toastContainer);
        }
        
        // Create toast element
        const toastEl = document.createElement('div');
        toastEl.className = `toast align-items-center text-white bg-${type} border-0`;
        toastEl.setAttribute('role', 'alert');
        toastEl.setAttribute('aria-live', 'assertive');
        toastEl.setAttribute('aria-atomic', 'true');
        
        // Create toast body
        const toastBody = document.createElement('div');
        toastBody.className = 'd-flex';
        
        const toastContent = document.createElement('div');
        toastContent.className = 'toast-body';
        toastContent.textContent = message;
        
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close btn-close-white me-2 m-auto';
        closeButton.setAttribute('data-bs-dismiss', 'toast');
        closeButton.setAttribute('aria-label', 'Close');
        
        toastBody.appendChild(toastContent);
        toastBody.appendChild(closeButton);
        toastEl.appendChild(toastBody);
        toastContainer.appendChild(toastEl);
        
        // Show toast
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        
        // Remove toast after it's hidden
        toastEl.addEventListener('hidden.bs.toast', function() {
            toastEl.remove();
        });
    } else {
        // Fallback to alert if Bootstrap is not available
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

// Handle form submission with AJAX
function handleFormSubmit(formElement, options = {}) {
    const defaults = {
        method: 'POST',
        successCallback: null,
        errorCallback: null,
        resetForm: false,
        redirectUrl: null,
        showSuccessMessage: true,
        successMessage: 'Form submitted successfully',
        contentType: 'application/json'
    };
    
    const settings = {...defaults, ...options};
    
    formElement.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form data
        let formData;
        if (settings.contentType === 'application/json') {
            formData = {};
            for (const element of formElement.elements) {
                if (element.name) {
                    formData[element.name] = element.value;
                }
            }
        } else {
            formData = new FormData(formElement);
        }
        
        // Send AJAX request
        const xhr = new XMLHttpRequest();
        xhr.open(settings.method, formElement.action);
        
        if (settings.contentType === 'application/json') {
            xhr.setRequestHeader('Content-Type', 'application/json');
        }
        
        const token = authManager.getToken();
        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                // Success
                if (settings.showSuccessMessage) {
                    showNotification(settings.successMessage);
                }
                
                if (settings.resetForm) {
                    formElement.reset();
                }
                
                if (settings.successCallback) {
                    settings.successCallback(xhr.responseText ? JSON.parse(xhr.responseText) : null);
                }
                
                if (settings.redirectUrl) {
                    window.location.href = settings.redirectUrl;
                }
            } else {
                // Error
                let errorMessage = 'An error occurred';
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.error || errorMessage;
                } catch (e) {
                    // Ignore parse errors
                }
                
                showNotification(errorMessage, 'danger');
                
                if (settings.errorCallback) {
                    settings.errorCallback(errorMessage);
                }
            }
        };
        
        xhr.onerror = function() {
            showNotification('Network error occurred', 'danger');
            
            if (settings.errorCallback) {
                settings.errorCallback('Network error');
            }
        };
        
        if (settings.contentType === 'application/json') {
            xhr.send(JSON.stringify(formData));
        } else {
            xhr.send(formData);
        }
    });
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Process all elements with data-active-route attribute
    const currentPath = window.location.pathname;
    document.querySelectorAll('[data-active-route]').forEach(element => {
        const route = element.getAttribute('data-active-route');
        
        if (currentPath === route || currentPath.startsWith(route)) {
            element.classList.add('active');
        }
    });
    
    // Check for authentication token in URL parameters (for redirect back from OAuth providers)
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');
    
    if (accessToken) {
        // Store tokens from URL parameters
        authManager.storeToken(accessToken);
        sessionStorage.setItem('refreshToken', refreshToken);
        
        // Clean URL
        const cleanUrl = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, cleanUrl);
    }
});

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return dateString;
    }
    
    // Format date: YYYY-MM-DD
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// Get query parameter from URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Set active navigation link based on current path
function setActiveNavLink() {
    const currentPath = window.location.pathname;
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === currentPath || (href !== '/' && currentPath.startsWith(href))) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Execute when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveNavLink);
} else {
    setActiveNavLink();
}
