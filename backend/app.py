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
    try:
        with app.app_context():
            db.create_all()
        print("Database tables created or verified successfully.")
    except Exception as e:
        print(f"Warning: Could not connect to database to create tables: {e}")

    @app.route('/')
    def home():
        return 'SupportAI Backend Running'

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'SupportAI Backend Running'}

    @app.route('/testdb')
    def testdb():
        from config.config import Config
        import os
        exists = os.path.exists(Config.CA_PATH)
        
        # Check if using Aiven password or Segula@123
        pw = Config.MYSQL_PASSWORD
        is_segula_pw = (pw == "Segula@123")
        is_aiven_pw = (pw.startswith("AVNS_") if pw else False)
        pw_len = len(pw) if pw else 0
        
        details = (
            f"Host: {Config.MYSQL_HOST}, "
            f"Port: {Config.MYSQL_PORT}, "
            f"User: {Config.MYSQL_USER}, "
            f"DB: {Config.MYSQL_DB}, "
            f"Password Length: {pw_len}, "
            f"Is Aiven PW: {is_aiven_pw}, "
            f"Is Segula PW: {is_segula_pw}"
        )
        try:
            with db.engine.connect() as conn:
                conn.execute(db.text('SELECT 1'))
            return f'Database Connected Successfully ✅ (Cert exists: {exists}). Connection: {details}'
        except Exception as e:
            return f'Database Connection Failed ❌ (Cert exists: {exists}, path: {Config.CA_PATH}). Config details: {details}. Error: {str(e)}'

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
