from flask import Blueprint, request, jsonify
from ml_model.classifier import classifier

ml_bp = Blueprint('ml', __name__)

@ml_bp.route('/classify', methods=['POST'])
def classify():
    data = request.get_json()
    if not data or not data.get('description'):
        return jsonify({'error': 'Description required'}), 400
    result = classifier.predict(
        title=data.get('title', ''),
        description=data['description']
    )
    return jsonify(result), 200

@ml_bp.route('/retrain', methods=['POST'])
def retrain():
    classifier.train()
    return jsonify({'message': 'Model retrained successfully'}), 200
