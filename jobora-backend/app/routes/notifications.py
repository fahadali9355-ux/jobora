from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.notification import Notification

notifications_bp = Blueprint('notifications', __name__)


@notifications_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get all notifications for the authenticated user."""
    try:
        user_id = get_jwt_identity()
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)

        query = Notification.query.filter_by(user_id=int(user_id)).order_by(
            Notification.created_at.desc()
        )

        total = query.count()
        notifications = query.offset((page - 1) * per_page).limit(per_page).all()
        unread_count = Notification.query.filter_by(user_id=int(user_id), is_read=False).count()

        return jsonify({
            'success': True,
            'data': [n.to_dict() for n in notifications],
            'unread_count': unread_count,
            'total': total,
            'message': f'{len(notifications)} notifications'
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'data': None, 'message': str(e)}), 500


@notifications_bp.route('/notifications/read', methods=['PATCH'])
@jwt_required()
def mark_all_read():
    """Mark all notifications as read for the authenticated user."""
    try:
        user_id = get_jwt_identity()
        Notification.query.filter_by(user_id=int(user_id), is_read=False).update({'is_read': True})
        db.session.commit()
        return jsonify({'success': True, 'message': 'All notifications marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


@notifications_bp.route('/notifications/<int:notification_id>/read', methods=['PATCH'])
@jwt_required()
def mark_one_read(notification_id):
    """Mark a single notification as read."""
    try:
        user_id = get_jwt_identity()
        n = Notification.query.filter_by(id=notification_id, user_id=int(user_id)).first()
        if not n:
            return jsonify({'success': False, 'message': 'Not found'}), 404
        n.is_read = True
        db.session.commit()
        return jsonify({'success': True, 'data': n.to_dict(), 'message': 'Marked as read'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500


# --- Helper to create notifications from other parts of the app ---
def create_notification(user_id: int, title: str, message: str, notif_type: str = 'info', link: str = None):
    """Utility function to create a notification for a user."""
    try:
        n = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notif_type,
            link=link
        )
        db.session.add(n)
        db.session.flush()  # Flush but don't commit — let the caller commit
        return n
    except Exception as e:
        print(f"Error creating notification: {e}")
        return None
