# AI-powered Website Builder

An intelligent web application that leverages AI to simplify website creation for small businesses.

## Overview

The AI-powered Website Builder is a Flask-based application that uses OpenAI's API to generate custom website content based on business type, industry, and user preferences. The platform enables users to create, manage, and publish professional websites without extensive design or development knowledge.

## Features

### Core Features

- **AI-Generated Content**: Automatically create tailored website content based on business information.
- **Customizable Templates**: Multiple website templates optimized for different business types.
- **Intelligent Color Schemes**: AI-suggested color palettes that match your brand's tone and industry.
- **Role-Based Access Control**: Three levels of user permissions:
  - **Admin**: Full access to all features, user management, and role management.
  - **Editor**: Can create, edit, and delete websites.
  - **Viewer**: Can only view websites.
- **Responsive Design**: All generated websites are mobile-friendly out of the box.
- **Live Preview**: Preview websites before publishing.
- **Publish/Unpublish Control**: Easily manage website visibility.

### Technical Features

- **MongoDB Integration**: Flexible data storage for website content and user information.
- **JWT Authentication**: Secure API access with token-based authentication.
- **OpenAI API Integration**: Leverages advanced AI for content generation.
- **RESTful API Architecture**: Well-structured API endpoints for all functionality.
- **Role-Based Permissions**: Secure middleware that enforces permission rules.

## System Requirements

- Python 3.10+
- MongoDB 4.4+
- OpenAI API key

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-website-builder.git
   cd ai-website-builder
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements_list.txt
   ```

3. Set up environment variables:
   ```bash
   export FLASK_APP=main.py
   export FLASK_ENV=development
   export MONGODB_URI="mongodb+srv://your-connection-string"
   export OPENAI_API_KEY="your-api-key"
   export SECRET_KEY="your-secret-key"
   ```

4. Create an admin user:
   ```bash
   python create_admin.py
   ```

5. Start the server:
   ```bash
   gunicorn --bind 0.0.0.0:5000 --reuse-port --reload main:app
   ```

## Project Structure

```
.
├── ai_service.py           # AI integration services
├── app.py                  # Main Flask application setup
├── config.py               # Application configuration 
├── create_admin.py         # Admin user creation script
├── database.py             # Database connection and utilities
├── main.py                 # Application entry point
├── middlewares.py          # Authentication and permission middlewares
├── models/                 # Data models
│   ├── __init__.py
│   ├── role.py             # Role model
│   ├── user.py             # User model
│   └── website.py          # Website model
├── routes/                 # API routes
│   ├── __init__.py
│   ├── admin.py            # Admin-specific routes
│   ├── auth.py             # Authentication routes
│   └── website.py          # Website management routes
├── static/                 # Static assets
│   ├── css/
│   ├── js/
│   └── img/
├── templates/              # HTML templates
│   ├── admin/
│   ├── auth/
│   └── website/
└── utils.py                # Utility functions
```

## API Documentation

For detailed API documentation, see [api_documentation.md](api_documentation.md).

### Postman Collection

A Postman collection is included in the repository. Import `AI-Website-Builder-API.postman_collection.json` into Postman to quickly test the API endpoints.

## Usage Examples

### Creating a New Website

1. Log in to the application.
2. Click "Create New Website".
3. Fill in the business information:
   - Business Type: Restaurant
   - Industry: Food Service
   - Business Name: Mountain Fresh Bakery
   - Additional Information: Artisan bakery specializing in sourdough bread and pastries.
4. Click "Generate Content" to let the AI create your website content.
5. Customize the generated content as needed.
6. Click "Save" to save your website.
7. Click "Publish" when you're ready to make it live.

### Regenerating Content

1. Open an existing website in edit mode.
2. Click "Regenerate Content".
3. Adjust business information if needed.
4. Click "Generate" to create new content while preserving your existing customizations.

### Managing Users (Admin)

1. Log in as an admin user.
2. Navigate to the Admin Dashboard.
3. Click "Manage Users".
4. Add new users or edit existing user roles.

## Default Admin Credentials

- **Email**: admin@example.com
- **Password**: admin123

Change these credentials immediately after first login.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for their powerful API
- [Flask](https://flask.palletsprojects.com/) web framework
- [MongoDB](https://www.mongodb.com/) for database services
- All open-source libraries used in this project
