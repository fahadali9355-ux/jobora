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

        # Calculate match score using AI
        job_desc = job.description or ""
        if job.skills_required:
            job_desc += " " + job.skills_required
            
        from app.models.resume import Resume
        import json
        resume = Resume.query.filter_by(user_id=int(user_id)).first()
        
        match_score = 0.0
        if resume and resume.parsed_data:
            try:
                resume_data = json.loads(resume.parsed_data)
                resume_text = resume_data.get("raw_text", "")
                from app.ai.resume_ranker import calculate_match_score
                match_score = calculate_match_score(resume_text, job_desc)
            except Exception as e:
                print("Error calculating match score:", e)

        application = Application(
            job_id=job_id,
            seeker_id=int(user_id),
            status='pending',
            match_score=match_score
        )

        db.session.add(application)

        # Create notification for the seeker: "You applied"
        from app.routes.notifications import create_notification
        create_notification(
            user_id=int(user_id),
            title='Application Submitted',
            message=f'You have successfully applied for "{job.title}" at {job.company}. Good luck!',
            notif_type='success',
            link='/dashboard/seeker/applications'
        )
        # Notify the recruiter that someone applied
        create_notification(
            user_id=job.recruiter_id,
            title='New Applicant',
            message=f'A new candidate has applied for your job posting "{job.title}".',
            notif_type='info',
            link='/dashboard/recruiter/candidates'
        )

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
            seeker_data = app.seeker.to_dict() if app.seeker else None
            
            # Include resume parsed data so recruiter can view full resume details
            resume_data = None
            if app.seeker and app.seeker.resume and app.seeker.resume.parsed_data:
                import json
                try:
                    raw = app.seeker.resume.parsed_data
                    # Unwrap any double-encoding from legacy saves
                    while isinstance(raw, str):
                        raw = json.loads(raw)
                    resume_data = raw
                    # Remove raw_text to keep response size manageable
                    if isinstance(resume_data, dict):
                        resume_data.pop('raw_text', None)
                except Exception:
                    resume_data = None
            
            app_data['seeker'] = seeker_data
            app_data['resume'] = resume_data
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

        # Notify the seeker about the status change
        from app.routes.notifications import create_notification
        job_title = application.job.title if application.job else 'a job'
        company = application.job.company if application.job else ''

        if new_status == 'shortlisted':
            create_notification(
                user_id=application.seeker_id,
                title='🎉 Congratulations! You\'ve Been Shortlisted',
                message=f'Great news! Your application for "{job_title}" at {company} has been shortlisted. The recruiter is interested in your profile. Prepare for the next steps!',
                notif_type='success',
                link='/dashboard/seeker/applications'
            )
        elif new_status == 'rejected':
            create_notification(
                user_id=application.seeker_id,
                title='Application Update',
                message=f'Unfortunately, your application for "{job_title}" at {company} was not selected to move forward. Don\'t be discouraged — keep applying to other opportunities!',
                notif_type='warning',
                link='/dashboard/seeker/applications'
            )

        db.session.commit()

        return jsonify({
            'success': True,
            'data': application.to_dict(),
            'message': f'Status updated to {new_status}'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500
