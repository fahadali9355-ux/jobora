import os
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app import db
from app.models.resume import Resume
from app.ai.resume_ranker import extract_text_from_pdf, parse_resume_with_spacy

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

        # AI Parsing
        try:
            raw_text = extract_text_from_pdf(file_path)
            parsed = parse_resume_with_spacy(raw_text)
            
            # Calculate resume score (based on completeness)
            score = 0
            if parsed.get('name'): score += 20
            if parsed.get('email'): score += 15
            if parsed.get('phone'): score += 10
            if parsed.get('skills') and len(parsed['skills']) > 0: score += 25
            if parsed.get('experience') and len(parsed['experience']) > 0: score += 20
            if parsed.get('education') and len(parsed['education']) > 0: score += 10
            parsed['resume_score'] = score
            
        except Exception as parse_error:
            parsed = {'error': str(parse_error), 'resume_score': 0}

        # Update or create resume record
        existing = Resume.query.filter_by(user_id=int(user_id)).first()

        if existing:
            # Delete old file if exists
            if existing.file_path and os.path.exists(existing.file_path):
                try:
                    os.remove(existing.file_path)
                except Exception:
                    pass
            existing.file_path = file_path
            existing.parsed_data = parsed
        else:
            resume = Resume(
                user_id=int(user_id),
                file_path=file_path,
                parsed_data=parsed
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


@resume_bp.route('/tips/<int:target_user_id>', methods=['GET'])
@jwt_required()
def get_resume_tips(target_user_id):
    """Get AI-powered resume improvement tips."""
    try:
        resume = Resume.query.filter_by(user_id=target_user_id).first()

        if not resume or not resume.parsed_data:
            return jsonify({
                'success': True,
                'data': [
                    'Upload your resume to get personalized AI tips',
                    'Use PDF format for best parsing results',
                    'Include a professional summary section'
                ],
                'message': 'Default tips (no resume found)'
            }), 200

        raw = resume.parsed_data
        # Unwrap any double-encoding from legacy saves
        while isinstance(raw, str):
            raw = json.loads(raw)
        parsed = raw
        resume_text = parsed.get('raw_text', '')[:3000]

        from app.ai.bedrock_client import invoke_claude
        prompt = f"""You are a professional career advisor. Analyze this resume and provide exactly 4 specific, actionable improvement tips.
Return ONLY a JSON array of 4 strings, no markdown, no extra text. Each tip should be 1 sentence.

Example format: ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]

Resume:
{resume_text}"""

        try:
            response = invoke_claude(prompt, max_tokens=300).strip()
            if response.startswith("```"): response = response.split("```")[1]
            if response.startswith("json"): response = response[4:]
            if response.endswith("```"): response = response.rsplit("```", 1)[0]
            tips = json.loads(response.strip())
            if isinstance(tips, list) and len(tips) > 0:
                return jsonify({'success': True, 'data': tips[:4], 'message': 'AI tips generated'}), 200
        except Exception as e:
            print(f"AI tips error: {e}")

        # Fallback tips
        return jsonify({
            'success': True,
            'data': [
                'Add a professional summary section',
                'Include quantifiable achievements in experience',
                'List relevant certifications for ATS optimization',
                'Add more technical skills keywords'
            ],
            'message': 'Fallback tips'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500
