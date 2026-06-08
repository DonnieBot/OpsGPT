from app.extensions import db
from app.models import OperationalInsight, KPIJustification

class KnowledgeService:
    @staticmethod
    def create_insight(project_id, kpi_name=None, root_cause=None, 
                       root_cause_category=None, comment=None, resolution=None,
                       confidence_score=0.0, source_type='manual'):
        insight = OperationalInsight(
            project_id=project_id,
            kpi_name=kpi_name,
            root_cause=root_cause,
            root_cause_category=root_cause_category,
            comment=comment,
            resolution=resolution,
            confidence_score=confidence_score,
            source_type=source_type,
            is_verified=False
        )
        db.session.add(insight)
        db.session.commit()
        return insight
    
    @staticmethod
    def create_from_justification(justification_id, confidence_score=0.5):
        justification = KPIJustification.query.get(justification_id)
        if not justification:
            raise ValueError('Justification not found')
        
        kpi_value = justification.kpi_value
        
        insight = OperationalInsight(
            project_id=kpi_value.project_id,
            kpi_name=kpi_value.kpi_def.name if kpi_value.kpi_def else None,
            root_cause=justification.root_cause_subcategory,
            root_cause_category=justification.root_cause_category,
            comment=justification.comment,
            resolution=justification.action_plan,
            confidence_score=confidence_score,
            source_type='manual',
            is_verified=False
        )
        db.session.add(insight)
        db.session.commit()
        return insight
    
    @staticmethod
    def verify_insight(insight_id):
        insight = OperationalInsight.query.get(insight_id)
        if not insight:
            raise ValueError('Insight not found')
        
        insight.is_verified = True
        db.session.commit()
        return insight
    
    @staticmethod
    def get_similar_insights(project_id, root_cause_category, limit=5):
        insights = OperationalInsight.query.filter(
            OperationalInsight.project_id == project_id,
            OperationalInsight.root_cause_category == root_cause_category,
            OperationalInsight.is_verified == True
        ).order_by(OperationalInsight.confidence_score.desc()).limit(limit).all()
        
        return [i.to_dict() for i in insights]
    
    @staticmethod
    def update_confidence_score(insight_id, new_score):
        insight = OperationalInsight.query.get(insight_id)
        if not insight:
            raise ValueError('Insight not found')
        
        insight.confidence_score = new_score
        db.session.commit()
        return insight