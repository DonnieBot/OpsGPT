from datetime import datetime, timedelta
import random
from app import create_app
from app.extensions import db
from app.models import Organization, Project, User, KPIDefinition, KPIValue, KPIJustification, RootCause, OperationalInsight
from app.utils.security import hash_password

def seed_database():
    app = create_app()
    
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Create Organization
        org = Organization(
            name='BPO Operations Inc.',
            code='BPO001',
            description='Leading BPO company managing multiple client accounts'
        )
        db.session.add(org)
        db.session.commit()
        
        # Create Projects
        projects_data = [
            {'name': 'Healthcare Support', 'client_name': 'HealthCorp', 'description': 'Healthcare customer service operations'},
            {'name': 'E-Commerce Support', 'client_name': 'ShopEasy', 'description': 'E-commerce customer support'},
            {'name': 'Tech Support LOB', 'client_name': 'TechServ', 'description': 'Technical support services'}
        ]
        
        projects = []
        for p_data in projects_data:
            project = Project(org_id=org.id, **p_data)
            db.session.add(project)
            projects.append(project)
        db.session.commit()
        
        # Create Users
        users_data = [
            {'email': 'admin@opsmind.com', 'password': 'admin123', 'role': 'Admin', 'first_name': 'Admin', 'last_name': 'User'},
            {'email': 'manager@opsmind.com', 'password': 'manager123', 'role': 'Manager', 'first_name': 'John', 'last_name': 'Manager'},
            {'email': 'analyst@opsmind.com', 'password': 'analyst123', 'role': 'Analyst', 'first_name': 'Jane', 'last_name': 'Analyst'}
        ]
        
        users = []
        for u_data in users_data:
            user = User(
                org_id=org.id,
                email=u_data['email'],
                password_hash=hash_password(u_data['password']),
                role=u_data['role'],
                first_name=u_data['first_name'],
                last_name=u_data['last_name']
            )
            db.session.add(user)
            users.append(user)
        db.session.commit()
        
        # Create KPI Definitions for each project
        kpi_templates = [
            {'name': 'Average Handle Time', 'code': 'AHT', 'target_value': 300, 'unit': 'seconds', 'direction': 'lower'},
            {'name': 'Customer Satisfaction', 'code': 'CSAT', 'target_value': 90, 'unit': '%', 'direction': 'higher'},
            {'name': 'First Contact Resolution', 'code': 'FCR', 'target_value': 75, 'unit': '%', 'direction': 'higher'},
            {'name': 'Agent Attendance', 'code': 'ATT', 'target_value': 95, 'unit': '%', 'direction': 'higher'},
            {'name': 'Quality Score', 'code': 'QUAL', 'target_value': 85, 'unit': '%', 'direction': 'higher'}
        ]
        
        kpi_definitions = []
        for project in projects:
            for kpi in kpi_templates:
                kpi_def = KPIDefinition(project_id=project.id, **kpi)
                db.session.add(kpi_def)
                kpi_definitions.append(kpi_def)
        db.session.commit()
        
        # Create Root Causes
        root_causes_data = [
            {'category': 'People', 'subcategory': 'New Hire / Training', 'description': 'Training gaps or new hire onboarding issues'},
            {'category': 'People', 'subcategory': 'Staffing', 'description': 'Understaffing or scheduling issues'},
            {'category': 'Technology', 'subcategory': 'System Issue', 'description': 'Technical system failures or downtime'},
            {'category': 'Technology', 'subcategory': 'Tool Limitation', 'description': 'Tools or software limitations'},
            {'category': 'Process', 'subcategory': 'Procedure Gap', 'description': 'Missing or inadequate procedures'},
            {'category': 'Process', 'subcategory': 'Volume Variance', 'description': 'Unexpected volume changes'},
            {'category': 'External', 'subcategory': 'Client Related', 'description': 'Client-specific issues'},
            {'category': 'External', 'subcategory': 'Market Conditions', 'description': 'Market or environmental factors'}
        ]
        
        for project in projects:
            for rc in root_causes_data:
                root_cause = RootCause(project_id=project.id, **rc)
                db.session.add(root_cause)
        db.session.commit()
        
        # Generate KPI Values for last 90 days
        today = datetime.utcnow().date()
        for kpi_def in kpi_definitions:
            for days_ago in range(90):
                date = today - timedelta(days=days_ago)
                
                variance_factor = random.uniform(-15, 15)
                actual_value = kpi_def.target_value * (1 + variance_factor/100)
                
                if kpi_def.direction == 'lower':
                    actual_value = kpi_def.target_value * (1 - variance_factor/100)
                
                variance = ((actual_value - kpi_def.target_value) / kpi_def.target_value) * 100
                
                kpi_value = KPIValue(
                    project_id=kpi_def.project_id,
                    kpi_id=kpi_def.id,
                    date=date,
                    actual_value=round(actual_value, 2),
                    target_value=kpi_def.target_value,
                    variance=round(variance, 2)
                )
                db.session.add(kpi_value)
        db.session.commit()
        
        # Create some Justifications
        justification_templates = [
            {'comment': 'New hire training completed, expect improvement next week', 'root_cause_category': 'People', 'root_cause_subcategory': 'New Hire / Training'},
            {'comment': 'System maintenance scheduled during peak hours', 'root_cause_category': 'Technology', 'root_cause_subcategory': 'System Issue'},
            {'comment': 'Increased call volume due to product launch', 'root_cause_category': 'Process', 'root_cause_subcategory': 'Volume Variance'},
            {'comment': 'Staff shortage due to unexpected sick leave', 'root_cause_category': 'People', 'root_cause_subcategory': 'Staffing'},
            {'comment': 'Updated escalation procedures being implemented', 'root_cause_category': 'Process', 'root_cause_subcategory': 'Procedure Gap'}
        ]
        
        kpi_values = KPIValue.query.all()[:50]
        for kpi_value in kpi_values:
            if random.random() > 0.5:
                j_template = random.choice(justification_templates)
                justification = KPIJustification(
                    kpi_value_id=kpi_value.id,
                    user_id=users[1].id,
                    comment=j_template['comment'],
                    root_cause_category=j_template['root_cause_category'],
                    root_cause_subcategory=j_template['root_cause_subcategory'],
                    action_plan='Monitor and review next week',
                    status=random.choice(['draft', 'approved', 'certified'])
                )
                db.session.add(justification)
        db.session.commit()
        
        # Create Operational Insights
        insights_data = [
            {'kpi_name': 'Average Handle Time', 'root_cause': 'Script Navigation', 'root_cause_category': 'Process', 'comment': 'Agents taking longer due to complex system navigation', 'resolution': 'Simplified UI layout and quick links implemented', 'confidence_score': 0.85, 'source_type': 'manual', 'is_verified': True},
            {'kpi_name': 'Customer Satisfaction', 'root_cause': 'Hold Time', 'root_cause_category': 'People', 'comment': 'High hold times causing customer dissatisfaction', 'resolution': 'Increased staffing during peak hours', 'confidence_score': 0.90, 'source_type': 'ai_generated', 'is_verified': True},
            {'kpi_name': 'First Contact Resolution', 'root_cause': 'Knowledge Base', 'root_cause_category': 'Technology', 'comment': 'Agents unable to find answers in knowledge base', 'resolution': 'Updated KB articles and added search functionality', 'confidence_score': 0.75, 'source_type': 'manual', 'is_verified': True}
        ]
        
        for project in projects[:2]:
            for insight_data in insights_data:
                insight = OperationalInsight(project_id=project.id, **insight_data)
                db.session.add(insight)
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Created: {len(projects)} projects, {len(users)} users, {len(kpi_definitions)} KPIs")

if __name__ == '__main__':
    seed_database()