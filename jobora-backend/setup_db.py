import os
import pymysql
import urllib.parse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_database():
    """Connect to MySQL and create database if not exists."""
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        print("DATABASE_URL not found in .env")
        return False
        
    parsed = urllib.parse.urlparse(db_url)
    
    db_name = parsed.path.lstrip('/')
    user = parsed.username or 'root'
    password = parsed.password or ''
    host = parsed.hostname or 'localhost'
    port = parsed.port or 3306

    print(f"Connecting to MySQL server at {host}:{port}...")
    try:
        connection = pymysql.connect(host=host, user=user, password=password, port=port)
        cursor = connection.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name};")
        connection.commit()
        cursor.close()
        connection.close()
        print(f"Database '{db_name}' ensured to exist.")
        return True
    except Exception as e:
        print(f"Failed to create database: {e}")
        return False

def seed_data():
    from app import create_app, db
    from app.models.user import User
    from app.models.job import Job
    
    app = create_app()
    with app.app_context():
        # db.create_all() is called to explicitly create tables per requirements
        db.create_all()
        print("Tables created using SQLAlchemy's db.create_all().")

        # Migrate: add 'status' column to users if it doesn't already exist
        try:
            db.session.execute(db.text("ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active'"))
            db.session.commit()
            print("Migrated: added 'status' column to users table.")
        except Exception:
            db.session.rollback()
            print("'status' column already exists — skipping migration.")
        
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
                
        # Fix any existing users with null or incorrect status
        db.session.execute(db.text("UPDATE users SET status='active' WHERE status IS NULL OR status='suspended'"))
        print("Fixed existing users — all set to 'active' status.")

        db.session.commit()
        print("Database setup and seeding completed successfully!")

if __name__ == '__main__':
    if create_database():
        seed_data()
