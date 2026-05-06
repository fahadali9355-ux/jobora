import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def seed_data():
    from app import create_app, db
    from app.models.user import User
    from app.models.job import Job
    
    app = create_app()
    with app.app_context():
        # db.create_all() is called to explicitly create tables per requirements
        db.create_all()
        print("Tables created using SQLAlchemy's db.create_all().")

        # Admin user
        admin = User.query.filter_by(email='admin@jobora.com').first()
        if not admin:
            admin = User(name='Admin', email='admin@jobora.com', role='admin', status='active')
            admin.set_password('Admin@123')
            db.session.add(admin)
            print("Inserted Admin user (admin@jobora.com).")
            
        # Recruiter
        recruiter = User.query.filter_by(email='recruiter@jobora.com').first()
        if not recruiter:
            recruiter = User(name='TechCorp HR', email='recruiter@jobora.com', role='recruiter', status='active')
            recruiter.set_password('Test@123')
            db.session.add(recruiter)
            db.session.commit() # Commit to generate recruiter ID
            print("Inserted Recruiter user (recruiter@jobora.com).")
        
        # Job Seeker
        seeker = User.query.filter_by(email='seeker@jobora.com').first()
        if not seeker:
            seeker = User(name='John Doe', email='seeker@jobora.com', role='seeker', status='active')
            seeker.set_password('Test@123')
            db.session.add(seeker)
            print("Inserted Job Seeker user (seeker@jobora.com).")
            
        # Add sample jobs for recruiter
        recruiter = User.query.filter_by(email='recruiter@jobora.com').first()
        if recruiter:
            jobs_count = Job.query.filter_by(recruiter_id=recruiter.id).count()
            if jobs_count == 0:
                job1 = Job(
                    title='Software Engineer', 
                    company='TechCorp', 
                    description='Build scalable web applications.',
                    skills_required='Python,Flask,React',
                    salary_min=80000,
                    salary_max=120000,
                    location='New York, NY',
                    recruiter_id=recruiter.id
                )
                job2 = Job(
                    title='Data Scientist', 
                    company='TechCorp', 
                    description='Analyze large datasets to extract insights.',
                    skills_required='Python,SQL,Machine Learning',
                    salary_min=90000,
                    salary_max=140000,
                    location='Remote',
                    recruiter_id=recruiter.id
                )
                job3 = Job(
                    title='Frontend Developer', 
                    company='TechCorp', 
                    description='Create beautiful and responsive UIs.',
                    skills_required='JavaScript,TypeScript,React',
                    salary_min=70000,
                    salary_max=110000,
                    location='San Francisco, CA',
                    recruiter_id=recruiter.id
                )
                db.session.add_all([job1, job2, job3])
                print("Inserted 3 sample jobs.")
                
        db.session.commit()
        print("Database setup and seeding completed successfully!")

if __name__ == '__main__':
    seed_data()
