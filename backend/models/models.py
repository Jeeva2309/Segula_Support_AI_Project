from models.db import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = 'users'
    id         = db.Column(db.Integer, primary_key=True)
    name       = db.Column(db.String(100), nullable=False)
    email      = db.Column(db.String(120), unique=True, nullable=False)
    password   = db.Column(db.String(256), nullable=False)
    role       = db.Column(db.String(20), default='user')  # 'user' | 'admin'
    department = db.Column(db.String(100), nullable=True)
    joining_date = db.Column(db.String(50), nullable=True)
    dob        = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    tickets    = db.relationship('Ticket', backref='user', lazy=True)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id, 
            'name': self.name, 
            'email': self.email, 
            'role': self.role,
            'department': self.department,
            'joining_date': self.joining_date,
            'dob': self.dob
        }


class Ticket(db.Model):
    __tablename__ = 'tickets'
    id          = db.Column(db.Integer, primary_key=True)
    ticket_id   = db.Column(db.String(20), unique=True)   # e.g. TKT-001
    title       = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category    = db.Column(db.String(50))    # Network | Hardware | Software | Other
    priority    = db.Column(db.String(20))    # High | Medium | Low
    status      = db.Column(db.String(30), default='Open')  # Open | In Progress | Resolved
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    assigned_to = db.Column(db.String(100))
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'ticket_id': self.ticket_id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'priority': self.priority,
            'status': self.status,
            'user_id': self.user_id,
            'assigned_to': self.assigned_to,
            'created_at': self.created_at.strftime('%b %d, %I:%M %p') if self.created_at else None,
        }


class ChatLog(db.Model):
    __tablename__ = 'chat_logs'
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    message    = db.Column(db.Text)
    reply      = db.Column(db.Text)
    intent     = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
