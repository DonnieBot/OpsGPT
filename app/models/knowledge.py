from app.extensions import db
from datetime import datetime

class OperationalInsight(db.Model):
    __tablename__ = 'operational_insights'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    kpi_name = db.Column(db.String(100))
    root_cause = db.Column(db.String(100))
    root_cause_category = db.Column(db.String(100))
    comment = db.Column(db.Text)
    resolution = db.Column(db.Text)
    confidence_score = db.Column(db.Float, default=0.0)
    source_type = db.Column(db.String(50))  # manual / ai_generated
    is_verified = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'kpi_name': self.kpi_name,
            'root_cause': self.root_cause,
            'root_cause_category': self.root_cause_category,
            'comment': self.comment,
            'resolution': self.resolution,
            'confidence_score': self.confidence_score,
            'source_type': self.source_type,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }