import os
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models.resume import Resume

resume_bp = Blueprint('resume', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    """Upload a resume file (PDF/DOC/DOCX). Replaces existing resume if any."""
    try:
        user_id = get_jwt_identity()

        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'No file provided. Send file in "file" field.'
            }), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({
                'success': False,
                'data': None,
                'message': 'No file selected'
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Invalid file type. Allowed: PDF, DOC, DOCX'
            }), 400

        # Save file
        upload_folder = current_app.config.get('UPLOAD_FOLDER', 'uploads/resumes')
        filename = secure_filename(f"resume_{user_id}_{file.filename}")
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Update or create resume record
        existing = Resume.query.filter_by(user_id=int(user_id)).first()

        if existing:
            # Delete old file if exists
            if existing.file_path and os.path.exists(existing.file_path):
                os.remove(existing.file_path)
            existing.file_path = file_path
            existing.parsed_data = None  # Reset parsed data — will be re-parsed
        else:
            resume = Resume(
                user_id=int(user_id),
                file_path=file_path,
                parsed_data=None
            )
            db.session.add(resume)

        db.session.commit()

        resume_record = existing or resume
        return jsonify({
            'success': True,
            'data': resume_record.to_dict(),
            'message': 'Resume uploaded successfully'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Upload failed: {str(e)}'
        }), 500


@resume_bp.route('/<int:target_user_id>', methods=['GET'])
@jwt_required()
def get_resume(target_user_id):
    """Get resume data for a specific user."""
    try:
        resume = Resume.query.filter_by(user_id=target_user_id).first()

        if not resume:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Resume not found'
            }), 404

        return jsonify({
            'success': True,
            'data': resume.to_dict(),
            'message': 'Resume retrieved'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': str(e)
        }), 500
