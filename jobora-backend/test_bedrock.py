import os, sys
sys.path.insert(0, '.')
from dotenv import load_dotenv
load_dotenv('.env')

from app.ai.bedrock_client import invoke_claude
import json

test_resume = "John Doe\njohn.doe@email.com | +1-555-123-4567\nSoftware Engineer with 5 years of experience\nSkills: Python, React, PostgreSQL, Docker\nEducation: BSc Computer Science, MIT 2019\nExperience: Senior Developer at Google 2021-2024"

prompt = "Extract the following information from this resume. Return ONLY a raw valid JSON object with no markdown. Required keys: name, email, phone, skills (array), experience_years (int), experience (string), education (string). If not found use empty string/array/0.\n\nResume:\n" + test_resume

try:
    result = invoke_claude(prompt, max_tokens=500)
    print('RAW RESPONSE:', repr(result))
    cleaned = result.strip()
    if cleaned.startswith("```"): cleaned = cleaned.split("```")[1]
    if cleaned.endswith("```"): cleaned = cleaned.rsplit("```", 1)[0]
    if cleaned.startswith("json"): cleaned = cleaned[4:]
    data = json.loads(cleaned.strip())
    print('PARSED OK:', json.dumps(data, indent=2))
except Exception as e:
    print('ERROR:', type(e).__name__, str(e))
