from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, date
from app.extensions import db
from app.models import KPIDefinition, KPIValue, KPIJustification, RootCause, User
from app.utils.security import calculate_variance, classify_root_cause

bp = Blueprint('kpi', __name__, url_prefix='/kpi')

# KPI Definitions
@bp.route('/create-definition', methods=['POST'])
@jwt_required()
def create_kpi_definition():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('project_id'):
        return jsonify({'error': 'KPI name and project_id required'}), 400
    
    kpi = KPIDefinition(
        project_id=data['project_id'],
        name=data['name'],
        code=data.get('code'),
        description=data.get('description'),
        target_value=data.get('target_value'),
        unit=data.get('unit', 'count'),
        direction=data.get('direction', 'higher')
    )
    db.session.add(kpi)
    db.session.commit()
    
    return jsonify({
        'message': 'KPI definition created successfully',
        'kpi': kpi.to_dict()
    }), 201

@bp.route('/definitions/project/<int:project_id>', methods=['GET'])
@jwt_required()
def get_kpi_definitions(project_id):
    kpis = KPIDefinition.query.filter_by(project_id=project_id).all()
    return jsonify({'kpis': [k.to_dict() for k in kpis]}), 200

# KPI Values
@bp.route('/ingest-value', methods=['POST'])
@jwt_required()
def ingest_kpi_value():
    data = request.get_json()
    
    required = ['project_id', 'kpi_id', 'date', 'actual_value']
    if not all(k in data for k in required):
        return jsonify({'error': 'project_id, kpi_id, date, and actual_value required'}), 400
    
    kpi_def = KPIDefinition.query.get(data['kpi_id'])
    if not kpi_def:
        return jsonify({'error': 'KPI definition not found'}), 404
    
    target = data.get('target_value', kpi_def.target_value)
    actual = data['actual_value']
    variance = calculate_variance(actual, target)
    
    kpi_value = KPIValue(
        project_id=data['project_id'],
        kpi_id=data['kpi_id'],
        date=datetime.strptime(data['date'], '%Y-%m-%d').date() if isinstance(data['date'], str) else data['date'],
        actual_value=actual,
        target_value=target,
        variance=variance
    )
    db.session.add(kpi_value)
    db.session.commit()
    
    return jsonify({
        'message': 'KPI value ingested successfully',
        'kpi_value': kpi_value.to_dict()
    }), 201

@bp.route('/project/<int:project_id>', methods=['GET'])
@jwt_required()
def get_kpi_values(project_id):
    kpi_values = KPIValue.query.filter_by(project_id=project_id).order_by(KPIValue.date.desc()).all()
    return jsonify({'kpi_values': [v.to_dict() for v in kpi_values]}), 200

@bp.route('/values/<int:kpi_id>/dates', methods=['GET'])
@jwt_required()
def get_kpi_values_by_date_range(kpi_id):
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    query = KPIValue.query.filter_by(kpi_id=kpi_id)
    
    if start_date:
        query = query.filter(KPIValue.date >= datetime.strptime(start_date, '%Y-%m-%d').date())
    if end_date:
        query = query.filter(KPIValue.date <= datetime.strptime(end_date, '%Y-%m-%d').date())
    
    values = query.order_by(KPIValue.date.desc()).all()
    return jsonify({'kpi_values': [v.to_dict() for v in values]}), 200

# Justifications
@bp.route('/justify', methods=['POST'])
@jwt_required()
def create_justification():
    data = request.get_json()
    user_id = int(get_jwt_identity())
    
    if not data or not data.get('kpi_value_id'):
        return jsonify({'error': 'kpi_value_id required'}), 400
    
    root_cat, root_sub = classify_root_cause(data.get('comment', ''))
    
    justification = KPIJustification(
        kpi_value_id=data['kpi_value_id'],
        user_id=user_id,
        comment=data.get('comment'),
        root_cause_category=data.get('root_cause_category', root_cat),
        root_cause_subcategory=data.get('root_cause_subcategory', root_sub),
        action_plan=data.get('action_plan'),
        status=data.get('status', 'draft')
    )
    db.session.add(justification)
    db.session.commit()
    
    return jsonify({
        'message': 'Justification created successfully',
        'justification': justification.to_dict()
    }), 201

@bp.route('/justifications/<int:project_id>', methods=['GET'])
@jwt_required()
def get_justifications(project_id):
    justifications = db.session.query(KPIJustification).join(KPIValue).filter(
        KPIValue.project_id == project_id
    ).order_by(KPIJustification.created_at.desc()).all()
    
    return jsonify({'justifications': [j.to_dict() for j in justifications]}), 200

@bp.route('/justifications/<int:justification_id>', methods=['PUT'])
@jwt_required()
def update_justification(justification_id):
    justification = KPIJustification.query.get(justification_id)
    
    if not justification:
        return jsonify({'error': 'Justification not found'}), 404
    
    data = request.get_json()
    if data.get('comment'):
        justification.comment = data['comment']
    if data.get('root_cause_category'):
        justification.root_cause_category = data['root_cause_category']
    if data.get('root_cause_subcategory'):
        justification.root_cause_subcategory = data['root_cause_subcategory']
    if data.get('action_plan'):
        justification.action_plan = data['action_plan']
    if data.get('status'):
        justification.status = data['status']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Justification updated successfully',
        'justification': justification.to_dict()
    }), 200

# Root Causes
@bp.route('/root-cause/create', methods=['POST'])
@jwt_required()
def create_root_cause():
    data = request.get_json()
    
    if not data or not data.get('project_id') or not data.get('category'):
        return jsonify({'error': 'project_id and category required'}), 400
    
    root_cause = RootCause(
        project_id=data['project_id'],
        category=data['category'],
        subcategory=data.get('subcategory'),
        description=data.get('description')
    )
    db.session.add(root_cause)
    db.session.commit()
    
    return jsonify({
        'message': 'Root cause created successfully',
        'root_cause': root_cause.to_dict()
    }), 201

@bp.route('/root-cause/project/<int:project_id>', methods=['GET'])
@jwt_required()
def get_root_causes(project_id):
    root_causes = RootCause.query.filter_by(project_id=project_id).all()
    return jsonify({'root_causes': [r.to_dict() for r in root_causes]}), 200