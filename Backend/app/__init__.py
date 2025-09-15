from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

mail = Mail()

def create_app():
    app = Flask(__name__)

    # -----------------------------
    # General Configuration
    # -----------------------------
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/authapp')
    app.config['UPLOAD_FOLDER'] = os.getenv('UPLOAD_FOLDER', 'uploads')
    app.config['MAX_FILE_SIZE'] = int(os.getenv('MAX_FILE_SIZE', 100 * 1024 * 1024))  # 100MB default
    app.config['WHISPER_MODEL_SIZE'] = os.getenv('WHISPER_MODEL_SIZE', 'base')

    # -----------------------------
    # Email Configuration
    # -----------------------------
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() in ['true', '1', 't']
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')

    # -----------------------------
    # Social Login Configuration
    # -----------------------------
    app.config['GOOGLE_CLIENT_ID'] = os.getenv('GOOGLE_CLIENT_ID')
    app.config['GOOGLE_CLIENT_SECRET'] = os.getenv('GOOGLE_CLIENT_SECRET')
    app.config['GITHUB_CLIENT_ID'] = os.getenv('GITHUB_CLIENT_ID')
    app.config['GITHUB_CLIENT_SECRET'] = os.getenv('GITHUB_CLIENT_SECRET')
    app.config['CLIENT_URL'] = os.getenv('CLIENT_URL', 'http://localhost:3000')

    # -----------------------------
    # Chatbot Configuration
    # -----------------------------
    app.config['GEMINI_API_KEY'] = os.getenv('GEMINI_API_KEY')

    # -----------------------------
    # Initialize Extensions
    # -----------------------------
    # ⚡ Full open CORS
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
    mail.init_app(app)

    # -----------------------------
    # MongoDB Connection
    # -----------------------------
    try:
        client = MongoClient(app.config['MONGO_URI'])
        client.admin.command('ping')
        app.db = client.get_database()
        print("Connected to MongoDB successfully!")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        raise e

    # -----------------------------
    # Load Whisper Model
    # -----------------------------
    try:
        print("Loading Whisper model...")
        import whisper
        app.whisper_model = whisper.load_model(app.config['WHISPER_MODEL_SIZE'])
        print("Whisper model loaded.")
    except Exception as e:
        print(f"Failed to load Whisper model: {str(e)}")
        raise e

    # -----------------------------
    # Initialize OAuth
    # -----------------------------
    from app.routes.social_auth import init_oauth
    init_oauth(app)

    # -----------------------------
    # Initialize Chatbot Models
    # -----------------------------
    from app.utils.chatbot_utils import init_chatbot_models
    init_chatbot_models(app)

    # -----------------------------
    # Register Blueprints
    # -----------------------------
    from app.routes.auth import auth_bp
    from app.routes.social_auth import social_auth_bp
    from app.routes.chatbot import chatbot_bp
    from app.routes.subtitle import subtitle_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(social_auth_bp, url_prefix='/api/auth')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(subtitle_bp, url_prefix='/api/subtitles')

    return app
