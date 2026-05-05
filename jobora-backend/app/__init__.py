import os
from datetime import timedelta
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
jwt = JWTManager()


def create_app():
    """Flask application factory."""
    app = Flask(__name__)

    # Load config
    from app.config import Config
    app.config.from_object(Config)
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(seconds=Config.JWT_ACCESS_TOKEN_EXPIRES)

    # Ensure upload directory exists
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads/resumes'), exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, origins=Config.CORS_ORIGINS, supports_credentials=True)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.jobs import jobs_bp
    from app.routes.applications import applications_bp
    from app.routes.resume import resume_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(applications_bp, url_prefix='/api')
    app.register_blueprint(resume_bp, url_prefix='/api/resume')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    # Create tables
    with app.app_context():
        from app.models import user, job, application, resume  # noqa: F401
        db.create_all()

    return app
