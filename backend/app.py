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
        import socket
        
        host = Config.MYSQL_HOST
        port = int(Config.MYSQL_PORT)
        
        diagnostic_msg = ""
        try:
            # 1. Standard raw socket connection
            s = socket.create_connection((host, port), timeout=5)
            # Try to read some bytes
            initial_bytes = b""
            try:
                initial_bytes = s.recv(50)
            except Exception as read_err:
                diagnostic_msg += f"Read Error: {read_err}. "
            s.close()
            
            diagnostic_msg += f"Raw Socket: Connected! Handshake Hex: {initial_bytes.hex()} (ASCII: {repr(initial_bytes)}). "
        except Exception as conn_err:
            diagnostic_msg += f"Raw Socket Connection Failed: {conn_err}. "
            
        return f"Diagnostics: {diagnostic_msg}"

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
