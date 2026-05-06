from datetime import datetime, timezone
import json
from app import db


class Resume(db.Model):
    """Uploaded resume with parsed data stored as JSON."""

    __tablename__ = 'resumes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    file_path = db.Column(db.String(500), nullable=False)
    parsed_data = db.Column(db.JSON, nullable=True)  # Structured data from AI parsing
    uploaded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'file_path': self.file_path,
            'parsed_data': json.loads(self.parsed_data) if self.parsed_data else None,
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None
        }
