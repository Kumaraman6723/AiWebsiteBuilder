from flask import Blueprint, request, jsonify, render_template, redirect, url_for, session, g
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from models.user import User
from models.website import Website
from utils import get_error_response, get_success_response
from middlewares import permission_required, session_permission_required, session_or_jwt_required
from ai_service import generate_website_content, suggest_color_scheme

# Create blueprint
website_bp = Blueprint('website', __name__)

@website_bp.route('/', methods=['GET'])
@session_permission_required('website:read')
def get_websites():
    """Get all websites for current user endpoint"""
    # Check for user in g (set by session_permission_required decorator)
    user = g.user
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Get user ID from user object
    user_id = str(user['_id'])
    
    # Get websites based on role
    if user['role_id'] == 'admin':
        # Admin can see all websites
        websites = Website.get_all()
    else:
        # Other users can only see their own websites
        websites = Website.get_by_user(user_id)
    
    if request.is_json:
        return get_success_response({'websites': websites})
    else:
        return render_template('website/list.html', websites=websites, user=user)

@website_bp.route('/create', methods=['GET', 'POST'])
@session_permission_required('website:write')
def create_website():
    """Create website endpoint"""
    # Check for user in g (set by session_permission_required decorator)
    user = g.user
    
    if not user:
        return get_error_response('User not found', 404)
        
    # Get user ID from user object
    user_id = str(user['_id'])
    
    if request.method == 'GET':
        return render_template('website/create.html', user=user)
    
    if request.method == 'POST':
        # Get form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        # Extract website info
        title = data.get('title')
        business_type = data.get('business_type')
        industry = data.get('industry')
        business_name = data.get('business_name')
        additional_info = data.get('additional_info')
        
        # Validate input
        if not title or not business_type or not industry:
            return get_error_response('Title, business type, and industry are required')
        
        try:
            # Generate website content
            content = generate_website_content(
                business_type=business_type,
                industry=industry,
                business_name=business_name,
                additional_info=additional_info
            )
            
            # Add color scheme
            colors = suggest_color_scheme(business_type, industry)
            content['colors'] = colors
            
            # Create website
            website = Website.create(
                user_id=user_id,
                title=title,
                content=content
            )
            
            if not website:
                return get_error_response('Failed to create website')
            
            if request.is_json:
                return get_success_response({'website': website}, 'Website created successfully', 201)
            else:
                return redirect(url_for('website.edit_website', website_id=website['_id']))
                
        except Exception as e:
            return get_error_response(f'Failed to generate website content: {str(e)}')

@website_bp.route('/<website_id>', methods=['GET'])
@session_permission_required('website:read')
def get_website(website_id):
    """Get website by ID endpoint"""
    # Get website
    website = Website.get_by_id(website_id)
    
    if not website:
        return get_error_response('Website not found', 404)
    
    # Check for user in g (set by session_permission_required decorator)
    user = g.user
    
    if not user:
        return get_error_response('User not found', 404)
        
    # Get user ID from user object
    user_id = str(user['_id'])
    
    # Check if user has access to this website
    if user['role_id'] != 'admin' and str(website['user_id']) != user_id:
        return get_error_response('Access denied', 403)
    
    return get_success_response({'website': website})

@website_bp.route('/<website_id>/edit', methods=['GET', 'PUT'])
@session_permission_required('website:write')
def edit_website(website_id):
    """Edit website endpoint"""
    # Get website
    website = Website.get_by_id(website_id)
    
    if not website:
        return get_error_response('Website not found', 404)
    
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Check if user has access to edit this website
    if user['role_id'] != 'admin' and str(website['user_id']) != identity:
        return get_error_response('Access denied', 403)
    
    if request.method == 'GET':
        return render_template('website/edit.html', website=website, user=user)
    
    if request.method == 'PUT':
        # Get form data
        data = request.get_json()
        
        # Update website
        updated_website = Website.update(website_id, data)
        
        if not updated_website:
            return get_error_response('Failed to update website')
        
        return get_success_response({'website': updated_website}, 'Website updated successfully')

@website_bp.route('/<website_id>', methods=['DELETE'])
@session_permission_required('website:delete')
def delete_website(website_id):
    """Delete website endpoint"""
    # Get website
    website = Website.get_by_id(website_id)
    
    if not website:
        return get_error_response('Website not found', 404)
    
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Check if user has access to delete this website
    if user['role_id'] != 'admin' and str(website['user_id']) != identity:
        return get_error_response('Access denied', 403)
    
    # Delete website
    success = Website.delete(website_id)
    
    if not success:
        return get_error_response('Failed to delete website')
    
    return get_success_response({}, 'Website deleted successfully')

@website_bp.route('/<website_id>/preview', methods=['GET'])
@session_permission_required('website:read')
def preview_website(website_id):
    """Preview website endpoint"""
    # Get website
    website = Website.get_by_id(website_id)
    
    if not website:
        return get_error_response('Website not found', 404)
    
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Check if user has access to preview this website
    if user['role_id'] != 'admin' and str(website['user_id']) != identity:
        return get_error_response('Access denied', 403)
    
    # Render website preview
    return render_template('website/preview.html', website=website, user=user)

@website_bp.route('/<website_id>/status', methods=['PUT'])
@session_permission_required('website:write')
def update_website_status(website_id):
    """Update website status endpoint"""
    # Get website
    website = Website.get_by_id(website_id)
    
    if not website:
        return get_error_response('Website not found', 404)
    
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Check if user has access to update this website
    if user['role_id'] != 'admin' and str(website['user_id']) != identity:
        return get_error_response('Access denied', 403)
    
    # Get form data
    data = request.get_json()
    status = data.get('status')
    
    if not status:
        return get_error_response('Status is required')
    
    # Update website status
    updated_website = Website.update_status(website_id, status)
    
    if not updated_website:
        return get_error_response('Failed to update website status')
    
    return get_success_response({'website': updated_website}, 'Website status updated successfully')

@website_bp.route('/<website_id>/regenerate', methods=['POST'])
@session_permission_required('website:write')
def regenerate_content(website_id):
    """Regenerate website content endpoint"""
    # Get website
    website = Website.get_by_id(website_id)
    
    if not website:
        return get_error_response('Website not found', 404)
    
    # Get user identity
    identity = get_jwt_identity()
    
    # Get user from database
    user = User.get_by_id(identity)
    
    if not user:
        return get_error_response('User not found', 404)
    
    # Check if user has access to update this website
    if user['role_id'] != 'admin' and str(website['user_id']) != identity:
        return get_error_response('Access denied', 403)
    
    # Get form data
    data = request.get_json()
    
    # Extract website info
    business_type = data.get('business_type')
    industry = data.get('industry')
    business_name = data.get('business_name')
    additional_info = data.get('additional_info')
    
    # Validate input
    if not business_type or not industry:
        return get_error_response('Business type and industry are required')
    
    try:
        # Generate website content
        content = generate_website_content(
            business_type=business_type,
            industry=industry,
            business_name=business_name,
            additional_info=additional_info
        )
        
        # Add color scheme
        colors = suggest_color_scheme(business_type, industry)
        content['colors'] = colors
        
        # Update website content
        updated_website = Website.update(website_id, {'content': content})
        
        if not updated_website:
            return get_error_response('Failed to update website content')
        
        return get_success_response({'website': updated_website}, 'Website content regenerated successfully')
    
    except Exception as e:
        return get_error_response(f'Failed to regenerate website content: {str(e)}')
