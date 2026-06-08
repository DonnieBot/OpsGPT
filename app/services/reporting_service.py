from datetime import datetime, timedelta
from sqlalchemy import func
from app.extensions import db
from app.models import KPIDefinition, KPIValue, KPIJustification, Project

class ReportingService:
    @staticmethod
    def get_kpi_summary(project_id, start_date, end_date):
        kpi_data = db.session.query(
            KPIDefinition.id,
            KPIDefinition.name,
            KPIDefinition.code,
            KPIDefinition.direction,
            KPIDefinition.target_value,
            func.avg(KPIValue.actual_value).label('avg_actual'),
            func.avg(KPIValue.variance).label('avg_variance'),
            func.count(KPIValue.id).label('count')
        ).join(
            KPIValue, KPIDefinition.id == KPIValue.kpi_id
        ).filter(
            KPIValue.project_id == project_id,
            KPIValue.date >= start_date,
            KPIValue.date <= end_date
        ).group_by(
            KPIDefinition.id, KPIDefinition.name, KPIDefinition.code, 
            KPIDefinition.direction, KPIDefinition.target_value
        ).all()
        
        return [{
            'id': k.id,
            'name': k.name,
            'code': k.code,
            'direction': k.direction,
            'target_value': k.target_value,
            'avg_actual': round(k.avg_actual, 2) if k.avg_actual else None,
            'avg_variance': round(k.avg_variance, 2) if k.avg_variance else None,
            'data_points': k.count
        } for k in kpi_data]
    
    @staticmethod
    def get_root_cause_analysis(project_id, start_date, end_date):
        root_causes = db.session.query(
            KPIJustification.root_cause_category,
            KPIJustification.root_cause_subcategory,
            func.count(KPIJustification.id).label('count')
        ).join(KPIValue).filter(
            KPIValue.project_id == project_id,
            KPIValue.date >= start_date,
            KPIValue.date <= end_date
        ).group_by(
            KPIJustification.root_cause_category,
            KPIJustification.root_cause_subcategory
        ).order_by(func.count(KPIJustification.id).desc()).all()
        
        return [{
            'category': r.root_cause_category,
            'subcategory': r.root_cause_subcategory,
            'count': r.count
        } for r in root_causes]
    
    @staticmethod
    def get_trend_analysis(kpi_id, days=90):
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)
        
        values = db.session.query(
            KPIValue.date,
            KPIValue.actual_value,
            KPIValue.target_value,
            KPIValue.variance
        ).filter(
            KPIValue.kpi_id == kpi_id,
            KPIValue.date >= start_date,
            KPIValue.date <= end_date
        ).order_by(KPIValue.date.asc()).all()
        
        return [{
            'date': v.date.isoformat(),
            'actual_value': v.actual_value,
            'target_value': v.target_value,
            'variance': v.variance
        } for v in values]
    
    @staticmethod
    def get_compliance_report(project_id, start_date, end_date):
        total_kpis = KPIDefinition.query.filter_by(project_id=project_id).count()
        
        total_values = KPIValue.query.filter(
            KPIValue.project_id == project_id,
            KPIValue.date >= start_date,
            KPIValue.date <= end_date
        ).count()
        
        compliant_values = KPIValue.query.filter(
            KPIValue.project_id == project_id,
            KPIValue.date >= start_date,
            KPIValue.date <= end_date
        ).join(KPIDefinition).filter(
            db.or_(
                db.and_(KPIDefinition.direction == 'higher', KPIValue.variance >= 0),
                db.and_(KPIDefinition.direction == 'lower', KPIValue.variance <= 0)
            )
        ).count()
        
        compliance_rate = (compliant_values / total_values * 100) if total_values > 0 else 0
        
        return {
            'total_kpis': total_kpis,
            'total_data_points': total_values,
            'compliant_points': compliant_values,
            'compliance_rate': round(compliance_rate, 2)
        }