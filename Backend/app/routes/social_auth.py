from flask import Blueprint, request, jsonify, redirect, current_app, url_for
import requests
from authlib.integrations.flask_client import OAuth
import datetime
import jwt
from bson.objectid import ObjectId
import json
from urllib.parse import quote

social_auth_bp = Blueprint('social_auth', __name__)
oauth = OAuth()

def init_oauth(app):
    oauth.init_app(app)
    
    # Google OAuth
    oauth.register(
        name='google',
        client_id=app.config['GOOGLE_CLIENT_ID'],
        client_secret=app.config['GOOGLE_CLIENT_SECRET'],
        access_token_url='https://oauth2.googleapis.com/token',
        access_token_params=None,
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        authorize_params={'prompt': 'consent'},  # FIXED: Add prompt parameter
        api_base_url='https://www.googleapis.com/oauth2/v1/',
        client_kwargs={'scope': 'email profile'},
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration'
    )
    
    # GitHub OAuth
    oauth.register(
        name='github',
        client_id=app.config['GITHUB_CLIENT_ID'],
        client_secret=app.config['GITHUB_CLIENT_SECRET'],
        access_token_url='https://github.com/login/oauth/access_token',
        access_token_params=None,
        authorize_url='https://github.com/login/oauth/authorize',
        authorize_params=None,
        api_base_url='https://api.github.com/',
        client_kwargs={'scope': 'user:email'}
    )

@social_auth_bp.route('/google')
def google_login():
    try:
        redirect_uri = url_for('social_auth.google_callback', _external=True)
        return oauth.google.authorize_redirect(redirect_uri)
    except Exception as e:
        return jsonify({'message': f'Google OAuth configuration error: {str(e)}'}), 500

@social_auth_bp.route('/google/callback')
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        if not token:
            return jsonify({'message': 'Google OAuth failed: No token received'}), 400
            
        user_info = oauth.google.get('userinfo').json()
        
        # Check if user exists
        user = current_app.db.users.find_one({'email': user_info['email']})
        
        if not user:
            # Create new user
            user = {
                'email': user_info['email'],
                'name': user_info.get('name', user_info.get('email', 'User')),
                'google_id': user_info['id'],
                'email_verified': True,
                'created_at': datetime.datetime.utcnow(),
                'updated_at': datetime.datetime.utcnow()
            }
            result = current_app.db.users.insert_one(user)
            user_id = str(result.inserted_id)
        else:
            user_id = str(user['_id'])
            
        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        # Redirect to frontend with token and user data
        frontend_url = current_app.config['CLIENT_URL']
        user_data = {
            'id': user_id,
            'email': user_info['email'],
            'name': user_info.get('name', user_info.get('email', 'User'))
        }
        user_data_encoded = quote(json.dumps(user_data))
        return redirect(f"{frontend_url}/auth/success?token={token}&user={user_data_encoded}")
        
    except Exception as e:
        print(f"Google OAuth error: {str(e)}")
        return jsonify({'message': 'Google authentication failed'}), 500

@social_auth_bp.route('/github')
def github_login():
    try:
        redirect_uri = url_for('social_auth.github_callback', _external=True)
        return oauth.github.authorize_redirect(redirect_uri)
    except Exception as e:
        return jsonify({'message': f'GitHub OAuth configuration error: {str(e)}'}), 500

@social_auth_bp.route('/github/callback')
def github_callback():
    try:
        token = oauth.github.authorize_access_token()
        if not token:
            return jsonify({'message': 'GitHub OAuth failed: No token received'}), 400
            
        # Get user info
        user_info_response = oauth.github.get('user')
        if user_info_response.status_code != 200:
            return jsonify({'message': 'Failed to fetch user info from GitHub'}), 400
            
        user_info = user_info_response.json()
        
        # For GitHub, we need to get email separately
        emails_response = oauth.github.get('user/emails')
        emails = []
        if emails_response.status_code == 200:
            emails = emails_response.json()
        
        # Try to find a verified email
        primary_email = None
        for email in emails:
            if email.get('primary') and email.get('verified'):
                primary_email = email['email']
                break
        
        # If no primary verified email, try any verified email
        if not primary_email:
            for email in emails:
                if email.get('verified'):
                    primary_email = email['email']
                    break
        
        # If still no email, check if we have a public email in user info
        if not primary_email and user_info.get('email'):
            primary_email = user_info['email']
        
        if not primary_email:
            return jsonify({'message': 'Could not retrieve verified email from GitHub. Please make sure your email is public or verified on GitHub.'}), 400
            
        # Check if user exists by GitHub ID or email
        user = current_app.db.users.find_one({
            '$or': [
                {'github_id': user_info['id']},
                {'email': primary_email}
            ]
        })
        
        if not user:
            # Create new user
            user = {
                'email': primary_email,
                'name': user_info.get('name', user_info.get('login', primary_email)),
                'github_id': user_info['id'],
                'email_verified': True,
                'created_at': datetime.datetime.utcnow(),
                'updated_at': datetime.datetime.utcnow()
            }
            result = current_app.db.users.insert_one(user)
            user_id = str(result.inserted_id)
        else:
            # Update existing user with GitHub ID if not already set
            if 'github_id' not in user:
                current_app.db.users.update_one(
                    {'_id': user['_id']},
                    {'$set': {'github_id': user_info['id']}}
                )
            user_id = str(user['_id'])
            
        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        # Redirect to frontend with token and user data
        frontend_url = current_app.config['CLIENT_URL']
        user_data = {
            'id': user_id,
            'email': primary_email,
            'name': user_info.get('name', user_info.get('login', primary_email))
        }
        user_data_encoded = quote(json.dumps(user_data))
        return redirect(f"{frontend_url}/auth/success?token={token}&user={user_data_encoded}")
        
    except Exception as e:
        print(f"GitHub OAuth error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'GitHub authentication failed'}), 500