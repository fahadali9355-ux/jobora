from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.job import Job
from app.middleware.auth_middleware import recruiter_required

jobs_bp = Blueprint('jobs', __name__)


@jobs_bp.route('', methods=['GET'])
def get_jobs():
    """List all jobs with optional filters: location, job_type, salary_min, salary_max, search."""
    try:
        query = Job.query.filter_by(status='active')

        # Apply filters
        location = request.args.get('location')
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))

        job_type = request.args.get('job_type')
        if job_type:
            query = query.filter_by(job_type=job_type)

        salary_min = request.args.get('salary_min', type=int)
        if salary_min:
            query = query.filter(Job.salary_max >= salary_min)

        salary_max = request.args.get('salary_max', type=int)
        if salary_max:
            query = query.filter(Job.salary_min <= salary_max)

        search = request.args.get('search')
        if search:
            query = query.filter(
                db.or_(
                    Job.title.ilike(f'%{search}%'),
                    Job.company.ilike(f'%{search}%'),
                    Job.description.ilike(f'%{search}%')
                )
            )

        jobs = query.order_by(Job.created_at.desc()).all()

        return jsonify({
            'success': True,
            'data': [job.to_dict() for job in jobs],
            'message': f'{len(jobs)} jobs found'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Failed to fetch jobs: {str(e)}'
        }), 500


@jobs_bp.route('', methods=['POST'])
@recruiter_required
def create_job():
    """Create a new job listing. Requires recruiter role."""
    try:
        data = request.get_json()
        user_id = get_jwt_identity()

        required = ['title', 'company']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'data': None,
                    'message': f'Missing required field: {field}'
                }), 400

        skills = data.get('skills_required', [])
        if isinstance(skills, list):
            skills = ','.join(skills)

        job = Job(
            title=data['title'],
            company=data['company'],
            description=data.get('description', ''),
            skills_required=skills,
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            location=data.get('location', ''),
            job_type=data.get('job_type', 'full-time'),
            experience_min=data.get('experience_min', 0),
            recruiter_id=int(user_id),
            status='active'
        )

        db.session.add(job)
        db.session.commit()

        return jsonify({
            'success': True,
            'data': job.to_dict(),
            'message': 'Job created successfully'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Failed to create job: {str(e)}'
        }), 500


@jobs_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """Get a single job by ID."""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Job not found'
            }), 404

        return jsonify({
            'success': True,
            'data': job.to_dict(),
            'message': 'Job retrieved'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500


@jobs_bp.route('/<int:job_id>', methods=['PUT'])
@recruiter_required
def update_job(job_id):
    """Update a job listing. Only the recruiter who posted it can update."""
    try:
        user_id = get_jwt_identity()
        job = Job.query.get(job_id)

        if not job:
            return jsonify({'success': False, 'data': None, 'message': 'Job not found'}), 404

        if job.recruiter_id != int(user_id):
            return jsonify({'success': False, 'data': None, 'message': 'Unauthorized'}), 403

        data = request.get_json()
        for field in ['title', 'company', 'description', 'location', 'job_type', 'status']:
            if field in data:
                setattr(job, field, data[field])

        if 'skills_required' in data:
            skills = data['skills_required']
            job.skills_required = ','.join(skills) if isinstance(skills, list) else skills

        for field in ['salary_min', 'salary_max', 'experience_min']:
            if field in data:
                setattr(job, field, data[field])

        db.session.commit()

        return jsonify({
            'success': True,
            'data': job.to_dict(),
            'message': 'Job updated'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500


@jobs_bp.route('/<int:job_id>', methods=['DELETE'])
@recruiter_required
def delete_job(job_id):
    """Delete a job listing. Only the recruiter who posted it can delete."""
    try:
        user_id = get_jwt_identity()
        job = Job.query.get(job_id)

        if not job:
            return jsonify({'success': False, 'data': None, 'message': 'Job not found'}), 404

        if job.recruiter_id != int(user_id):
            return jsonify({'success': False, 'data': None, 'message': 'Unauthorized'}), 403

        db.session.delete(job)
        db.session.commit()

        return jsonify({
            'success': True,
            'data': None,
            'message': 'Job deleted'
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500


@jobs_bp.route('/<int:job_id>/rank-candidates', methods=['POST'])
@recruiter_required
def api_rank_candidates(job_id):
    """Rank candidates for a job. Requires recruiter role."""
    try:
        user_id = get_jwt_identity()
        job = Job.query.get(job_id)

        if not job:
            return jsonify({'success': False, 'data': None, 'message': 'Job not found'}), 404

        if job.recruiter_id != int(user_id):
            return jsonify({'success': False, 'data': None, 'message': 'Unauthorized'}), 403

        from app.ai.resume_ranker import rank_candidates
        ranked_list = rank_candidates(job_id, db.session)

        return jsonify({
            'success': True,
            'data': ranked_list,
            'message': 'Candidates ranked successfully'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500
