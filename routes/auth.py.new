from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session, g
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.user import User
from utils import validate_email, validate_password, get_error_response, get_success_response

# Create blueprint
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """User registration endpoint"""
    if request.method == 'GET':
        return render_template('register.html')
    
    if request.method == 'POST':
        # Get form data
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
            name = data.get('name')
        else:
            email = request.form.get('email')
            password = request.form.get('password')
            name = request.form.get('name')
        
        # Validate input
        if not email or not password or not name:
            return get_error_response('Email, password, and name are required')
        
        if not validate_email(email):
            return get_error_response('Invalid email format')
            
        if not validate_password(password):
            return get_error_response('Password must be at least 8 characters, contain a digit and an uppercase letter')
        
        # Create user
        user = User.create(email=email, password=password, name=name)
        
        if not user:
            return get_error_response('User with this email already exists')
        
        # Generate tokens
        access_token = create_access_token(identity=str(user['_id']), additional_claims={"role": user['role_id']})
        refresh_token = create_refresh_token(identity=str(user['_id']), additional_claims={"role": user['role_id']})
        
        # Return tokens in response
        if request.is_json:
            return get_success_response({
                'user': user,
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 'User registered successfully', 201)
        else:
            # Store tokens in session
            session['access_token'] = access_token
            session['refresh_token'] = refresh_token
            session['user_id'] = str(user['_id'])
            
            return redirect(url_for('auth.dashboard'))

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login endpoint"""
    if request.method == 'GET':
        return render_template('login.html')
    
    if request.method == 'POST':
        # Get form data
        if request.is_json:
            data = request.get_json()
            email = data.get('email')
            password = data.get('password')
        else:
            email = request.form.get('email')
            password = request.form.get('password')
        
        # Validate input
        if not email or not password:
            return get_error_response('Email and password are required')
        
        # Authenticate user
        user = User.authenticate(email=email, password=password)
        
        if not user:
            return get_error_response('Invalid email or password', 401)
        
        # Generate tokens
        access_token = create_access_token(identity=str(user['_id']), additional_claims={"role": user['role_id']})
        refresh_token = create_refresh_token(identity=str(user['_id']), additional_claims={"role": user['role_id']})
        
        # Return tokens in response
        if request.is_json:
            return get_success_response({
                'user': user,
                'access_token': access_token,
                'refresh_token': refresh_token
            }, 'Login successful')
        else:
            # Store tokens in session
            session['access_token'] = access_token
            session['refresh_token'] = refresh_token
            session['user_id'] = str(user['_id'])
            
            return redirect(url_for('auth.dashboard'))

@auth_bp.route('/logout', methods=['GET', 'POST'])
def logout():
    """User logout endpoint"""
    # Clear session
    session.pop('access_token', None)
    session.pop('refresh_token', None)
    session.pop('user_id', None)
    
    return redirect(url_for('index'))

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token endpoint"""
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Generate new access token
    access_token = create_access_token(identity=identity, additional_claims={"role": user['role_id']})
    
    # Return new access token
    return get_success_response({
        'access_token': access_token
    }, 'Token refreshed successfully')

@auth_bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    """User profile endpoint"""
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    if request.method == 'GET':
        return get_success_response({'user': user})
    
    if request.method == 'PUT':
        # Get form data
        data = request.get_json()
        
        # Update user
        updated_user = User.update(identity, data)
        
        if not updated_user:
            return get_error_response('Failed to update user')
        
        return get_success_response({'user': updated_user}, 'User updated successfully')

@auth_bp.route('/dashboard')
def dashboard():
    """User dashboard endpoint"""
    # Check if user is logged in
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    # Get user from database
    user = User.get_by_id(session['user_id'])
    
    if not user:
        # Clear session and redirect to login
        session.pop('access_token', None)
        session.pop('refresh_token', None)
        session.pop('user_id', None)
        return redirect(url_for('auth.login'))
    
    # Render dashboard
    return render_template('dashboard.html', user=user)