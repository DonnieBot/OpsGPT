from datetime import datetime, timedelta
from app.extensions import db
from app.models import KPIDefinition, KPIValue, KPIJustification
from app.utils.security import calculate_variance, classify_root_cause

class KPIService:
    @staticmethod
    def create_definition(project_id, name, code=None, description=None, 
                         target_value=None, unit='count', direction='higher'):
        kpi = KPIDefinition(
            project_id=project_id,
            name=name,
            code=code,
            description=description,
            target_value=target_value,
            unit=unit,
            direction=direction
        )
        db.session.add(kpi)
        db.session.commit()
        return kpi
    
    @staticmethod
    def ingest_value(project_id, kpi_id, date, actual_value, target_value=None):
        kpi_def = KPIDefinition.query.get(kpi_id)
        if not kpi_def:
            raise ValueError('KPI definition not found')
        
        target = target_value if target_value is not None else kpi_def.target_value
        variance = calculate_variance(actual_value, target)
        
        kpi_value = KPIValue(
            project_id=project_id,
            kpi_id=kpi_id,
            date=date if isinstance(date, datetime) else datetime.strptime(date, '%Y-%m-%d').date(),
            actual_value=actual_value,
            target_value=target,
            variance=variance
        )
        db.session.add(kpi_value)
        db.session.commit()
        return kpi_value
    
    @staticmethod
    def get_trend(kpi_id, days=30):
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)
        
        values = KPIValue.query.filter(
            KPIValue.kpi_id == kpi_id,
            KPIValue.date >= start_date,
            KPIValue.date <= end_date
        ).order_by(KPIValue.date.asc()).all()
        
        return [v.to_dict() for v in values]
    
    @staticmethod
    def create_justification(kpi_value_id, user_id, comment, action_plan=None):
        root_cat, root_sub = classify_root_cause(comment)
        
        justification = KPIJustification(
            kpi_value_id=kpi_value_id,
            user_id=user_id,
            comment=comment,
            root_cause_category=root_cat,
            root_cause_subcategory=root_sub,
            action_plan=action_plan,
            status='draft'
        )
        db.session.add(justification)
        db.session.commit()
        return justification
    
    @staticmethod
    def approve_justification(justification_id, approver_id):
        justification = KPIJustification.query.get(justification_id)
        if not justification:
            raise ValueError('Justification not found')
        
        justification.status = 'approved'
        db.session.commit()
        return justification
    
    @staticmethod
    def certify_justification(justification_id, certifier_id):
        justification = KPIJustification.query.get(justification_id)
        if not justification:
            raise ValueError('Justification not found')
        
        justification.status = 'certified'
        db.session.commit()
        return justification