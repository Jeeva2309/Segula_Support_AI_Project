from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import db
from models.models import Ticket, User

tickets_bp = Blueprint('tickets', __name__)

def generate_ticket_id():
    last = Ticket.query.order_by(Ticket.id.desc()).first()
    num = (last.id + 1) if last else 1
    return f'TKT-{num:03d}'

@tickets_bp.route('', methods=['GET', 'POST'], strict_slashes=False)
@jwt_required()
def handle_tickets():
    user_id = get_jwt_identity()
    
    if request.method == 'GET':
        user = User.query.get(user_id)
        if user and user.role == 'admin':
            tickets = Ticket.query.order_by(Ticket.created_at.desc()).all()
        else:
            tickets = Ticket.query.filter_by(user_id=user_id).order_by(Ticket.created_at.desc()).all()
        return jsonify([t.to_dict() for t in tickets]), 200
        
    if request.method == 'POST':
        data = request.get_json()
        if not data or not data.get('title') or not data.get('description'):
            return jsonify({'error': 'Title and description required'}), 400
        t = Ticket(
            ticket_id=generate_ticket_id(),
            title=data['title'],
            description=data['description'],
            category=data.get('category', 'Other'),
            priority=data.get('priority', 'Medium'),
            status='Open',
            user_id=user_id,
        )
        db.session.add(t)
        db.session.commit()
        return jsonify(t.to_dict()), 201

@tickets_bp.route('/<int:ticket_id>', methods=['GET'])
def get_ticket(ticket_id):
    t = Ticket.query.get_or_404(ticket_id)
    return jsonify(t.to_dict()), 200

@tickets_bp.route('/<int:ticket_id>', methods=['PUT'])
def update_ticket(ticket_id):
    t = Ticket.query.get_or_404(ticket_id)
    data = request.get_json()
    for field in ['title', 'description', 'category', 'priority', 'status', 'assigned_to']:
        if field in data:
            setattr(t, field, data[field])
    db.session.commit()
    return jsonify(t.to_dict()), 200

@tickets_bp.route('/<int:ticket_id>', methods=['DELETE'])
def delete_ticket(ticket_id):
    t = Ticket.query.get_or_404(ticket_id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({'message': 'Deleted'}), 200
