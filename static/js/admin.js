/**
 * Admin module for user and role management
 * Handles admin dashboard, user management, and role permissions
 */

// User management functionality
const userManager = {
    // Initialize user management
    init: function() {
        // Setup add user form
        this.setupAddUserForm();
        
        // Setup edit user form
        this.setupEditUserForm();
        
        // Setup delete user functionality
        this.setupDeleteUserButtons();
        
        // Setup user filtering
        this.setupUserFiltering();
    },
    
    // Setup add user form
    setupAddUserForm: function() {
        const addUserBtn = document.getElementById('addUserBtn');
        const addUserForm = document.getElementById('addUserForm');
        
        if (addUserBtn && addUserForm) {
            addUserBtn.addEventListener('click', function() {
                // Get form data
                const formData = new FormData(addUserForm);
                const userData = {};
                
                for (const [key, value] of formData.entries()) {
                    userData[key] = value;
                }
                
                // Validate form data
                if (!userData.name || !userData.email || !userData.password || !userData.role_id) {
                    showNotification('Please fill in all required fields', 'warning');
                    return;
                }
                
                // Validate email format
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(userData.email)) {
                    showNotification('Please enter a valid email address', 'warning');
                    return;
                }
                
                // Validate password strength
                if (userData.password.length < 8) {
                    showNotification('Password must be at least 8 characters long', 'warning');
                    return;
                }
                
                // Create user
                userManager.createUser(userData);
            });
        }
    },
    
    // Create new user
    createUser: function(userData) {
        // Send API request
        fetch('/admin/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getToken()}`
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create user');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('User created successfully', 'success');
            
            // Hide modal
            const addUserModal = bootstrap.Modal.getInstance(document.getElementById('addUserModal'));
            if (addUserModal) {
                addUserModal.hide();
            }
            
            // Reset form
            document.getElementById('addUserForm').reset();
            
            // Reload page to show new user
            window.location.reload();
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Setup edit user form
    setupEditUserForm: function() {
        // Setup edit user button click events
        document.querySelectorAll('.edit-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                
                // Get user data
                userManager.getUserData(userId);
            });
        });
        
        // Setup update user button
        const updateUserBtn = document.getElementById('updateUserBtn');
        const editUserForm = document.getElementById('editUserForm');
        
        if (updateUserBtn && editUserForm) {
            updateUserBtn.addEventListener('click', function() {
                // Get form data
                const formData = new FormData(editUserForm);
                const userData = {};
                
                for (const [key, value] of formData.entries()) {
                    // Only include non-empty values, except for checkbox fields
                    if (value !== '' || formData.get(`${key}-checkbox`) === 'on') {
                        userData[key] = value;
                    }
                }
                
                // Get user ID
                const userId = document.getElementById('editUserId').value;
                
                // Validate form data
                if (!userData.name || !userData.email || !userData.role_id) {
                    showNotification('Please fill in all required fields', 'warning');
                    return;
                }
                
                // Validate email format
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(userData.email)) {
                    showNotification('Please enter a valid email address', 'warning');
                    return;
                }
                
                // Update user
                userManager.updateUser(userId, userData);
            });
        }
    },
    
    // Get user data for editing
    getUserData: function(userId) {
        // Send API request
        fetch(`/admin/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authManager.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get user data');
            }
            return response.json();
        })
        .then(data => {
            // Populate edit form with user data
            const user = data.data.user;
            
            document.getElementById('editUserId').value = user._id;
            document.getElementById('editUserName').value = user.name;
            document.getElementById('editUserEmail').value = user.email;
            document.getElementById('editUserRole').value = user.role_id;
            
            // Clear password field
            document.getElementById('editUserPassword').value = '';
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Update user
    updateUser: function(userId, userData) {
        // Send API request
        fetch(`/admin/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getToken()}`
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('User updated successfully', 'success');
            
            // Hide modal
            const editUserModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            if (editUserModal) {
                editUserModal.hide();
            }
            
            // Reset form
            document.getElementById('editUserForm').reset();
            
            // Reload page to show updated user
            window.location.reload();
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Setup delete user functionality
    setupDeleteUserButtons: function() {
        // Setup delete user button click events
        document.querySelectorAll('.delete-user-btn').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-user-id');
                
                if (userId) {
                    document.getElementById('deleteUserId').value = userId;
                }
            });
        });
        
        // Setup confirm delete button
        const deleteUserBtn = document.getElementById('deleteUserBtn');
        if (deleteUserBtn) {
            deleteUserBtn.addEventListener('click', function() {
                const userId = document.getElementById('deleteUserId').value;
                
                if (userId) {
                    userManager.deleteUser(userId);
                }
            });
        }
    },
    
    // Delete user
    deleteUser: function(userId) {
        // Send API request
        fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authManager.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('User deleted successfully', 'success');
            
            // Hide modal
            const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
            if (deleteUserModal) {
                deleteUserModal.hide();
            }
            
            // Remove user from table or reload page
            const userRow = document.querySelector(`[data-user-id="${userId}"]`);
            if (userRow) {
                userRow.remove();
            } else {
                window.location.reload();
            }
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Setup user filtering
    setupUserFiltering: function() {
        const searchInput = document.getElementById('searchUsers');
        const filterRole = document.getElementById('filterRole');
        const applyFiltersBtn = document.getElementById('applyFilters');
        
        if (searchInput && filterRole && applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', function() {
                const searchTerm = searchInput.value.toLowerCase();
                const roleFilter = filterRole.value;
                const userRows = document.querySelectorAll('tr[data-user-id]');
                
                userRows.forEach(row => {
                    const userName = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                    const userEmail = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    const userRole = row.querySelector('.badge').textContent.toLowerCase();
                    
                    // Check if matches search term
                    const matchesSearch = searchTerm === '' || 
                        userName.includes(searchTerm) || 
                        userEmail.includes(searchTerm);
                    
                    // Check if matches role filter
                    const matchesRole = roleFilter === '' || 
                        userRole.toLowerCase() === roleFilter.toLowerCase();
                    
                    // Show/hide row based on filters
                    if (matchesSearch && matchesRole) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
            
            // Clear filters button
            const clearFiltersBtn = document.createElement('button');
            clearFiltersBtn.type = 'button';
            clearFiltersBtn.className = 'btn btn-secondary ms-2';
            clearFiltersBtn.innerHTML = '<i class="bi bi-x-circle me-2"></i> Clear';
            clearFiltersBtn.addEventListener('click', function() {
                searchInput.value = '';
                filterRole.value = '';
                
                // Reset table
                document.querySelectorAll('tr[data-user-id]').forEach(row => {
                    row.style.display = '';
                });
            });
            
            // Add clear button next to apply button
            applyFiltersBtn.parentNode.appendChild(clearFiltersBtn);
        }
    }
};

// Role management functionality
const roleManager = {
    // Initialize role management
    init: function() {
        // Setup add role form
        this.setupAddRoleForm();
        
        // Setup edit role form
        this.setupEditRoleForm();
        
        // Setup delete role functionality
        this.setupDeleteRoleButtons();
    },
    
    // Setup add role form
    setupAddRoleForm: function() {
        const addRoleBtn = document.getElementById('addRoleBtn');
        const addRoleForm = document.getElementById('addRoleForm');
        
        if (addRoleBtn && addRoleForm) {
            addRoleBtn.addEventListener('click', function() {
                // Get role ID, name, description
                const roleId = document.getElementById('addRoleId').value;
                const name = document.getElementById('addRoleName').value;
                const description = document.getElementById('addRoleDescription').value;
                
                // Get selected permissions
                const permissions = [];
                addRoleForm.querySelectorAll('input[name="permissions"]:checked').forEach(checkbox => {
                    permissions.push(checkbox.value);
                });
                
                // Validate form data
                if (!roleId || !name || !description) {
                    showNotification('Please fill in all required fields', 'warning');
                    return;
                }
                
                // Validate role ID format (lowercase, no spaces)
                if (!/^[a-z0-9_-]+$/.test(roleId)) {
                    showNotification('Role ID must be lowercase letters, numbers, underscores or hyphens only', 'warning');
                    return;
                }
                
                // Check if at least one permission is selected
                if (permissions.length === 0) {
                    showNotification('Please select at least one permission', 'warning');
                    return;
                }
                
                // Create role
                const roleData = {
                    role_id: roleId,
                    name: name,
                    description: description,
                    permissions: permissions
                };
                
                roleManager.createRole(roleData);
            });
        }
    },
    
    // Create new role
    createRole: function(roleData) {
        // Send API request
        fetch('/admin/roles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getToken()}`
            },
            body: JSON.stringify(roleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create role');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('Role created successfully', 'success');
            
            // Hide modal
            const addRoleModal = bootstrap.Modal.getInstance(document.getElementById('addRoleModal'));
            if (addRoleModal) {
                addRoleModal.hide();
            }
            
            // Reset form
            document.getElementById('addRoleForm').reset();
            
            // Reload page to show new role
            window.location.reload();
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Setup edit role form
    setupEditRoleForm: function() {
        // Setup edit role button click events
        document.querySelectorAll('.edit-role-btn').forEach(button => {
            button.addEventListener('click', function() {
                const roleId = this.getAttribute('data-role-id');
                
                // Get role data
                roleManager.getRoleData(roleId);
            });
        });
        
        // Setup update role button
        const updateRoleBtn = document.getElementById('updateRoleBtn');
        const editRoleForm = document.getElementById('editRoleForm');
        
        if (updateRoleBtn && editRoleForm) {
            updateRoleBtn.addEventListener('click', function() {
                // Get role ID, name, description
                const roleId = document.getElementById('editRoleId').value;
                const name = document.getElementById('editRoleName').value;
                const description = document.getElementById('editRoleDescription').value;
                
                // Get selected permissions
                const permissions = [];
                editRoleForm.querySelectorAll('input[name="permissions"]:checked').forEach(checkbox => {
                    permissions.push(checkbox.value);
                });
                
                // Validate form data
                if (!roleId || !name || !description) {
                    showNotification('Please fill in all required fields', 'warning');
                    return;
                }
                
                // Check if at least one permission is selected
                if (permissions.length === 0) {
                    showNotification('Please select at least one permission', 'warning');
                    return;
                }
                
                // Update role
                const roleData = {
                    name: name,
                    description: description,
                    permissions: permissions
                };
                
                roleManager.updateRole(roleId, roleData);
            });
        }
    },
    
    // Get role data for editing
    getRoleData: function(roleId) {
        // Send API request
        fetch(`/admin/roles/${roleId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authManager.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to get role data');
            }
            return response.json();
        })
        .then(data => {
            // Populate edit form with role data
            const role = data.data.role;
            
            document.getElementById('editRoleId').value = role.role_id;
            document.getElementById('editRoleName').value = role.name;
            document.getElementById('editRoleDescription').value = role.description;
            
            // Check permission checkboxes
            document.querySelectorAll('#editRoleForm input[name="permissions"]').forEach(checkbox => {
                checkbox.checked = role.permissions.includes(checkbox.value);
            });
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Update role
    updateRole: function(roleId, roleData) {
        // Send API request
        fetch(`/admin/roles/${roleId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authManager.getToken()}`
            },
            body: JSON.stringify(roleData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update role');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('Role updated successfully', 'success');
            
            // Hide modal
            const editRoleModal = bootstrap.Modal.getInstance(document.getElementById('editRoleModal'));
            if (editRoleModal) {
                editRoleModal.hide();
            }
            
            // Reload page to show updated role
            window.location.reload();
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    },
    
    // Setup delete role functionality
    setupDeleteRoleButtons: function() {
        // Setup delete role button click events
        document.querySelectorAll('.delete-role-btn').forEach(button => {
            button.addEventListener('click', function() {
                const roleId = this.getAttribute('data-role-id');
                
                if (roleId) {
                    document.getElementById('deleteRoleId').value = roleId;
                }
            });
        });
        
        // Setup confirm delete button
        const deleteRoleBtn = document.getElementById('deleteRoleBtn');
        if (deleteRoleBtn) {
            deleteRoleBtn.addEventListener('click', function() {
                const roleId = document.getElementById('deleteRoleId').value;
                
                if (roleId) {
                    roleManager.deleteRole(roleId);
                }
            });
        }
    },
    
    // Delete role
    deleteRole: function(roleId) {
        // Send API request
        fetch(`/admin/roles/${roleId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authManager.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete role');
            }
            return response.json();
        })
        .then(data => {
            // Show success message
            showNotification('Role deleted successfully', 'success');
            
            // Hide modal
            const deleteRoleModal = bootstrap.Modal.getInstance(document.getElementById('deleteRoleModal'));
            if (deleteRoleModal) {
                deleteRoleModal.hide();
            }
            
            // Remove role from table or reload page
            const roleRow = document.querySelector(`[data-role-id="${roleId}"]`);
            if (roleRow) {
                roleRow.remove();
            } else {
                window.location.reload();
            }
        })
        .catch(error => {
            // Show error message
            showNotification(`Error: ${error.message}`, 'danger');
        });
    }
};

// Admin dashboard functionality
const adminDashboard = {
    // Initialize admin dashboard
    init: function() {
        this.loadStats();
    },
    
    // Load admin dashboard statistics
    loadStats: function() {
        // Placeholder for dashboard statistics
        // In a real application, you would fetch this data from your backend API
        
        // Example data setup
        const statsData = {
            users: {
                total: 0,
                byRole: {
                    admin: 0,
                    editor: 0,
                    viewer: 0
                }
            },
            websites: {
                total: 0,
                byStatus: {
                    published: 0,
                    draft: 0
                }
            }
        };
        
        // Fetch users data
        fetch('/admin/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authManager.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users data');
            }
            return response.json();
        })
        .then(data => {
            const users = data.data.users;
            
            // Update users stats
            statsData.users.total = users.length;
            
            // Count users by role
            users.forEach(user => {
                if (user.role_id in statsData.users.byRole) {
                    statsData.users.byRole[user.role_id]++;
                }
            });
            
            // Update UI
            this.updateUsersStats(statsData.users);
        })
        .catch(error => {
            console.error('Error fetching users data:', error);
        });
        
        // Fetch websites data
        fetch('/website/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authManager.getToken()}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch websites data');
            }
            return response.json();
        })
        .then(data => {
            const websites = data.data.websites;
            
            // Update websites stats
            statsData.websites.total = websites.length;
            
            // Count websites by status
            websites.forEach(website => {
                if (website.status in statsData.websites.byStatus) {
                    statsData.websites.byStatus[website.status]++;
                }
            });
            
            // Update UI
            this.updateWebsitesStats(statsData.websites);
        })
        .catch(error => {
            console.error('Error fetching websites data:', error);
        });
    },
    
    // Update users statistics in the UI
    updateUsersStats: function(usersStats) {
        // Update total users count
        document.getElementById('totalUsers').textContent = usersStats.total;
        
        // Update role counts
        document.getElementById('adminCount').textContent = usersStats.byRole.admin;
        document.getElementById('editorCount').textContent = usersStats.byRole.editor;
        document.getElementById('viewerCount').textContent = usersStats.byRole.viewer;
        
        // Update progress bar
        const adminProgress = document.getElementById('adminProgress');
        if (adminProgress && usersStats.total > 0) {
            const adminPercentage = Math.round((usersStats.byRole.admin / usersStats.total) * 100);
            adminProgress.style.width = `${adminPercentage}%`;
            adminProgress.setAttribute('aria-valuenow', adminPercentage);
        }
    },
    
    // Update websites statistics in the UI
    updateWebsitesStats: function(websitesStats) {
        // Update total websites count
        document.getElementById('totalWebsites').textContent = websitesStats.total;
        
        // Update status counts
        document.getElementById('publishedCount').textContent = websitesStats.byStatus.published;
        document.getElementById('draftCount').textContent = websitesStats.byStatus.draft;
        
        // Update progress bar
        const publishedProgress = document.getElementById('publishedProgress');
        if (publishedProgress && websitesStats.total > 0) {
            const publishedPercentage = Math.round((websitesStats.byStatus.published / websitesStats.total) * 100);
            publishedProgress.style.width = `${publishedPercentage}%`;
            publishedProgress.setAttribute('aria-valuenow', publishedPercentage);
        }
    }
};

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user management if on users page
    if (document.querySelector('.edit-user-btn')) {
        userManager.init();
    }
    
    // Initialize role management if on roles page
    if (document.querySelector('.edit-role-btn')) {
        roleManager.init();
    }
    
    // Initialize admin dashboard if on admin dashboard page
    if (document.getElementById('adminProgress')) {
        adminDashboard.init();
    }
});
