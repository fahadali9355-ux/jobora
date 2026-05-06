"""
Jobora AI Resume Ranker Module
===============================
Provides resume parsing, keyword extraction, and AI-powered candidate matching
using NLP (spaCy), TF-IDF (scikit-learn), and sentence embeddings (BERT).
"""

import re
import os
import numpy as np
import pytesseract
import fitz  # PyMuPDF
from PIL import Image
import io

# Set Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


# ──────────────────────────────────────────────────────────
# 1. TEXT EXTRACTION — Support PDF and DOCX formats
# ──────────────────────────────────────────────────────────

def extract_text_from_file(file_path: str) -> str:
    """Extract text from PDF (digital or scanned) or DOCX file."""
    if not os.path.exists(file_path):
        return ''
        
    ext = file_path.rsplit('.', 1)[-1].lower()
    
    if ext == 'pdf':
        try:
            doc = fitz.open(file_path)
            text = ''
            for page in doc:
                # Try digital text first
                page_text = page.get_text()
                if page_text.strip():
                    text += page_text
                else:
                    # Scanned page - use OCR
                    pix = page.get_pixmap(dpi=300)
                    img_data = pix.tobytes('png')
                    img = Image.open(io.BytesIO(img_data))
                    text += pytesseract.image_to_string(img)
            doc.close()
            return text.strip()
        except Exception:
            return ''
    
    elif ext in ['doc', 'docx']:
        try:
            import docx
            doc = docx.Document(file_path)
            return '\n'.join([para.text for para in doc.paragraphs]).strip()
        except Exception:
            return ''
    
    return ''


# ──────────────────────────────────────────────────────────
# 2. RESUME PARSING — Extract structured data using NLP
# ──────────────────────────────────────────────────────────

def parse_resume(text: str) -> dict:
    """
    Parse resume text and extract structured information using spaCy NER
    and regex patterns.
    
    Extracts:
        - name: Candidate's full name (from NER PERSON entity)
        - email: Email address (regex)
        - phone: Phone number (regex)
        - skills: List of identified technical/soft skills
        - experience: List of work experiences (company, title, duration)
        - education: List of educational qualifications
        - total_years_experience: Estimated total years of experience
    
    Args:
        text: Raw resume text string.
    
    Returns:
        Dictionary containing all extracted fields.
    """
    import spacy

    # Load spaCy model — use small model for speed
    try:
        nlp = spacy.load('en_core_web_sm')
    except OSError:
        # If model not downloaded, download it first
        from spacy.cli import download
        download('en_core_web_sm')
        nlp = spacy.load('en_core_web_sm')

    doc = nlp(text)

    # --- Extract name (first PERSON entity found) ---
    name = ''
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            name = ent.text
            break

    # --- Extract email via regex ---
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    email = emails[0] if emails else ''

    # --- Extract phone via regex ---
    phone_pattern = r'[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{7,15}'
    phones = re.findall(phone_pattern, text)
    phone = phones[0].strip() if phones else ''

    # --- Extract skills ---
    # Common technical and soft skills to look for
    common_skills = [
        'python', 'java', 'javascript', 'typescript', 'react', 'angular', 'vue',
        'node.js', 'express', 'django', 'flask', 'spring', 'sql', 'nosql',
        'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
        'aws', 'azure', 'gcp', 'git', 'ci/cd', 'rest', 'graphql', 'html',
        'css', 'sass', 'tailwind', 'bootstrap', 'figma', 'sketch',
        'machine learning', 'deep learning', 'nlp', 'computer vision',
        'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
        'data analysis', 'data science', 'agile', 'scrum', 'jira',
        'leadership', 'communication', 'teamwork', 'problem solving',
        'c++', 'c#', 'rust', 'go', 'swift', 'kotlin', 'php', 'ruby',
        'r', 'scala', 'hadoop', 'spark', 'tableau', 'power bi',
    ]
    text_lower = text.lower()
    skills = [skill for skill in common_skills if skill in text_lower]

    # --- Extract experience (heuristic: look for ORG entities near DATE entities) ---
    experience = []
    orgs = [ent.text for ent in doc.ents if ent.label_ == 'ORG']
    # Deduplicate while preserving order
    seen_orgs = set()
    unique_orgs = []
    for org in orgs:
        if org.lower() not in seen_orgs:
            seen_orgs.add(org.lower())
            unique_orgs.append(org)

    for org in unique_orgs[:5]:  # Limit to top 5
        experience.append({
            'company': org,
            'title': '',  # Would need more context to extract accurately
            'duration': ''
        })

    # --- Extract education ---
    education = []
    edu_keywords = ['bachelor', 'master', 'phd', 'b.s.', 'm.s.', 'b.a.', 'm.a.',
                    'mba', 'b.tech', 'm.tech', 'b.e.', 'm.e.', 'diploma',
                    'university', 'college', 'institute', 'school']
    for sent in doc.sents:
        sent_lower = sent.text.lower()
        if any(kw in sent_lower for kw in edu_keywords):
            education.append(sent.text.strip())

    # --- Estimate total years of experience ---
    year_patterns = re.findall(r'(\d+)\s*(?:\+\s*)?years?', text_lower)
    total_years = max([int(y) for y in year_patterns], default=0)

    return {
        'name': name,
        'email': email,
        'phone': phone,
        'skills': skills,
        'experience': experience,
        'education': education[:5],  # Limit
        'total_years_experience': total_years,
    }


# ──────────────────────────────────────────────────────────
# 3. TF-IDF KEYWORD EXTRACTION
# ──────────────────────────────────────────────────────────

def extract_keywords_tfidf(text: str, top_n: int = 20) -> list:
    """
    Extract the most important keywords from text using TF-IDF scoring.
    """
    if not text or len(text.strip()) < 10:
        return []
        
    try:
        from sklearn.feature_extraction.text import TfidfVectorizer

        # Use a single document — TF-IDF still gives term importance scores
        vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words='english',
            ngram_range=(1, 2),  # Include bigrams for phrases like "machine learning"
            min_df=1,
            max_df=1.0
        )

        tfidf_matrix = vectorizer.fit_transform([text])
        feature_names = vectorizer.get_feature_names_out()
        scores = tfidf_matrix.toarray().flatten()

        # Sort by score descending
        top_indices = np.argsort(scores)[::-1][:top_n]
        keywords = [feature_names[i] for i in top_indices if scores[i] > 0]

        return keywords
    except Exception:
        return []


# ──────────────────────────────────────────────────────────
# 4. BERT-BASED SEMANTIC MATCHING
# ──────────────────────────────────────────────────────────

def calculate_match_score(resume_text: str, job_description: str) -> float:
    """
    Calculate semantic similarity between a resume and job description
    using sentence-transformers (BERT-based model).
    
    Uses the lightweight 'all-MiniLM-L6-v2' model which provides
    a good balance between accuracy and speed. Computes cosine similarity
    between the document embeddings.
    
    Args:
        resume_text: Full text of the candidate's resume.
        job_description: Full text of the job posting.
    
    Returns:
        Match score as a float between 0 and 100.
        Higher scores indicate better semantic alignment.
    """
    from sentence_transformers import SentenceTransformer, util

    # Load model (cached after first download — ~80MB)
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Generate embeddings for both documents
    resume_embedding = model.encode(resume_text, convert_to_tensor=True)
    job_embedding = model.encode(job_description, convert_to_tensor=True)

    # Compute cosine similarity
    cosine_score = util.cos_sim(resume_embedding, job_embedding)

    # Convert to 0-100 scale
    # Cosine similarity ranges from -1 to 1, but for text it's typically 0 to 1
    score = float(cosine_score[0][0]) * 100
    return round(max(0, min(100, score)), 2)


# ──────────────────────────────────────────────────────────
# 5. BATCH CANDIDATE RANKING
# ──────────────────────────────────────────────────────────

def rank_candidates(job_description: str, resumes: list) -> list:
    """
    Rank multiple candidates against a job description using BERT matching.
    
    Processes all resumes in batch for efficiency, computes match scores,
    and returns candidates sorted by score (highest first).
    
    Args:
        job_description: Full text of the job posting.
        resumes: List of dicts, each containing:
            - user_id (int): The candidate's user ID
            - resume_text (str): Full text of their resume
    
    Returns:
        Sorted list of dicts (highest match first), each containing:
            - user_id (int)
            - resume_text (str)
            - match_score (float): Score between 0 and 100
    
    Example:
        >>> resumes = [
        ...     {"user_id": 1, "resume_text": "5 years React experience..."},
        ...     {"user_id": 2, "resume_text": "Data scientist with Python..."},
        ... ]
        >>> ranked = rank_candidates("Looking for React developer...", resumes)
        >>> print(ranked[0]['match_score'])  # Highest match first
        87.5
    """
    from sentence_transformers import SentenceTransformer, util

    if not resumes:
        return []

    # Load model once for all comparisons
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Encode job description
    job_embedding = model.encode(job_description, convert_to_tensor=True)

    # Encode all resumes in batch (much faster than one-by-one)
    resume_texts = [r['resume_text'] for r in resumes]
    resume_embeddings = model.encode(resume_texts, convert_to_tensor=True)

    # Compute cosine similarities
    similarities = util.cos_sim(job_embedding, resume_embeddings)[0]

    # Add match scores to results
    results = []
    for i, resume in enumerate(resumes):
        score = float(similarities[i]) * 100
        results.append({
            'user_id': resume['user_id'],
            'resume_text': resume['resume_text'],
            'match_score': round(max(0, min(100, score)), 2)
        })

    # Sort by match_score descending
    results.sort(key=lambda x: x['match_score'], reverse=True)

    return results
