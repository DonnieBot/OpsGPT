from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import Organization, Project, User

bp = Blueprint('org', __name__, url_prefix='/org')

@bp.route('/create', methods=['POST'])
@jwt_required()
def create_organization():
    data = request.get_json()
    
    if not data or not data.get('name'):
        return jsonify({'error': 'Organization name required'}), 400
    
    org = Organization(
        name=data['name'],
        code=data.get('code'),
        description=data.get('description')
    )
    db.session.add(org)
    db.session.commit()
    
    return jsonify({
        'message': 'Organization created successfully',
        'organization': org.to_dict()
    }), 201

@bp.route('/<int:org_id>', methods=['GET'])
@jwt_required()
def get_organization(org_id):
    org = Organization.query.get(org_id)
    
    if not org:
        return jsonify({'error': 'Organization not found'}), 404
    
    return jsonify({'organization': org.to_dict()}), 200

@bp.route('/', methods=['GET'])
@jwt_required()
def list_organizations():
    orgs = Organization.query.all()
    return jsonify({'organizations': [o.to_dict() for o in orgs]}), 200


# Project routes
@bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():
    data = request.get_json()
    
    if not data or not data.get('name') or not data.get('org_id'):
        return jsonify({'error': 'Project name and org_id required'}), 400
    
    project = Project(
        org_id=data['org_id'],
        name=data['name'],
        client_name=data.get('client_name'),
        description=data.get('description')
    )
    db.session.add(project)
    db.session.commit()
    
    return jsonify({
        'message': 'Project created successfully',
        'project': project.to_dict()
    }), 201

@bp.route('/projects/org/<int:org_id>', methods=['GET'])
@jwt_required()
def get_projects_by_org(org_id):
    projects = Project.query.filter_by(org_id=org_id).all()
    return jsonify({'projects': [p.to_dict() for p in projects]}), 200

@bp.route('/projects/<int:project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    return jsonify({'project': project.to_dict()}), 200

@bp.route('/projects/<int:project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    
    data = request.get_json()
    if data.get('name'):
        project.name = data['name']
    if data.get('client_name'):
        project.client_name = data['client_name']
    if data.get('description'):
        project.description = data['description']
    if 'is_active' in data:
        project.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        'message': 'Project updated successfully',
        'project': project.to_dict()
    }), 200