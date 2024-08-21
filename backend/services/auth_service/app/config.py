import os

import dotenv

dotenv.load_dotenv('.env')


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY") or 'you-will-never-guess :)'
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Mail Settings
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or 587)
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", 'true').lower() in ['true', 'on', '1']
    MAIL_USE_SSL = os.environ.get("MAIL_USE_SSL", 'false').lower() in ['true', 'on', '1']
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER")



