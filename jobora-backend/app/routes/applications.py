from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.application import Application
from app.models.job import Job
from app.middleware.auth_middleware import seeker_required, recruiter_required

applications_bp = Blueprint('applications', __name__)


@applications_bp.route('/apply', methods=['POST'])
@seeker_required
def apply_for_job():
    """Submit a job application. Requires seeker role."""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()
        job_id = data.get('job_id')

        if not job_id:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'job_id is required'
            }), 400

        # Check job exists
        job = Job.query.get(job_id)
        if not job:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Job not found'
            }), 404

        # Check if already applied
        existing = Application.query.filter_by(
            job_id=job_id,
            seeker_id=int(user_id)
        ).first()

        if existing:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'You have already applied for this job'
            }), 409

        application = Application(
            job_id=job_id,
            seeker_id=int(user_id),
            status='pending',
            match_score=data.get('match_score')
        )

        db.session.add(application)
        db.session.commit()

        return jsonify({
            'success': True,
            'data': application.to_dict(),
            'message': 'Application submitted'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Application failed: {str(e)}'
        }), 500


@applications_bp.route('/applications/seeker', methods=['GET'])
@seeker_required
def get_seeker_applications():
    """Get all applications for the authenticated seeker."""
    try:
        user_id = get_jwt_identity()
        apps = Application.query.filter_by(seeker_id=int(user_id)).order_by(
            Application.applied_at.desc()
        ).all()

        result = []
        for app in apps:
            app_data = app.to_dict()
            app_data['job'] = app.job.to_dict() if app.job else None
            result.append(app_data)

        return jsonify({
            'success': True,
            'data': result,
            'message': f'{len(result)} applications found'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500


@applications_bp.route('/applications/recruiter/<int:job_id>', methods=['GET'])
@recruiter_required
def get_job_applications(job_id):
    """Get all applications for a specific job. Requires recruiter role."""
    try:
        user_id = get_jwt_identity()
        job = Job.query.get(job_id)

        if not job:
            return jsonify({'success': False, 'data': None, 'message': 'Job not found'}), 404

        if job.recruiter_id != int(user_id):
            return jsonify({'success': False, 'data': None, 'message': 'Unauthorized'}), 403

        apps = Application.query.filter_by(job_id=job_id).order_by(
            Application.match_score.desc()
        ).all()

        result = []
        for app in apps:
            app_data = app.to_dict()
            app_data['seeker'] = app.seeker.to_dict() if app.seeker else None
            result.append(app_data)

        return jsonify({
            'success': True,
            'data': result,
            'message': f'{len(result)} applications found'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500


@applications_bp.route('/applications/<int:app_id>/status', methods=['PATCH'])
@recruiter_required
def update_application_status(app_id):
    """Update application status (pending/shortlisted/rejected). Recruiter only."""
    try:
        data = request.get_json()
        new_status = data.get('status')

        if new_status not in ('pending', 'shortlisted', 'rejected'):
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Invalid status. Must be: pending, shortlisted, or rejected'
            }), 400

        application = Application.query.get(app_id)
        if not application:
            return jsonify({'success': False, 'data': None, 'message': 'Application not found'}), 404

        # Verify recruiter owns the job
        user_id = get_jwt_identity()
        if application.job.recruiter_id != int(user_id):
            return jsonify({'success': False, 'data': None, 'message': 'Unauthorized'}), 403

        application.status = new_status
        db.session.commit()

        return jsonify({
            'success': True,
            'data': application.to_dict(),
            'message': f'Status updated to {new_status}'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500
