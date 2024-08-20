import secrets
from datetime import datetime, timedelta

from . import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(164), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    verification_code = db.Column(db.String(6), nullable=True)
    reset_code = db.Column(db.String(6), nullable=True)
    reset_code_expiration = db.Column(db.DateTime, nullable=True)

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.set_password(password)
        self.generate_verification_code()

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def generate_verification_code(self):
        self.verification_code = f"{secrets.randbelow(1000000):06d}"

    def verify_email(self, code):
        if self.verification_code == code:
            self.is_verified = True
            self.verification_code = None
            return True

        return False

    def generate_reset_code(self):
        self.reset_code = f"{secrets.randbelow(1000000):06d}"
        self.reset_code_expiration = datetime.now() + timedelta(hours=1)  # Code expires in 1 hour

    def verify_reset_code(self, code):
        if self.reset_code == code and datetime.now() <= self.reset_code_expiration:
            return True
        return False

    def reset_password(self, new_password):
        self.set_password(new_password)
        self.reset_code = None
        self.reset_code_expiration = None
