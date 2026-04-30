from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config.config import Config
from models.db import db
from routes.tickets import tickets_bp
from routes.chatbot import chatbot_bp
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.ml import ml_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "https://your-vercel-app.vercel.app"])
    JWTManager(app)
    db.init_app(app)

    # Register Blueprints
    app.register_blueprint(auth_bp,    url_prefix='/api/auth')
    app.register_blueprint(tickets_bp, url_prefix='/api/tickets')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(admin_bp,   url_prefix='/api/admin')
    app.register_blueprint(ml_bp,      url_prefix='/api/ml')

    # Create DB tables
    with app.app_context():
        db.create_all()

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'SupportAI Backend Running'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
