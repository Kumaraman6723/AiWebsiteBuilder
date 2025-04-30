import os
import sys
from pymongo import MongoClient
from datetime import datetime
from werkzeug.security import generate_password_hash
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB connection string
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://bloxlink19:Jadoo1234@cluster0.egr8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DATABASE_NAME = "website_builder"

def hash_password(password):
    """Hash a password using werkzeug"""
    return generate_password_hash(password)

def create_admin_user(email, password, name):
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI)
        db = client[DATABASE_NAME]
        users_collection = db.users
        
        # Check if admin user already exists
        existing_admin = users_collection.find_one({"role_id": "admin"})
        if existing_admin:
            logger.info(f"Admin user already exists with email: {existing_admin['email']}")
            return False
            
        # Check if user with email already exists
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            logger.info(f"User with email {email} already exists")
            return False
            
        # Create admin user
        admin_user = {
            "email": email,
            "password": hash_password(password),
            "name": name,
            "role_id": "admin",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert admin user
        result = users_collection.insert_one(admin_user)
        
        if result.inserted_id:
            logger.info(f"Admin user created successfully with email: {email}")
            return True
        else:
            logger.error("Failed to create admin user")
            return False
            
    except Exception as e:
        logger.error(f"Error creating admin user: {str(e)}")
        return False

if __name__ == "__main__":
    # Default admin credentials
    admin_email = "admin@example.com"
    admin_password = "admin123"
    admin_name = "Administrator"
    
    # Check for command line arguments
    if len(sys.argv) >= 4:
        admin_email = sys.argv[1]
        admin_password = sys.argv[2]
        admin_name = sys.argv[3]
    
    logger.info("Creating admin user...")
    success = create_admin_user(admin_email, admin_password, admin_name)
    
    if success:
        logger.info(f"Admin user created successfully!")
        logger.info(f"Email: {admin_email}")
        logger.info(f"Password: {admin_password}")
    else:
        logger.info("Failed to create admin user. Check logs for details.")