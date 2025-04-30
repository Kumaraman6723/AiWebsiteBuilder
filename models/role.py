from database import get_collection, serialize_doc

class Role:
    """Role model for the application"""
    
    @staticmethod
    def get_all():
        """
        Get all roles
        
        Returns:
            list: List of all role documents
        """
        roles = get_collection('roles')
        
        # Get all roles
        all_roles = roles.find()
        
        return [serialize_doc(role) for role in all_roles]
    
    @staticmethod
    def get_by_id(role_id):
        """
        Get a role by ID
        
        Args:
            role_id (str): Role ID
            
        Returns:
            dict: Role document or None if not found
        """
        roles = get_collection('roles')
        
        # Find role by ID
        role = roles.find_one({"role_id": role_id})
        
        return serialize_doc(role) if role else None
    
    @staticmethod
    def create(role_id, name, description, permissions):
        """
        Create a new role
        
        Args:
            role_id (str): Role ID
            name (str): Role name
            description (str): Role description
            permissions (list): List of permissions
            
        Returns:
            dict: Created role document or None if creation failed
        """
        roles = get_collection('roles')
        
        # Check if role with ID already exists
        if roles.find_one({"role_id": role_id}):
            return None
            
        # Create role document
        role = {
            "role_id": role_id,
            "name": name,
            "description": description,
            "permissions": permissions
        }
        
        # Insert role into database
        result = roles.insert_one(role)
        
        # Return role if insertion was successful
        if result.inserted_id:
            role["_id"] = result.inserted_id
            return serialize_doc(role)
        
        return None
    
    @staticmethod
    def update(role_id, data):
        """
        Update a role
        
        Args:
            role_id (str): Role ID
            data (dict): Data to update
            
        Returns:
            dict: Updated role document or None if update failed
        """
        roles = get_collection('roles')
        
        # Prepare update data
        update_data = {}
        
        # Include allowed fields
        for field in ["name", "description", "permissions"]:
            if field in data:
                update_data[field] = data[field]
                
        # Update role in database
        result = roles.update_one(
            {"role_id": role_id},
            {"$set": update_data}
        )
        
        # Return updated role if successful
        if result.modified_count > 0:
            role = roles.find_one({"role_id": role_id})
            return serialize_doc(role)
            
        return None
    
    @staticmethod
    def delete(role_id):
        """
        Delete a role
        
        Args:
            role_id (str): Role ID
            
        Returns:
            bool: True if deletion successful, False otherwise
        """
        roles = get_collection('roles')
        
        # Delete role from database
        result = roles.delete_one({"role_id": role_id})
        
        # Return True if deletion was successful
        return result.deleted_count > 0
    
    @staticmethod
    def get_permissions():
        """
        Get all available permissions
        
        Returns:
            list: List of all available permissions
        """
        return [
            "user:read",
            "user:write",
            "user:delete",
            "role:read",
            "role:write",
            "role:delete",
            "website:read",
            "website:write",
            "website:delete"
        ]
