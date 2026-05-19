import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ─── Aiven MySQL Database ──────────────────────────────
    MYSQL_USER     = os.getenv('MYSQL_USER', 'avnadmin')
    MYSQL_PASSWORD = os.getenv('MYSQL_PASSWORD', '')
    MYSQL_HOST     = os.getenv('MYSQL_HOST', 'localhost')
    MYSQL_PORT     = os.getenv('MYSQL_PORT', '3306')
    MYSQL_DB       = os.getenv('MYSQL_DB', 'defaultdb')

    import urllib.parse
    MYSQL_PASSWORD_ENCODED = urllib.parse.quote_plus(MYSQL_PASSWORD)

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD_ENCODED}"
        f"@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    )
    # Dynamic absolute path to ca.pem
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    CA_PATH = os.path.join(BASE_DIR, 'ca.pem')

    SQLALCHEMY_ENGINE_OPTIONS = {
        "connect_args": {
            "ssl_ca": CA_PATH
        }
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ─── JWT ──────────────────────────────────────────────
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # ─── General ──────────────────────────────────────────
    SECRET_KEY = os.getenv('SECRET_KEY', 'supportai123')
    DEBUG = os.getenv('FLASK_DEBUG', 'False') == 'True'
