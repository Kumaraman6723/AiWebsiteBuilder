import os
import json
import logging
from openai import OpenAI
import config

# Initialize OpenAI client
openai = OpenAI(api_key=config.OPENAI_API_KEY)

def generate_website_content(business_type, industry, business_name=None, additional_info=None):
    """
    Generate website content using OpenAI GPT
    
    Args:
        business_type (str): Type of business (e.g., restaurant, retail)
        industry (str): Industry of the business
        business_name (str, optional): Name of the business
        additional_info (str, optional): Additional information about the business
        
    Returns:
        dict: JSON structure with website content
    """
    try:
        # Create prompt
        prompt = f"""
        Generate comprehensive website content for a {business_type} in the {industry} industry.
        
        {f"Business name: {business_name}" if business_name else ""}
        {f"Additional information: {additional_info}" if additional_info else ""}
        
        Generate content for the following sections:
        1. Hero section - attractive headline and subheading
        2. About section - company description and mission
        3. Services - list of 3-5 services with descriptions
        4. Features - list of key features or unique selling points
        5. Testimonials - 2-3 realistic testimonials
        6. Contact information - placeholder for contact details
        
        Respond with JSON in this format:
        {{
            "hero": {{
                "headline": "Main headline text",
                "subheading": "Supporting text"
            }},
            "about": {{
                "title": "About Us",
                "description": "Company description",
                "mission": "Mission statement"
            }},
            "services": [
                {{
                    "title": "Service 1",
                    "description": "Service description",
                    "icon": "suggested icon name"
                }}
            ],
            "features": [
                {{
                    "title": "Feature 1",
                    "description": "Feature description"
                }}
            ],
            "testimonials": [
                {{
                    "quote": "Testimonial text",
                    "author": "Author name",
                    "position": "Author position/company"
                }}
            ],
            "contact": {{
                "title": "Contact Us",
                "message": "Contact message"
            }}
        }}
        """
        
        # Call OpenAI API
        # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
        # do not change this unless explicitly requested by the user
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional website content creator. Create engaging and professional content for business websites."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        
        # Parse JSON response
        content = json.loads(response.choices[0].message.content)
        
        # Return the generated content
        return content
        
    except Exception as e:
        logging.error(f"Error generating website content: {str(e)}")
        raise Exception(f"Failed to generate website content: {str(e)}")

def suggest_color_scheme(business_type, industry, style_preference=None):
    """
    Suggest a color scheme for the website based on business type and industry
    
    Args:
        business_type (str): Type of business
        industry (str): Industry of the business
        style_preference (str, optional): User's style preference
        
    Returns:
        dict: JSON structure with color scheme
    """
    try:
        # Create prompt
        prompt = f"""
        Suggest a professional color scheme for a {business_type} in the {industry} industry.
        {f"Style preference: {style_preference}" if style_preference else ""}
        
        Provide primary, secondary, accent, text, and background colors as hex codes.
        
        Respond with JSON in this format:
        {{
            "primary": "#hexcode",
            "secondary": "#hexcode",
            "accent": "#hexcode",
            "text": "#hexcode",
            "background": "#hexcode"
        }}
        """
        
        # Call OpenAI API
        # the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
        # do not change this unless explicitly requested by the user
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a professional web designer. Suggest appropriate color schemes for business websites."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"}
        )
        
        # Parse JSON response
        colors = json.loads(response.choices[0].message.content)
        
        # Return the color scheme
        return colors
        
    except Exception as e:
        logging.error(f"Error generating color scheme: {str(e)}")
        raise Exception(f"Failed to generate color scheme: {str(e)}")
