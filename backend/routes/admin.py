from flask import Blueprint, jsonify
from models.models import Ticket, User, ChatLog
from models.db import db
from sqlalchemy import func
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/stats', methods=['GET'])
def stats():
    total    = Ticket.query.count()
    resolved = Ticket.query.filter_by(status='Resolved').count()
    pending  = Ticket.query.filter_by(status='Open').count()
    chatbot  = ChatLog.query.count()
    return jsonify({
        'total_tickets': total,
        'resolved': resolved,
        'pending': pending,
        'avg_response': '28m',
        'sla_compliance': '94%',
        'chatbot_resolved': chatbot,
    }), 200

@admin_bp.route('/agents', methods=['GET'])
def agents():
    # In production this would query an Agent model
    return jsonify([
        {'name': 'Alex Chen',  'initials': 'AC', 'resolved': 52, 'avg_time': '24 min', 'rating': 4.8},
        {'name': 'Sarah Kim',  'initials': 'SK', 'resolved': 48, 'avg_time': '31 min', 'rating': 4.6},
        {'name': 'Mike Torres','initials': 'MT', 'resolved': 45, 'avg_time': '28 min', 'rating': 4.7},
        {'name': 'Priya Patel','initials': 'PP', 'resolved': 38, 'avg_time': '22 min', 'rating': 4.9},
    ]), 200

@admin_bp.route('/activity', methods=['GET'])
def activity():
    tickets = Ticket.query.order_by(Ticket.updated_at.desc()).limit(5).all()
    result = []
    for t in tickets:
        result.append({
            'title': f'Ticket {t.status.lower()}',
            'tid': t.ticket_id,
            'time': t.updated_at.strftime('%I:%M %p') if t.updated_at else 'Now'
        })
    return jsonify(result), 200

@admin_bp.route('/chart-data', methods=['GET'])
def chart_data():
    # Generate last 6 months data using actual tickets
    months = []
    bar_chart = []
    line_chart = []
    
    for i in range(5, -1, -1):
        start_date = datetime.utcnow() - timedelta(days=30*(i+1))
        end_date = datetime.utcnow() - timedelta(days=30*i)
        
        raised = Ticket.query.filter(Ticket.created_at >= start_date, Ticket.created_at < end_date).count()
        resolved = Ticket.query.filter(Ticket.created_at >= start_date, Ticket.created_at < end_date, Ticket.status == 'Resolved').count()
        
        m_name = end_date.strftime('%b')
        sla = 100 if raised == 0 else int((resolved / raised) * 100)
        
        bar_chart.append({'month': m_name, 'Raised': raised, 'Resolved': resolved})
        line_chart.append({'month': m_name, 'SLA': sla})
        
    return jsonify({
        'bar_chart': bar_chart,
        'line_chart': line_chart,
    }), 200
