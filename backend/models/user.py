from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from enum import Enum
import jwt
from flask import current_app as app

db = SQLAlchemy()

class UserRole(Enum):
    LEARNER = "learner"
    ADMIN = "admin"

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    grade_qualification = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.LEARNER)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == UserRole.ADMIN

    def is_learner(self):
        return self.role == UserRole.LEARNER

    def generate_token(self):
        payload = {
            'user_id': self.id,
            'username': self.username,
            'role': self.role.value,
            'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
        }
        return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')
