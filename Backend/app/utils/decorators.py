from functools import wraps
from flask import request, jsonify, current_app
import jwt
from bson.objectid import ObjectId

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]
            
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
            
        try:
            # FIXED: Handle JWT decoding properly
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            # Convert user_id string to ObjectId
            current_user = current_app.db.users.find_one({'_id': ObjectId(data['user_id'])})
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        except Exception as e:
            print(f"Token error: {str(e)}")
            return jsonify({'message': 'Token verification failed'}), 401
            
        return f(current_user, *args, **kwargs)
        
    return decorated