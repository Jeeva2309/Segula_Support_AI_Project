import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MySQL Database Configuration
    MYSQL_USER = os.getenv('MYSQL_USER', 'avnadmin')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_HOST = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT = os.getenv('MYSQL_PORT', '3306')
    MYSQL_DB = os.getenv('MYSQL_DB', 'defaultdb')

    # Encode password for URL safety
    import urllib.parse
    MYSQL_PASSWORD_ENCODED = urllib.parse.quote_plus(MYSQL_PASSWORD)

    # SQLAlchemy connection URI (MySQL)
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD_ENCODED}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )

    # No SSL options needed for standard MySQL deployment
    SQLALCHEMY_ENGINE_OPTIONS = {}
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # General Flask config
    SECRET_KEY = os.getenv('SECRET_KEY', 'supportai123')
    DEBUG = os.getenv('FLASK_DEBUG', 'False') == 'True'
