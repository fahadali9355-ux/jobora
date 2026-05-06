from app import create_app, db
from app.models.resume import Resume
from app.ai.resume_ranker import extract_text_from_file, parse_resume
import json

app = create_app()
with app.app_context():
    resume = Resume.query.filter_by(user_id=4).first()
    
    raw_text = extract_text_from_file(resume.file_path)
    print('Text length:', len(raw_text))
    print('First 500 chars:', raw_text[:500])
    
    if len(raw_text) < 10:
        print('PDF is image-based! Text extraction failed.')
    else:
        parsed = parse_resume(raw_text)
        print('Parsed:', json.dumps(parsed, indent=2))