# AI-powered Website Builder API Documentation

This document provides detailed information about the available API endpoints in the AI-powered Website Builder application.

## Base URL

All API endpoints are relative to the base URL of your application. For example: `https://your-website-builder.com/api`

## Authentication

Most endpoints require authentication. The application uses JSON Web Tokens (JWT) for authentication.

To authenticate:

1. Obtain a token by sending a POST request to `/auth/login`
2. Include the token in subsequent requests in the `Authorization` header in the format: `Bearer <token>`

## Error Handling

Errors are returned with appropriate HTTP status codes and a JSON response with the following structure:

```json
{
  "success": false,
  "message": "Error message explaining the issue"
}
```

## API Endpoints

### Authentication

#### Register User

Creates a new user account.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Authentication**: None
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "success": true,
      "message": "User registered successfully",
      "data": {
        "user_id": "user123",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "viewer"
      }
    }
    ```

#### Login

Authenticates a user and returns an access token.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Authentication**: None
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securePassword123"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Login successful",
      "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "user_id": "user123",
          "name": "John Doe",
          "email": "user@example.com",
          "role": "viewer"
        }
      }
    }
    ```

#### Logout

Logs out the current user.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Logged out successfully"
    }
    ```

#### Refresh Token

Refreshes the current access token.

- **URL**: `/auth/refresh`
- **Method**: `POST`
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Token refreshed",
      "data": {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    }
    ```

### User Profile

#### Get User Profile

Retrieves the profile information for the current user.

- **URL**: `/auth/profile`
- **Method**: `GET`
- **Authentication**: Required
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "user_id": "user123",
        "email": "user@example.com",
        "name": "John Doe",
        "role": "viewer",
        "created_at": "2025-04-30T00:00:00Z"
      }
    }
    ```

### Websites

#### Get All Websites

Retrieves a list of websites belonging to the current user.

- **URL**: `/website`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `status` (optional): Filter by website status (draft, published)
  - `sort` (optional): Sort by created_at, title (asc, desc)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": [
        {
          "website_id": "website123",
          "title": "My Restaurant Website",
          "status": "published",
          "created_at": "2025-04-30T00:00:00Z",
          "updated_at": "2025-04-30T00:00:00Z"
        },
        {
          "website_id": "website456",
          "title": "My Shop Website",
          "status": "draft",
          "created_at": "2025-04-29T00:00:00Z",
          "updated_at": "2025-04-29T00:00:00Z"
        }
      ]
    }
    ```

#### Create Website

Creates a new website.

- **URL**: `/website`
- **Method**: `POST`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "title": "My New Website",
    "business_type": "restaurant",
    "industry": "food_service",
    "business_name": "Mountain Fresh Bakery",
    "additional_info": "Artisan bakery specializing in sourdough bread and pastries"
  }
  ```
- **Success Response**:
  - **Code**: 201 CREATED
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Website created successfully",
      "data": {
        "website_id": "website789",
        "title": "My New Website",
        "status": "draft",
        "created_at": "2025-05-01T00:00:00Z"
      }
    }
    ```

#### Get Website by ID

Retrieves a specific website by ID.

- **URL**: `/website/:website_id`
- **Method**: `GET`
- **Authentication**: Required
- **URL Parameters**:
  - `website_id`: ID of the website to retrieve
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "website_id": "website123",
        "title": "My Restaurant Website",
        "content": {
          "hero": {
            "headline": "Delicious Food Made with Love",
            "subheading": "Serving our community since 2010"
          },
          "about": {
            "title": "Our Story",
            "description": "We started as a small family restaurant...",
            "mission": "To provide fresh, locally-sourced meals..."
          },
          "services": [
            {
              "title": "Catering",
              "description": "Let us cater your next event...",
              "icon": "utensils"
            },
            {
              "title": "Private Dining",
              "description": "Book our private room for special occasions...",
              "icon": "glass-cheers"
            }
          ],
          "features": [...],
          "testimonials": [...],
          "contact": {...},
          "colors": {
            "primary": "#4A6FA5",
            "secondary": "#166088",
            "accent": "#4DCCBD",
            "text": "#333333",
            "background": "#FFFFFF"
          }
        },
        "status": "published",
        "template": "restaurant",
        "created_at": "2025-04-30T00:00:00Z",
        "updated_at": "2025-04-30T00:00:00Z"
      }
    }
    ```

#### Update Website

Updates an existing website.

- **URL**: `/website/:website_id/edit`
- **Method**: `PUT`
- **Authentication**: Required
- **URL Parameters**:
  - `website_id`: ID of the website to update
- **Body**:
  ```json
  {
    "title": "Updated Website Title",
    "content": {
      "hero": {
        "headline": "New compelling headline",
        "subheading": "Improved subheading text"
      },
      "colors": {
        "primary": "#3A5795",
        "secondary": "#065078",
        "accent": "#3DCCAD",
        "text": "#222222",
        "background": "#F5F5F5"
      }
    }
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Website updated successfully",
      "data": {
        "website_id": "website123",
        "title": "Updated Website Title",
        "updated_at": "2025-05-01T00:00:00Z"
      }
    }
    ```

#### Delete Website

Deletes a website.

- **URL**: `/website/:website_id`
- **Method**: `DELETE`
- **Authentication**: Required
- **URL Parameters**:
  - `website_id`: ID of the website to delete
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Website deleted successfully"
    }
    ```

#### Update Website Status

Updates the status of a website (publish/unpublish).

- **URL**: `/website/:website_id/status`
- **Method**: `PUT`
- **Authentication**: Required
- **URL Parameters**:
  - `website_id`: ID of the website to update
- **Body**:
  ```json
  {
    "status": "published"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Website status updated to published",
      "data": {
        "website_id": "website123",
        "status": "published",
        "updated_at": "2025-05-01T00:00:00Z"
      }
    }
    ```

#### Regenerate Website Content

Regenerates the content for a website using AI.

- **URL**: `/website/:website_id/regenerate`
- **Method**: `POST`
- **Authentication**: Required
- **URL Parameters**:
  - `website_id`: ID of the website to regenerate content for
- **Body**:
  ```json
  {
    "business_type": "restaurant",
    "industry": "food_service",
    "business_name": "Mountain Fresh Bakery",
    "additional_info": "Updated description with new menu items and services"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Website content regenerated successfully",
      "data": {
        "website_id": "website123",
        "updated_at": "2025-05-01T00:00:00Z"
      }
    }
    ```

### AI Services

#### Generate Website Content

Generates website content based on business information.

- **URL**: `/api/content/generate`
- **Method**: `POST`
- **Authentication**: Required
- **Body**:
  ```json
  {
    "business_type": "cafe",
    "industry": "food_service",
    "business_name": "Morning Brew Cafe",
    "additional_info": "Specialty coffee shop with house-made pastries and local art on display"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "hero": {
          "headline": "Start Your Day with the Perfect Cup",
          "subheading": "Artisan coffee and fresh pastries in a cozy atmosphere"
        },
        "about": {
          "title": "Our Story",
          "description": "Morning Brew Cafe was founded with a simple mission...",
          "mission": "To create a welcoming space where community and coffee meet..."
        },
        "services": [...],
        "features": [...],
        "testimonials": [...],
        "contact": {...}
      }
    }
    ```

#### Generate Color Scheme

Generates a color scheme based on business type and industry.

- **URL**: `/api/colors/generate`
- **Method**: `GET`
- **Authentication**: Required
- **Query Parameters**:
  - `business_type`: Type of business (e.g., restaurant, retail, tech)
  - `industry`: Specific industry (e.g., food_service, clothing, software)
  - `style_preference` (optional): Style preference (e.g., modern, classic, playful)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "colors": {
          "primary": "#5B4B49",
          "secondary": "#A87C6D",
          "accent": "#E6B17E",
          "text": "#2D2926",
          "background": "#FFF8F0"
        },
        "palette_name": "Coffee & Cream"
      }
    }
    ```

### Admin Endpoints

#### Get All Users

Retrieves a list of all users (admin only).

- **URL**: `/admin/users`
- **Method**: `GET`
- **Authentication**: Required (admin role)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": [
        {
          "user_id": "user123",
          "email": "user@example.com",
          "name": "John Doe",
          "role": "viewer",
          "created_at": "2025-04-30T00:00:00Z"
        },
        {
          "user_id": "user456",
          "email": "editor@example.com",
          "name": "Jane Smith",
          "role": "editor",
          "created_at": "2025-04-29T00:00:00Z"
        }
      ]
    }
    ```

#### Update User Role

Updates a user's role (admin only).

- **URL**: `/admin/users/:user_id/role`
- **Method**: `PUT`
- **Authentication**: Required (admin role)
- **URL Parameters**:
  - `user_id`: ID of the user to update
- **Body**:
  ```json
  {
    "role_id": "editor"
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "User role updated successfully",
      "data": {
        "user_id": "user123",
        "role": "editor"
      }
    }
    ```

#### Get All Roles

Retrieves a list of all roles (admin only).

- **URL**: `/admin/roles`
- **Method**: `GET`
- **Authentication**: Required (admin role)
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": [
        {
          "role_id": "admin",
          "name": "Administrator",
          "description": "Full access to all features",
          "permissions": [
            "manage_users",
            "manage_roles",
            "manage_websites",
            "create_website",
            "edit_website",
            "delete_website",
            "view_website"
          ]
        },
        {
          "role_id": "editor",
          "name": "Editor",
          "description": "Can create and edit websites",
          "permissions": [
            "create_website",
            "edit_website",
            "delete_website",
            "view_website"
          ]
        },
        {
          "role_id": "viewer",
          "name": "Viewer",
          "description": "Can only view websites",
          "permissions": ["view_website"]
        }
      ]
    }
    ```

#### Update Role

Updates a role's permissions (admin only).

- **URL**: `/admin/roles/:role_id`
- **Method**: `PUT`
- **Authentication**: Required (admin role)
- **URL Parameters**:
  - `role_id`: ID of the role to update
- **Body**:
  ```json
  {
    "name": "Content Editor",
    "description": "Can create and edit website content",
    "permissions": ["create_website", "edit_website", "view_website"]
  }
  ```
- **Success Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "message": "Role updated successfully",
      "data": {
        "role_id": "editor",
        "name": "Content Editor",
        "description": "Can create and edit website content",
        "permissions": ["create_website", "edit_website", "view_website"]
      }
    }
    ```

## Postman Collection

You can import the Postman collection file (`AI-Website-Builder-API.postman_collection.json`) that is included with this documentation to quickly test the API endpoints.
