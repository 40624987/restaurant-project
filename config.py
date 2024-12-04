class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///restaurant.db'  # SQLite for simplicity
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your_secret_key'
