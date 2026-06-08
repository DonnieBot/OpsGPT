from app.extensions import db
from datetime import datetime

class ApprovalWorkflow(db.Model):
    __tablename__ = 'approval_workflows'

    id = db.Column(db.Integer, primary_key=True)
    entity_type = db.Column(db.String(50), nullable=False)  # justification / insight / report
    entity_id = db.Column(db.Integer, nullable=False)
    current_status = db.Column(db.String(50), default='draft')
    submitted_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    certified_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    submitted_at = db.Column(db.DateTime)
    approved_at = db.Column(db.DateTime)
    certified_at = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'entity_type': self.entity_type,
            'entity_id': self.entity_id,
            'current_status': self.current_status,
            'submitted_by': self.submitted_by,
            'approved_by': self.approved_by,
            'certified_by': self.certified_by,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None,
            'certified_at': self.certified_at.isoformat() if self.certified_at else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }