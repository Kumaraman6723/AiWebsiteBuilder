from functools import wraps
from flask import request, jsonify, g, session
from flask_jwt_extended import verify_jwt_in_request, get_jwt, get_jwt_identity
from database import get_collection
from utils import has_permission, get_error_response
from models.user import User

def jwt_required():
    """Verify JWT token is present and valid"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
                return f(*args, **kwargs)
            except Exception as e:
                return get_error_response("Authentication required", 401)
        return decorated_function
    return decorator

def load_user():
    """Load user from JWT token and store in Flask's g object"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request(optional=True)
                
                # Get user identity from JWT
                jwt_identity = get_jwt_identity()
                
                if jwt_identity:
                    # Get user from database
                    users_collection = get_collection('users')
                    user = users_collection.find_one({"_id": jwt_identity})
                    
                    # Store user in Flask's g object
                    g.user = user
                else:
                    g.user = None
                    
                return f(*args, **kwargs)
            except Exception as e:
                g.user = None
                return f(*args, **kwargs)
        return decorated_function
    return decorator

def permission_required(permission):
    """Check if user has required permission"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                verify_jwt_in_request()
                
                # Get user identity from JWT
                jwt_identity = get_jwt_identity()
                
                # Get user from database
                users_collection = get_collection('users')
                user = users_collection.find_one({"_id": jwt_identity})
                
                if not user:
                    return get_error_response("User not found", 404)
                
                # Check permission
                if not has_permission(user, permission):
                    return get_error_response("Permission denied", 403)
                
                # Store user in Flask's g object
                g.user = user
                
                return f(*args, **kwargs)
            except Exception as e:
                return get_error_response("Authentication required", 401)
        return decorated_function
    return decorator

def session_or_jwt_required():
    """Verify user is authenticated via session or JWT token"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # First check if user is logged in via session
            if 'user_id' in session:
                user = User.get_by_id(session['user_id'])
                if user:
                    g.user = user
                    return f(*args, **kwargs)
            
            # If not in session, try JWT
            try:
                verify_jwt_in_request()
                jwt_identity = get_jwt_identity()
                user = User.get_by_id(jwt_identity)
                
                if user:
                    g.user = user
                    return f(*args, **kwargs)
                    
                return get_error_response("User not found", 404)
            except Exception as e:
                return get_error_response("Authentication required", 401)
        return decorated_function
    return decorator

def session_permission_required(permission):
    """Check if user has required permission via session or JWT"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # First check if user is logged in via session
            if 'user_id' in session:
                user = User.get_by_id(session['user_id'])
                if user:
                    # Admin user has all permissions
                    if user['role_id'] == 'admin':
                        g.user = user
                        return f(*args, **kwargs)
                    
                    # For editor's permissions
                    if user['role_id'] == 'editor' and permission in ['website:read', 'website:write']:
                        g.user = user
                        return f(*args, **kwargs)
                    
                    # For viewer's permissions
                    if user['role_id'] == 'viewer' and permission == 'website:read':
                        g.user = user
                        return f(*args, **kwargs)
                    
                    # For other users, check specific permissions
                    if has_permission(user, permission):
                        g.user = user
                        return f(*args, **kwargs)
                    else:
                        return get_error_response("Permission denied", 403)
            
            # If not in session, try JWT
            try:
                verify_jwt_in_request()
                jwt_identity = get_jwt_identity()
                user = User.get_by_id(jwt_identity)
                
                if not user:
                    return get_error_response("User not found", 404)
                
                # Admin user has all permissions
                if user['role_id'] == 'admin':
                    g.user = user
                    return f(*args, **kwargs)
                
                # For editor's permissions
                if user['role_id'] == 'editor' and permission in ['website:read', 'website:write']:
                    g.user = user
                    return f(*args, **kwargs)
                
                # For viewer's permissions
                if user['role_id'] == 'viewer' and permission == 'website:read':
                    g.user = user
                    return f(*args, **kwargs)
                
                # For other users, check specific permissions
                if has_permission(user, permission):
                    g.user = user
                    return f(*args, **kwargs)
                else:
                    return get_error_response("Permission denied", 403)
            except Exception as e:
                return get_error_response("Authentication required", 401)
        return decorated_function
    return decorator

def admin_required():
    """Check if user is an admin"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # First check if user is admin via session
            if 'user_id' in session and 'user_role' in session:
                if session['user_role'] == 'admin':
                    # Get user for context
                    user = User.get_by_id(session['user_id'])
                    if user:
                        g.user = user
                    return f(*args, **kwargs)
            # If user_role not explicitly in session, but user_id is, try to fetch user
            elif 'user_id' in session:
                user = User.get_by_id(session['user_id'])
                if user and user['role_id'] == 'admin':
                    g.user = user
                    # Update session with role
                    session['user_role'] = 'admin'
                    return f(*args, **kwargs)
            
            # If not in session, try JWT
            try:
                verify_jwt_in_request()
                
                # Get user identity and claims from JWT
                jwt_identity = get_jwt_identity()
                claims = get_jwt()
                
                # If role claim exists and is admin
                if claims.get("role") == "admin":
                    user = User.get_by_id(jwt_identity)
                    if user:
                        g.user = user
                    return f(*args, **kwargs)
                
                # If no role in claims, check directly from database
                user = User.get_by_id(jwt_identity)
                if user and user['role_id'] == 'admin':
                    g.user = user
                    return f(*args, **kwargs)
                    
                return get_error_response("Admin access required", 403)
            except Exception as e:
                return get_error_response("Authentication required", 401)
        return decorated_function
    return decorator
