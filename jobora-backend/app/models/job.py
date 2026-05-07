from datetime import datetime, timezone
from app import db


class Job(db.Model):
    """Job listing posted by a recruiter."""

    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    skills_required = db.Column(db.Text, nullable=True)  # Comma-separated skills
    salary_min = db.Column(db.Integer, nullable=True)
    salary_max = db.Column(db.Integer, nullable=True)
    location = db.Column(db.String(200), nullable=True)
    job_type = db.Column(db.Enum('full-time', 'part-time', 'remote', 'contract', name='job_type'), default='full-time')
    experience_min = db.Column(db.Integer, default=0)
    recruiter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('active', 'paused', 'closed', name='job_status'), default='active')
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    applications = db.relationship('Application', backref='job', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'description': self.description,
            'skills_required': self.skills_required.split(',') if self.skills_required else [],
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'location': self.location,
            'job_type': self.job_type,
            'experience_min': self.experience_min,
            'recruiter_id': self.recruiter_id,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
