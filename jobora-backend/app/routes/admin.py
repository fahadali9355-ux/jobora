from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity
from app import db
from app.models.user import User
from app.models.job import Job
from app.models.application import Application
from app.models.resume import Resume
from app.middleware.auth_middleware import admin_required

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """List all users. Admin only."""
    try:
        role_filter = request.args.get('role')
        query = User.query

        if role_filter:
            query = query.filter_by(role=role_filter)

        users = query.order_by(User.created_at.desc()).all()

        return jsonify({
            'success': True,
            'data': [u.to_dict() for u in users],
            'message': f'{len(users)} users found'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500


@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_platform_stats():
    """Get platform-wide statistics. Admin only."""
    try:
        total_users = User.query.count()
        total_seekers = User.query.filter_by(role='seeker').count()
        total_recruiters = User.query.filter_by(role='recruiter').count()
        total_jobs = Job.query.count()
        active_jobs = Job.query.filter_by(status='active').count()
        total_applications = Application.query.count()
        total_resumes = Resume.query.count()

        # Average match score
        from sqlalchemy import func
        avg_match = db.session.query(func.avg(Application.match_score)).scalar()

        return jsonify({
            'success': True,
            'data': {
                'total_users': total_users,
                'total_seekers': total_seekers,
                'total_recruiters': total_recruiters,
                'total_jobs': total_jobs,
                'active_jobs': active_jobs,
                'total_applications': total_applications,
                'total_resumes': total_resumes,
                'avg_match_score': round(avg_match, 2) if avg_match else 0
            },
            'message': 'Platform stats retrieved'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500


@admin_bp.route('/users/<int:user_id>', methods=['PATCH'])
@admin_required
def update_user(user_id):
    """Update user role or status. Admin only."""
    try:
        user = User.query.get(user_id)

        if not user:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'User not found'
            }), 404

        data = request.get_json()

        if 'role' in data:
            if data['role'] not in ('seeker', 'recruiter', 'admin'):
                return jsonify({
                    'success': False,
                    'data': None,
                    'message': 'Invalid role'
                }), 400
            user.role = data['role']

        if 'name' in data:
            user.name = data['name']

        db.session.commit()

        return jsonify({
            'success': True,
            'data': user.to_dict(),
            'message': 'User updated'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500
