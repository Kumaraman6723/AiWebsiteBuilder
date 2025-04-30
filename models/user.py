from bson import ObjectId
from datetime import datetime
from database import get_collection, serialize_doc
from utils import hash_password, check_password, validate_email

class User:
    """User model for the application"""
    
    @staticmethod
    def create(email, password, name, role_id="viewer"):
        """
        Create a new user
        
        Args:
            email (str): User's email address
            password (str): User's password
            name (str): User's full name
            role_id (str): User's role ID (default: viewer)
            
        Returns:
            dict: Created user document or None if creation failed
        """
        users = get_collection('users')
        
        # Check if user with email already exists
        if users.find_one({"email": email}):
            return None
            
        # Create user document
        user = {
            "email": email,
            "password": hash_password(password),
            "name": name,
            "role_id": role_id,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user into database
        result = users.insert_one(user)
        
        # Return user if insertion was successful
        if result.inserted_id:
            user["_id"] = result.inserted_id
            # Don't return password
            user.pop("password")
            return serialize_doc(user)
        
        return None
    
    @staticmethod
    def authenticate(email, password):
        """
        Authenticate a user
        
        Args:
            email (str): User's email address
            password (str): User's password
            
        Returns:
            dict: User document if authentication successful, None otherwise
        """
        users = get_collection('users')
        
        # Find user by email
        user = users.find_one({"email": email})
        
        # Check if user exists and password is correct
        if user and check_password(user["password"], password):
            # Don't return password
            user_copy = dict(user)
            user_copy.pop("password")
            return serialize_doc(user_copy)
            
        return None
    
    @staticmethod
    def get_by_id(user_id):
        """
        Get a user by ID
        
        Args:
            user_id (str): User's ID
            
        Returns:
            dict: User document or None if not found
        """
        users = get_collection('users')
        
        # Convert string ID to ObjectId
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Find user by ID
        user = users.find_one({"_id": user_id})
        
        if user:
            # Don't return password
            user_copy = dict(user)
            user_copy.pop("password")
            return serialize_doc(user_copy)
            
        return None
    
    @staticmethod
    def get_all():
        """
        Get all users
        
        Returns:
            list: List of all user documents
        """
        users = get_collection('users')
        
        # Get all users and exclude passwords
        all_users = users.find({}, {"password": 0})
        
        return [serialize_doc(user) for user in all_users]
    
    @staticmethod
    def update(user_id, data):
        """
        Update a user
        
        Args:
            user_id (str): User's ID
            data (dict): Data to update
            
        Returns:
            dict: Updated user document or None if update failed
        """
        users = get_collection('users')
        
        # Convert string ID to ObjectId
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        
        # Include allowed fields
        for field in ["name", "email", "role_id"]:
            if field in data:
                update_data[field] = data[field]
                
        # Hash password if provided
        if "password" in data and data["password"]:
            update_data["password"] = hash_password(data["password"])
            
        # Update user in database
        result = users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        
        # Return updated user if successful
        if result.modified_count > 0:
            user = users.find_one({"_id": user_id}, {"password": 0})
            return serialize_doc(user)
            
        return None
    
    @staticmethod
    def delete(user_id):
        """
        Delete a user
        
        Args:
            user_id (str): User's ID
            
        Returns:
            bool: True if deletion successful, False otherwise
        """
        users = get_collection('users')
        
        # Convert string ID to ObjectId
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Delete user from database
        result = users.delete_one({"_id": user_id})
        
        # Return True if deletion was successful
        return result.deleted_count > 0
    
    @staticmethod
    def update_role(user_id, role_id):
        """
        Update a user's role
        
        Args:
            user_id (str): User's ID
            role_id (str): New role ID
            
        Returns:
            dict: Updated user document or None if update failed
        """
        users = get_collection('users')
        
        # Convert string ID to ObjectId
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Update user's role
        result = users.update_one(
            {"_id": user_id},
            {
                "$set": {
                    "role_id": role_id,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Return updated user if successful
        if result.modified_count > 0:
            user = users.find_one({"_id": user_id}, {"password": 0})
            return serialize_doc(user)
            
        return None
