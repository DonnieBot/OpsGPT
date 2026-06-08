from app.extensions import db
from datetime import datetime

class KPIDefinition(db.Model):
    __tablename__ = 'kpi_definitions'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    code = db.Column(db.String(50))
    description = db.Column(db.Text)
    target_value = db.Column(db.Float)
    unit = db.Column(db.String(50))
    direction = db.Column(db.String(20), default='higher')  # higher/lower better
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'target_value': self.target_value,
            'unit': self.unit,
            'direction': self.direction,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class KPIValue(db.Model):
    __tablename__ = 'kpi_values'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    kpi_id = db.Column(db.Integer, db.ForeignKey('kpi_definitions.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    actual_value = db.Column(db.Float)
    target_value = db.Column(db.Float)
    variance = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'kpi_id': self.kpi_id,
            'date': self.date.isoformat() if self.date else None,
            'actual_value': self.actual_value,
            'target_value': self.target_value,
            'variance': self.variance,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class KPIJustification(db.Model):
    __tablename__ = 'kpi_justifications'

    id = db.Column(db.Integer, primary_key=True)
    kpi_value_id = db.Column(db.Integer, db.ForeignKey('kpi_values.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    comment = db.Column(db.Text)
    root_cause_category = db.Column(db.String(100))
    root_cause_subcategory = db.Column(db.String(100))
    action_plan = db.Column(db.Text)
    status = db.Column(db.String(50), default='draft')  # draft / approved / certified
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'kpi_value_id': self.kpi_value_id,
            'user_id': self.user_id,
            'comment': self.comment,
            'root_cause_category': self.root_cause_category,
            'root_cause_subcategory': self.root_cause_subcategory,
            'action_plan': self.action_plan,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class RootCause(db.Model):
    __tablename__ = 'root_causes'

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)  # People / Tech / Process
    subcategory = db.Column(db.String(100))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'project_id': self.project_id,
            'category': self.category,
            'subcategory': self.subcategory,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }