from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Import config based on mode
    if config_name == 'testing':
        app.config['SECRET_KEY'] = 'test-secret-key'
        app.config['JWT_SECRET_KEY'] = 'test-jwt-secret'
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_opsmind.db'
    else:
        from app.config import config
        app.config.from_object(config[config_name])
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    CORS(app)
    db.init_app(app)
    jwt.init_app(app)
    
    with app.app_context():
        from app.routes import auth, org, kpi, knowledge, reports
        app.register_blueprint(auth.bp)
        app.register_blueprint(org.bp)
        app.register_blueprint(kpi.bp)
        app.register_blueprint(knowledge.bp)
        app.register_blueprint(reports.bp)
        
        db.create_all()
    
    return app