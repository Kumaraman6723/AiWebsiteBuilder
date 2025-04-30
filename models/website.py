from bson import ObjectId
from datetime import datetime
from database import get_collection, serialize_doc

class Website:
    """Website model for the application"""
    
    @staticmethod
    def create(user_id, title, content, template="default", status="draft"):
        """
        Create a new website
        
        Args:
            user_id (str): Owner's user ID
            title (str): Website title
            content (dict): Website content
            template (str): Template name
            status (str): Website status (draft, published)
            
        Returns:
            dict: Created website document or None if creation failed
        """
        websites = get_collection('websites')
        
        # Convert string ID to ObjectId
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Create website document
        website = {
            "user_id": user_id,
            "title": title,
            "content": content,
            "template": template,
            "status": status,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert website into database
        result = websites.insert_one(website)
        
        # Return website if insertion was successful
        if result.inserted_id:
            website["_id"] = result.inserted_id
            return serialize_doc(website)
        
        return None
    
    @staticmethod
    def get_by_id(website_id):
        """
        Get a website by ID
        
        Args:
            website_id (str): Website ID
            
        Returns:
            dict: Website document or None if not found
        """
        websites = get_collection('websites')
        
        # Convert string ID to ObjectId
        if isinstance(website_id, str):
            website_id = ObjectId(website_id)
            
        # Find website by ID
        website = websites.find_one({"_id": website_id})
        
        return serialize_doc(website) if website else None
    
    @staticmethod
    def get_by_user(user_id):
        """
        Get all websites owned by a user
        
        Args:
            user_id (str): User ID
            
        Returns:
            list: List of website documents
        """
        websites = get_collection('websites')
        
        # Convert string ID to ObjectId
        if isinstance(user_id, str):
            user_id = ObjectId(user_id)
            
        # Find websites owned by user
        user_websites = websites.find({"user_id": user_id})
        
        return [serialize_doc(website) for website in user_websites]
    
    @staticmethod
    def get_all():
        """
        Get all websites
        
        Returns:
            list: List of all website documents
        """
        websites = get_collection('websites')
        
        # Get all websites
        all_websites = websites.find()
        
        return [serialize_doc(website) for website in all_websites]
    
    @staticmethod
    def update(website_id, data):
        """
        Update a website
        
        Args:
            website_id (str): Website ID
            data (dict): Data to update
            
        Returns:
            dict: Updated website document or None if update failed
        """
        websites = get_collection('websites')
        
        # Convert string ID to ObjectId
        if isinstance(website_id, str):
            website_id = ObjectId(website_id)
            
        # Prepare update data
        update_data = {"updated_at": datetime.utcnow()}
        
        # Include allowed fields
        for field in ["title", "content", "template", "status"]:
            if field in data:
                update_data[field] = data[field]
                
        # Update website in database
        result = websites.update_one(
            {"_id": website_id},
            {"$set": update_data}
        )
        
        # Return updated website if successful
        if result.modified_count > 0:
            website = websites.find_one({"_id": website_id})
            return serialize_doc(website)
            
        return None
    
    @staticmethod
    def delete(website_id):
        """
        Delete a website
        
        Args:
            website_id (str): Website ID
            
        Returns:
            bool: True if deletion successful, False otherwise
        """
        websites = get_collection('websites')
        
        # Convert string ID to ObjectId
        if isinstance(website_id, str):
            website_id = ObjectId(website_id)
            
        # Delete website from database
        result = websites.delete_one({"_id": website_id})
        
        # Return True if deletion was successful
        return result.deleted_count > 0
    
    @staticmethod
    def update_status(website_id, status):
        """
        Update a website's status
        
        Args:
            website_id (str): Website ID
            status (str): New status
            
        Returns:
            dict: Updated website document or None if update failed
        """
        websites = get_collection('websites')
        
        # Convert string ID to ObjectId
        if isinstance(website_id, str):
            website_id = ObjectId(website_id)
            
        # Update website's status
        result = websites.update_one(
            {"_id": website_id},
            {
                "$set": {
                    "status": status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Return updated website if successful
        if result.modified_count > 0:
            website = websites.find_one({"_id": website_id})
            return serialize_doc(website)
            
        return None
