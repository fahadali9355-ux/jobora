from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user with name, email, password, and role."""
    try:
        data = request.get_json()

        # Validate required fields
        required = ['name', 'email', 'password', 'role']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'data': None,
                    'message': f'Missing required field: {field}'
                }), 400

        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Email already registered'
            }), 409

        # Validate role
        if data['role'] not in ('seeker', 'recruiter', 'admin'):
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Invalid role. Must be: seeker, recruiter, or admin'
            }), 400

        # Create user
        user = User(
            name=data['name'],
            email=data['email'],
            role=data['role'],
            status='active'
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        # Generate JWT token
        token = create_access_token(identity=str(user.id))

        return jsonify({
            'success': True,
            'data': {
                'user': user.to_dict(),
                'access_token': token
            },
            'message': 'Registration successful'
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Registration failed: {str(e)}'
        }), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Authenticate user and return JWT token."""
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Email and password are required'
            }), 400

        user = User.query.filter_by(email=data['email']).first()

        if not user or not user.check_password(data['password']):
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Invalid email or password'
            }), 401

        token = create_access_token(identity=str(user.id))

        return jsonify({
            'success': True,
            'data': {
                'user': user.to_dict(),
                'access_token': token
            },
            'message': 'Login successful'
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Login failed: {str(e)}'
        }), 500


@auth_bp.route('/google', methods=['POST'])
def google_auth():
    """Google OAuth placeholder — validates token and creates/logs in user."""
    try:
        data = request.get_json()
        google_token = data.get('token')

        if not google_token:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'Google token is required'
            }), 400

        # TODO: Verify Google token with Google API
        # For now, return a placeholder response
        return jsonify({
            'success': False,
            'data': None,
            'message': 'Google OAuth not yet configured. Add GOOGLE_CLIENT_ID to .env'
        }), 501

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': f'Google auth failed: {str(e)}'
        }), 500


@auth_bp.route('/linkedin', methods=['POST'])
def linkedin_auth():
    """LinkedIn OAuth placeholder — validates token and creates/logs in user."""
    try:
        data = request.get_json()
        linkedin_token = data.get('token')

        if not linkedin_token:
            return jsonify({
                'success': False,
                'data': None,
                'message': 'LinkedIn token is required'
            }), 400

        # TODO: Verify LinkedIn token with LinkedIn API
        return jsonify({
            'success': False,
            'data': None,
            'message': 'LinkedIn OAuth not yet configured. Add LINKEDIN_CLIENT_ID to .env'
        }), 501

    except Exception as e:
        return jsonify({
            'success': False,
            'data': None,
            'message': f'LinkedIn auth failed: {str(e)}'
        }), 500
