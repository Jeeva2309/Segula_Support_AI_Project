import os
from datetime import timedelta
try:
    from dotenv import load_dotenv
except ImportError:
    def load_dotenv():
        pass

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

# LLM configuration
LLM_PROVIDER = os.getenv('LLM_PROVIDER', 'openai')
LLM_API_KEY = os.getenv('OPENAI_API_KEY')
LLM_MODEL = os.getenv('LLM_MODEL', 'gpt-4o')

# Knowledge‑base configuration
KB_EMBEDDING_MODEL = os.getenv('KB_EMBEDDING_MODEL', 'all-MiniLM-L6-v2')
KB_INDEX_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'kb_index.faiss')
KB_DOCS_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'kb_docs.json')

# Conversation context
CONTEXT_TIMEOUT = int(os.getenv('CONTEXT_TIMEOUT', '300'))  # seconds
