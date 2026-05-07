import sys, json
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv('.env')
from app import create_app, db
from app.models.resume import Resume

app = create_app()
with app.app_context():
    r = Resume.query.filter_by(user_id=11).first()
    if r:
        d = r.to_dict()
        pd = d['parsed_data']
        print(f"to_dict parsed_data type: {type(pd).__name__}")
        if isinstance(pd, dict):
            print(f"Keys: {list(pd.keys())}")
            print(f"Skills: {pd.get('skills', [])}")
            print(f"Experience: {str(pd.get('experience', ''))[:100]}")
            print("SUCCESS - data is correctly a dict!")
        else:
            print(f"FAIL - still a string: {str(pd)[:100]}")
