import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from bson import ObjectId
import config

# Set up MongoDB client
client = None
db = None

def init_db():
    """Initialize database connection"""
    global client, db
    try:
        client = MongoClient(config.MONGO_URI)
        db = client[config.DATABASE_NAME]
        
        # Test connection
        client.admin.command('ping')
        logging.info("MongoDB connection successful")
        
        # Initialize default roles if they don't exist
        init_roles()
        
        return db
    except ConnectionFailure:
        logging.error("MongoDB connection failed")
        raise

def init_roles():
    """Initialize default roles in the database"""
    roles_collection = db.roles
    
    # Check if roles already exist
    if roles_collection.count_documents({}) == 0:
        logging.info("Initializing default roles")
        
        # Insert default roles from config
        for role_id, role_data in config.ROLES.items():
            roles_collection.insert_one({
                "role_id": role_id,
                "name": role_data["name"],
                "description": role_data["description"],
                "permissions": role_data["permissions"]
            })
        
        logging.info("Default roles initialized")

def get_collection(collection_name):
    """Get a collection from the database"""
    return db[collection_name]

def serialize_doc(doc):
    """Convert MongoDB document to serializable dict"""
    if doc:
        # Convert ObjectId to string
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])
        
        # Handle nested documents
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, list):
                for i, item in enumerate(value):
                    if isinstance(item, dict):
                        value[i] = serialize_doc(item)
    
    return doc

def serialize_docs(docs):
    """Convert multiple MongoDB documents to serializable dicts"""
    return [serialize_doc(doc) for doc in docs]
