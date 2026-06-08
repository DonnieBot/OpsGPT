from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta
from sqlalchemy import func
from app.extensions import db
from app.models import KPIValue, KPIJustification, KPIDefinition, Project

bp = Blueprint('reports', __name__, url_prefix='/reports')

def get_date_range(period, reference_date=None):
    if reference_date is None:
        reference_date = datetime.utcnow().date()
    
    if period == 'daily':
        return reference_date, reference_date
    elif period == 'weekly':
        start = reference_date - timedelta(days=reference_date.weekday())
        end = start + timedelta(days=6)
        return start, end
    elif period == 'monthly':
        start = reference_date.replace(day=1)
        if start.month == 12:
            end = start.replace(year=start.year + 1, month=1)
        else:
            end = start.replace(month=start.month + 1)
        end = end - timedelta(days=1)
        return start, end
    return reference_date, reference_date

@bp.route('/daily/<int:project_id>', methods=['GET'])
@jwt_required()
def daily_report(project_id):
    date_str = request.args.get('date')
    if date_str:
        report_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    else:
        report_date = datetime.utcnow().date()
    
    start_date, end_date = get_date_range('daily', report_date)
    
    kpi_values = db.session.query(
        KPIDefinition.name,
        KPIValue.actual_value,
        KPIValue.target_value,
        KPIValue.variance,
        KPIValue.date
    ).join(
        KPIValue, KPIDefinition.id == KPIValue.kpi_id
    ).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).all()
    
    justifications = db.session.query(KPIJustification).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).all()
    
    root_cause_summary = db.session.query(
        KPIJustification.root_cause_category,
        func.count(KPIJustification.id).label('count')
    ).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).group_by(KPIJustification.root_cause_category).all()
    
    return jsonify({
        'period': 'daily',
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'kpi_summary': [{
            'name': k.name,
            'actual_value': k.actual_value,
            'target_value': k.target_value,
            'variance': k.variance
        } for k in kpi_values],
        'total_justifications': len(justifications),
        'root_cause_summary': [{'category': r.root_cause_category, 'count': r.count} for r in root_cause_summary]
    }), 200

@bp.route('/weekly/<int:project_id>', methods=['GET'])
@jwt_required()
def weekly_report(project_id):
    date_str = request.args.get('date')
    if date_str:
        report_date = datetime.strptime(date_str, '%Y-%m-%d').date()
    else:
        report_date = datetime.utcnow().date()
    
    start_date, end_date = get_date_range('weekly', report_date)
    
    kpi_values = db.session.query(
        KPIDefinition.name,
        KPIDefinition.code,
        func.avg(KPIValue.actual_value).label('avg_actual'),
        func.avg(KPIValue.target_value).label('avg_target'),
        func.avg(KPIValue.variance).label('avg_variance'),
        func.min(KPIValue.variance).label('min_variance'),
        func.max(KPIValue.variance).label('max_variance')
    ).join(
        KPIValue, KPIDefinition.id == KPIValue.kpi_id
    ).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).group_by(KPIDefinition.id, KPIDefinition.name, KPIDefinition.code).all()
    
    justifications = db.session.query(KPIJustification).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).all()
    
    root_cause_summary = db.session.query(
        KPIJustification.root_cause_category,
        func.count(KPIJustification.id).label('count')
    ).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).group_by(KPIJustification.root_cause_category).all()
    
    return jsonify({
        'period': 'weekly',
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'kpi_summary': [{
            'name': k.name,
            'code': k.code,
            'avg_actual': round(k.avg_actual, 2) if k.avg_actual else None,
            'avg_target': round(k.avg_target, 2) if k.avg_target else None,
            'avg_variance': round(k.avg_variance, 2) if k.avg_variance else None,
            'min_variance': round(k.min_variance, 2) if k.min_variance else None,
            'max_variance': round(k.max_variance, 2) if k.max_variance else None
        } for k in kpi_values],
        'total_justifications': len(justifications),
        'root_cause_summary': [{'category': r.root_cause_category, 'count': r.count} for r in root_cause_summary]
    }), 200

@bp.route('/monthly/<int:project_id>', methods=['GET'])
@jwt_required()
def monthly_report(project_id):
    year = request.args.get('year', datetime.utcnow().year, type=int)
    month = request.args.get('month', datetime.utcnow().month, type=int)
    
    start_date = datetime(year, month, 1).date()
    if month == 12:
        end_date = datetime(year + 1, 1, 1).date() - timedelta(days=1)
    else:
        end_date = datetime(year, month + 1, 1).date() - timedelta(days=1)
    
    kpi_values = db.session.query(
        KPIDefinition.name,
        KPIDefinition.code,
        KPIDefinition.direction,
        func.avg(KPIValue.actual_value).label('avg_actual'),
        func.avg(KPIValue.target_value).label('avg_target'),
        func.avg(KPIValue.variance).label('avg_variance'),
        func.min(KPIValue.variance).label('min_variance'),
        func.max(KPIValue.variance).label('max_variance'),
        func.count(KPIValue.id).label('data_points')
    ).join(
        KPIValue, KPIDefinition.id == KPIValue.kpi_id
    ).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).group_by(KPIDefinition.id, KPIDefinition.name, KPIDefinition.code, KPIDefinition.direction).all()
    
    justifications = db.session.query(KPIJustification).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).all()
    
    root_cause_summary = db.session.query(
        KPIJustification.root_cause_category,
        func.count(KPIJustification.id).label('count')
    ).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).group_by(KPIJustification.root_cause_category).all()
    
    status_summary = db.session.query(
        KPIJustification.status,
        func.count(KPIJustification.id).label('count')
    ).join(KPIValue).filter(
        KPIValue.project_id == project_id,
        KPIValue.date >= start_date,
        KPIValue.date <= end_date
    ).group_by(KPIJustification.status).all()
    
    return jsonify({
        'period': 'monthly',
        'year': year,
        'month': month,
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'kpi_summary': [{
            'name': k.name,
            'code': k.code,
            'direction': k.direction,
            'avg_actual': round(k.avg_actual, 2) if k.avg_actual else None,
            'avg_target': round(k.avg_target, 2) if k.avg_target else None,
            'avg_variance': round(k.avg_variance, 2) if k.avg_variance else None,
            'min_variance': round(k.min_variance, 2) if k.min_variance else None,
            'max_variance': round(k.max_variance, 2) if k.max_variance else None,
            'data_points': k.data_points
        } for k in kpi_values],
        'total_justifications': len(justifications),
        'root_cause_summary': [{'category': r.root_cause_category, 'count': r.count} for r in root_cause_summary],
        'status_summary': [{'status': s.status, 'count': s.count} for s in status_summary]
    }), 200