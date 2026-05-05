from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User


def role_required(*allowed_roles):
    """
    Decorator that verifies JWT and checks if the user's role
    is in the list of allowed roles.
    
    Usage:
        @role_required('recruiter')
        @role_required('recruiter', 'admin')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                user_id = get_jwt_identity()
                user = User.query.get(user_id)

                if not user:
                    return jsonify({
                        'success': False,
                        'data': None,
                        'message': 'User not found'
                    }), 404

                if user.role not in allowed_roles:
                    return jsonify({
                        'success': False,
                        'data': None,
                        'message': f'Access denied. Required role: {", ".join(allowed_roles)}'
                    }), 403

                return fn(*args, **kwargs)
            except Exception as e:
                return jsonify({
                    'success': False,
                    'data': None,
                    'message': str(e)
                }), 401

        return wrapper
    return decorator


# Convenience decorators
def seeker_required(fn):
    """Restrict endpoint to job seekers only."""
    return role_required('seeker')(fn)


def recruiter_required(fn):
    """Restrict endpoint to recruiters only."""
    return role_required('recruiter')(fn)


def admin_required(fn):
    """Restrict endpoint to admins only."""
    return role_required('admin')(fn)
