import os
from datetime import timedelta

# Flask configuration
SECRET_KEY = os.environ.get("SESSION_SECRET", "your-secret-key-for-development")
DEBUG = True

# MongoDB configuration
MONGO_URI = os.environ.get("MONGO_URI", "mongodb+srv://bloxlink19:Jadoo1234@cluster0.egr8f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
DATABASE_NAME = "website_builder"

# JWT configuration
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-key-for-development")
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

# OpenAI configuration
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# User roles
ROLES = {
    "admin": {
        "name": "Admin",
        "description": "Full access to all resources",
        "permissions": ["user:read", "user:write", "user:delete", "role:read", "role:write", "role:delete", "website:read", "website:write", "website:delete"]
    },
    "editor": {
        "name": "Editor",
        "description": "Can create and edit their own websites",
        "permissions": ["website:read", "website:write"]
    },
    "viewer": {
        "name": "Viewer",
        "description": "Can only view websites",
        "permissions": ["website:read"]
    }
}

# Website template data
DEFAULT_TEMPLATE = {
    "name": "Business Template",
    "sections": [
        "hero",
        "about",
        "services",
        "features",
        "testimonials",
        "contact"
    ]
}
