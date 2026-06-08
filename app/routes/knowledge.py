from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models import OperationalInsight

bp = Blueprint('knowledge', __name__, url_prefix='/knowledge')

@bp.route('/insights', methods=['POST'])
@jwt_required()
def create_insight():
    data = request.get_json()
    
    if not data or not data.get('project_id'):
        return jsonify({'error': 'project_id required'}), 400
    
    insight = OperationalInsight(
        project_id=data['project_id'],
        kpi_name=data.get('kpi_name'),
        root_cause=data.get('root_cause'),
        root_cause_category=data.get('root_cause_category'),
        comment=data.get('comment'),
        resolution=data.get('resolution'),
        confidence_score=data.get('confidence_score', 0.0),
        source_type=data.get('source_type', 'manual'),
        is_verified=data.get('is_verified', False)
    )
    db.session.add(insight)
    db.session.commit()
    
    return jsonify({
        'message': 'Insight created successfully',
        'insight': insight.to_dict()
    }), 201

@bp.route('/insights/project/<int:project_id>', methods=['GET'])
@jwt_required()
def get_insights(project_id):
    verified_only = request.args.get('verified', 'false').lower() == 'true'
    
    query = OperationalInsight.query.filter_by(project_id=project_id)
    if verified_only:
        query = query.filter_by(is_verified=True)
    
    insights = query.order_by(OperationalInsight.confidence_score.desc()).all()
    return jsonify({'insights': [i.to_dict() for i in insights]}), 200

@bp.route('/insights/<int:insight_id>', methods=['GET'])
@jwt_required()
def get_insight(insight_id):
    insight = OperationalInsight.query.get(insight_id)
    
    if not insight:
        return jsonify({'error': 'Insight not found'}), 404
    
    return jsonify({'insight': insight.to_dict()}), 200

@bp.route('/insights/<int:insight_id>', methods=['PUT'])
@jwt_required()
def update_insight(insight_id):
    insight = OperationalInsight.query.get(insight_id)
    
    if not insight:
        return jsonify({'error': 'Insight not found'}), 404
    
    data = request.get_json()
    for field in ['kpi_name', 'root_cause', 'root_cause_category', 'comment', 'resolution', 'confidence_score', 'is_verified']:
        if field in data:
            setattr(insight, field, data[field])
    
    db.session.commit()
    
    return jsonify({
        'message': 'Insight updated successfully',
        'insight': insight.to_dict()
    }), 200

@bp.route('/insights/search', methods=['GET'])
@jwt_required()
def search_insights():
    query_text = request.args.get('q', '')
    project_id = request.args.get('project_id')
    
    query = OperationalInsight.query
    
    if project_id:
        query = query.filter_by(project_id=int(project_id))
    
    if query_text:
        search = f'%{query_text}%'
        query = query.filter(
            db.or_(
                OperationalInsight.comment.ilike(search),
                OperationalInsight.root_cause.ilike(search),
                OperationalInsight.kpi_name.ilike(search)
            )
        )
    
    insights = query.order_by(OperationalInsight.confidence_score.desc()).all()
    return jsonify({'insights': [i.to_dict() for i in insights]}), 200