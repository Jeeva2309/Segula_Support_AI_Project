import os
from datetime import timedelta

class Config:
    # ─── Database ─────────────────────────────────────────
    # Local MySQL fallback
    # Supabase: get from Supabase dashboard → Settings → Database → Connection string
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'mysql+pymysql://supportai_user:supportai_pass123@localhost/supportai_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ─── JWT ──────────────────────────────────────────────
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-super-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # ─── General ──────────────────────────────────────────
    SECRET_KEY = os.getenv('SECRET_KEY', 'another-secret-key')
    DEBUG = os.getenv('FLASK_DEBUG', 'True') == 'True'
