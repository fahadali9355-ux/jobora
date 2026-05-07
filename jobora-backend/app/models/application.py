from datetime import datetime, timezone
from app import db


class Application(db.Model):
    """Job application linking a seeker to a job posting."""

    __tablename__ = 'applications'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    seeker_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(
        db.Enum('pending', 'shortlisted', 'rejected', name='application_status'),
        default='pending',
        nullable=False
    )
    match_score = db.Column(db.Float, nullable=True)
    applied_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'job_id': self.job_id,
            'seeker_id': self.seeker_id,
            'status': self.status,
            'match_score': self.match_score,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None,
        }
