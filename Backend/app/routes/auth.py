from flask import Blueprint, request, jsonify, current_app
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import pyotp
import base64
from app.utils.mail import send_email
from app.utils.decorators import token_required
from bson.objectid import ObjectId
import json

auth_bp = Blueprint('auth', __name__)
@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')
        
        if not email or not password or not name:
            return jsonify({'message': 'Missing required fields'}), 400
            
        # Check if user already exists
        existing_user = current_app.db.users.find_one({'email': email})
        if existing_user:
            print(f"User already exists: {email}")
            # Check if user has a password (social login users might exist without password)
            if 'password' in existing_user:
                return jsonify({'message': 'User already exists'}), 409
            else:
                # Update existing social login user with password
                hashed_password = generate_password_hash(password)
                current_app.db.users.update_one(
                    {'email': email},
                    {'$set': {
                        'password': hashed_password,
                        'name': name,
                        'updated_at': datetime.datetime.utcnow()
                    }}
                )
                user_id = str(existing_user['_id'])
                print(f"Updated social user with password: {email}")
        else:
            # Hash password
            hashed_password = generate_password_hash(password)
            print(f"Password hashed for: {email}")
            
            # Generate OTP secret
            otp_secret = base64.b32encode(pyotp.random_base32().encode()).decode('utf-8')
            
            # Create user
            user = {
                'email': email,
                'password': hashed_password,
                'name': name,
                'otp_secret': otp_secret,
                'email_verified': False,
                'created_at': datetime.datetime.utcnow(),
                'updated_at': datetime.datetime.utcnow()
            }
            
            result = current_app.db.users.insert_one(user)
            user_id = str(result.inserted_id)
            print(f"New user created: {email}")
            
            # Generate OTP
            totp = pyotp.TOTP(otp_secret, digits=6, interval=300)
            otp_code = totp.now()

            # Send OTP email
            html_content = f""" <!DOCTYPE html> <html> <head> <meta charset="utf-8"> <style> body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }} .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }} .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; }} .content {{ background: #f9f9f9; padding: 20px; }} .otp-code {{ font-size: 32px; font-weight: bold; text-align: center; letter-spacing: 5px; color: #667eea; margin: 20px 0; }} .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }} </style> </head> <body> <div class="container"> <div class="header"> <h1>AuthMaster</h1> </div> <div class="content"> <h2>Verify Your Email Address</h2> <p>Hello {name},</p> <p>Thank you for signing up with AuthMaster. Please use the following verification code to complete your registration:</p> <div class="otp-code">{otp_code}</div> <p>This code will expire in 5 minutes.</p> <p>If you didn't create an account with AuthMaster, please ignore this email.</p> </div> <div class="footer"> <p>&copy; {datetime.datetime.now().year} AuthMaster. All rights reserved.</p> </div> </div> </body> </html> """
            
            # Send the email
            email_sent = send_email(
                recipient=email,
                subject='Verify Your Email - AuthMaster',
                body=f'Your OTP code is: {otp_code}. This code will expire in 5 minutes.',
                html_body=html_content
            )
            
            if not email_sent:
                return jsonify({'message': 'Failed to send verification email'}), 500

        return jsonify({
            'message': 'User created successfully. Please verify your email.',
            'email': email
        }), 201
        
    except Exception as e:
        print(f"Signup error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        email = data.get('email')
        otp = data.get('otp')
        
        if not email or not otp:
            return jsonify({'message': 'Email and OTP are required'}), 400
        
        user = current_app.db.users.find_one({'email': email})
        if not user:
            return jsonify({'message': 'User not found'}), 404
            
        # Check if OTP is valid
        totp = pyotp.TOTP(user['otp_secret'], digits=6, interval=300)
        if totp.verify(otp):
            current_app.db.users.update_one(
                {'_id': user['_id']},
                {'$set': {'email_verified': True}}
            )
            
            # Generate JWT token after successful verification
            token = jwt.encode({
                'user_id': str(user['_id']),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, current_app.config['SECRET_KEY'], algorithm='HS256')
            
            return jsonify({
                'message': 'Email verified successfully',
                'token': token,
                'user': {
                    'id': str(user['_id']),
                    'email': user['email'],
                    'name': user.get('name', '')
                }
            }), 200
        else:
            return jsonify({'message': 'Invalid OTP'}), 400
            
    except Exception as e:
        print(f"Verify OTP error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500
    
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'message': 'Email and password are required'}), 400
        
        user = current_app.db.users.find_one({'email': email})
        if not user:
            return jsonify({'message': 'Invalid credentials'}), 401
        
        # Check if user has a password (social login users might not have one)
        if 'password' not in user:
            return jsonify({'message': 'Invalid credentials'}), 401
            
        if not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401
            
        if not user.get('email_verified', False):
            return jsonify({'message': 'Please verify your email first'}), 401
            
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'name': user.get('name', '')
            }
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # Add this for debugging
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        email = data.get('email')
        
        if not email:
            return jsonify({'message': 'Email is required'}), 400
        
        user = current_app.db.users.find_one({'email': email})
        if not user:
            # Still return success to prevent email enumeration
            return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
            
        # Generate reset token
        reset_token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        # Save reset token to database
        current_app.db.users.update_one(
            {'_id': user['_id']},
            {'$set': {'reset_token': reset_token}}
        )
        
        # Create password reset email
        reset_link = f"{current_app.config['CLIENT_URL']}/reset-password?token={reset_token}"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white; }}
                .content {{ background: #f9f9f9; padding: 20px; }}
                .button {{ display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 4px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>AuthMaster</h1>
                </div>
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>Hello {user.get('name', 'User')},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <p style="text-align: center;">
                        <a href="{reset_link}" class="button">Reset Password</a>
                    </p>
                    <p>If you didn't request a password reset, please ignore this email. This link will expire in 1 hour.</p>
                </div>
                <div class="footer">
                    <p>&copy; {datetime.datetime.now().year} AuthMaster. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Send reset email
        email_sent = send_email(
            recipient=email,
            subject='Password Reset Request - AuthMaster',
            body=f'Click the link to reset your password: {reset_link}',
            html_body=html_content
        )
        
        if not email_sent:
            return jsonify({'message': 'Failed to send reset email'}), 500
        
        return jsonify({'message': 'If the email exists, a reset link has been sent'}), 200
        
    except Exception as e:
        print(f"Forgot password error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'No data provided'}), 400
            
        token = data.get('token')
        password = data.get('password')
        
        if not token or not password:
            return jsonify({'message': 'Token and password are required'}), 400
        
        # Verify token
        try:
            payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Expired token'}), 400
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 400
            
        # Convert user_id string to ObjectId
        user = current_app.db.users.find_one({'_id': ObjectId(user_id), 'reset_token': token})
        if not user:
            return jsonify({'message': 'Invalid or expired token'}), 400
            
        # Update password
        hashed_password = generate_password_hash(password)
        current_app.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {
                'password': hashed_password,
                'reset_token': None
            }}
        )
        
        return jsonify({'message': 'Password reset successfully'}), 200
        
    except Exception as e:
        print(f"Reset password error: {str(e)}")
        return jsonify({'message': 'Internal server error'}), 500

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'user': {
            'id': str(current_user['_id']),
            'email': current_user['email'],
            'name': current_user.get('name', '')
        }
    }), 200