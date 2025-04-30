import re
import jwt
from functools import wraps
from flask import request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import config

def hash_password(password):
    """Hash a password using werkzeug"""
    return generate_password_hash(password)

def check_password(hashed_password, password):
    """Check a password against its hash"""
    return check_password_hash(hashed_password, password)

def generate_token(user_id, role):
    """Generate a JWT token"""
    import datetime
    from flask_jwt_extended import create_access_token, create_refresh_token
    
    # Create access token
    access_token = create_access_token(
        identity=str(user_id),
        additional_claims={"role": role}
    )
    
    # Create refresh token
    refresh_token = create_refresh_token(
        identity=str(user_id),
        additional_claims={"role": role}
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token
    }

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """
    Validate password strength
    - At least 8 characters
    - Contains at least one digit
    - Contains at least one uppercase letter
    """
    if len(password) < 8:
        return False
    if not re.search(r'\d', password):
        return False
    if not re.search(r'[A-Z]', password):
        return False
    return True

def get_error_response(message, status_code=400):
    """Generate an error response"""
    return jsonify({"error": message}), status_code

def get_success_response(data, message="Success", status_code=200):
    """Generate a success response"""
    response = {
        "message": message,
        "data": data
    }
    return jsonify(response), status_code

def has_permission(user, permission):
    """Check if a user has a specific permission"""
    from database import get_collection
    
    # Get user role
    if not user or 'role_id' not in user:
        return False
    
    # Get role details
    roles_collection = get_collection('roles')
    role = roles_collection.find_one({"role_id": user['role_id']})
    
    if not role:
        return False
    
    # Check if permission exists in role
    return permission in role.get('permissions', [])

def sanitize_user(user):
    """Remove sensitive fields from user object"""
    if user:
        # Make a copy to avoid modifying the original
        user_copy = dict(user)
        
        # Remove sensitive fields
        user_copy.pop('password', None)
        
        return user_copy
    return None
