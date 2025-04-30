import os
import logging
from flask import Flask, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.config.from_object('config')
app.secret_key = os.environ.get("SESSION_SECRET", "your-secret-key-for-development")

# Configure session to be more persistent
app.config['SESSION_TYPE'] = 'filesystem'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_COOKIE_SECURE'] = False  # Set to True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Setup CORS
CORS(app)

# Setup JWT
jwt = JWTManager(app)

# Initialize database
from database import init_db
init_db()

# Import routes
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.website import website_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(admin_bp, url_prefix='/admin')
app.register_blueprint(website_bp, url_prefix='/website')

# Default route
@app.route('/')
def index():
    from flask import render_template
    return render_template('index.html')

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    from flask import render_template
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    from flask import render_template
    return render_template('500.html'), 500
