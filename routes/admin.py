from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User
from models.role import Role
from utils import get_error_response, get_success_response
from middlewares import admin_required

# Create blueprint
admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/')
@admin_bp.route('/dashboard')
def index():
    """Admin dashboard endpoint"""
    # Check if user is logged in
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    # Get user from database
    user = User.get_by_id(session['user_id'])
    
    if not user or user['role_id'] != 'admin':
        # Not an admin, redirect to regular dashboard
        return redirect(url_for('auth.dashboard'))
    
    # Render admin dashboard
    return render_template('admin/index.html', user=user)

# User management endpoints

@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_users():
    """Get all users endpoint"""
    # Get all users
    users = User.get_all()
    
    if request.is_json:
        return get_success_response({'users': users})
    else:
        # Get roles for dropdown
        roles = Role.get_all()
        return render_template('admin/users.html', users=users, roles=roles)

@admin_bp.route('/users/<user_id>', methods=['GET', 'PUT', 'DELETE'])
@admin_required()
def manage_user(user_id):
    """Manage user endpoint"""
    # Get user
    user = User.get_by_id(user_id)
    
    if not user:
        return get_error_response('User not found', 404)
    
    if request.method == 'GET':
        return get_success_response({'user': user})
    
    if request.method == 'PUT':
        # Get form data
        data = request.get_json()
        
        # Update user
        updated_user = User.update(user_id, data)
        
        if not updated_user:
            return get_error_response('Failed to update user')
        
        return get_success_response({'user': updated_user}, 'User updated successfully')
    
    if request.method == 'DELETE':
        # Delete user
        success = User.delete(user_id)
        
        if not success:
            return get_error_response('Failed to delete user')
        
        return get_success_response({}, 'User deleted successfully')

@admin_bp.route('/users/<user_id>/role', methods=['PUT'])
@admin_required()
def update_user_role(user_id):
    """Update user role endpoint"""
    # Get form data
    data = request.get_json()
    role_id = data.get('role_id')
    
    if not role_id:
        return get_error_response('Role ID is required')
    
    # Get role
    role = Role.get_by_id(role_id)
    
    if not role:
        return get_error_response('Role not found', 404)
    
    # Update user role
    updated_user = User.update_role(user_id, role_id)
    
    if not updated_user:
        return get_error_response('Failed to update user role')
    
    return get_success_response({'user': updated_user}, 'User role updated successfully')

# Role management endpoints

@admin_bp.route('/roles', methods=['GET', 'POST'])
@admin_required()
def roles():
    """Roles endpoint"""
    if request.method == 'GET':
        # Get all roles
        roles = Role.get_all()
        
        if request.is_json:
            return get_success_response({'roles': roles})
        else:
            # Get available permissions
            permissions = Role.get_permissions()
            return render_template('admin/roles.html', roles=roles, permissions=permissions)
    
    if request.method == 'POST':
        # Get form data
        data = request.get_json()
        role_id = data.get('role_id')
        name = data.get('name')
        description = data.get('description')
        permissions = data.get('permissions', [])
        
        # Validate input
        if not role_id or not name or not description:
            return get_error_response('Role ID, name, and description are required')
        
        # Create role
        role = Role.create(role_id=role_id, name=name, description=description, permissions=permissions)
        
        if not role:
            return get_error_response('Role with this ID already exists')
        
        return get_success_response({'role': role}, 'Role created successfully', 201)

@admin_bp.route('/roles/<role_id>', methods=['GET', 'PUT', 'DELETE'])
@admin_required()
def manage_role(role_id):
    """Manage role endpoint"""
    # Get role
    role = Role.get_by_id(role_id)
    
    if not role:
        return get_error_response('Role not found', 404)
    
    if request.method == 'GET':
        return get_success_response({'role': role})
    
    if request.method == 'PUT':
        # Get form data
        data = request.get_json()
        
        # Update role
        updated_role = Role.update(role_id, data)
        
        if not updated_role:
            return get_error_response('Failed to update role')
        
        return get_success_response({'role': updated_role}, 'Role updated successfully')
    
    if request.method == 'DELETE':
        # Make sure we're not deleting a default role
        if role_id in ['admin', 'editor', 'viewer']:
            return get_error_response('Cannot delete default role', 400)
        
        # Delete role
        success = Role.delete(role_id)
        
        if not success:
            return get_error_response('Failed to delete role')
        
        return get_success_response({}, 'Role deleted successfully')

@admin_bp.route('/permissions', methods=['GET'])
@admin_required()
def get_permissions():
    """Get all permissions endpoint"""
    # Get available permissions
    permissions = Role.get_permissions()
    
    return get_success_response({'permissions': permissions})
