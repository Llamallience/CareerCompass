"""CV Analysis API endpoints."""

import logging
from typing import Optional
from fastapi import APIRouter, UploadFile, File, Form, Body, HTTPException

from scripts.linkedin_scraper import LinkedInJobScraper
from scripts.github_scraper import GitHubProfileScraper

from app.schemas import (
    CourseRecommendationRequest,
    CourseRecommendationResponse,
    LearningResource,
    CandidateProfileResponse,
)
from app.config import get_settings
from app.llm_client import LLMOperations, LLMClientManager
from app.utils import (
    CVValidator,
    PDFExtractor,
    LLMResponseFormatter,
    generate_profile_id,
)

router = APIRouter()
logger = logging.getLogger(__name__)
settings = get_settings()

# System prompt for CV analysis
SYSTEM_PROMPT = """
You are an expert HR consultant specializing in AI and tech roles. Your task is to analyze CVs against job postings and provide structured, insightful feedback. Be thorough, professional, and provide actionable advice in the specified JSON format. Focus on accurate skill matching, realistic recommendations, and constructive comments.
"""

# Initialize LLM clients and operations
try:
    llm_manager = LLMClientManager()
    llm_ops = LLMOperations()
except Exception as e:
    logger.error(f"Failed to initialize LLM clients: {e}")
    llm_manager = None
    llm_ops = None

# In-memory storage for candidate profiles (use database in production)
candidate_profiles: dict = {}


# ===== CV ANALYSIS ENDPOINTS =====

@router.post("/analyze")
async def analyze_cv(
    cv_file: UploadFile = File(...),
    job_posting: str = Form(...)
) -> dict:
    """
    Analyze CV against job posting.
    """
    if llm_ops is None:
        raise HTTPException(status_code=500, detail="LLM service is not available")
    
    cv_content = await PDFExtractor.extract_text_from_pdf(await cv_file.read())
    is_cv, cv_error = CVValidator.is_cv_document(cv_content)
    
    if not is_cv:
        return {
            "analysis_results": {
                "match_score": {"value": 0, "unit": "percentage"},
                "target_role": "",
                "strong_skills": [],
                "strong_skills_comment": "",
                "skills_to_develop": [],
                "skills_to_develop_comment": ""
            },
            "suggested_learning_resources": [],
            "is_cv": False,
            "error_message": cv_error
        }
    
    result = await llm_ops.analyze_cv_with_job(cv_content, job_posting, SYSTEM_PROMPT)
    result["is_cv"] = True
    result["error_message"] = None
    
    logger.info("Successfully analyzed CV")
    return result


@router.post("/analyze_linkedin")
async def analyze_linkedin(
    cv_file: UploadFile = File(...),
    linkedin_url: str = Form(...)
) -> dict:
    """Analyze CV against LinkedIn job posting."""
    if llm_ops is None:
        raise HTTPException(status_code=500, detail="LLM service is not available")
    
    cv_content = await PDFExtractor.extract_text_from_pdf(await cv_file.read())
    is_cv, cv_error = CVValidator.is_cv_document(cv_content)
    
    if not is_cv:
        return {
            "success": False,
            "is_cv": False,
            "error_message": cv_error,
            "data": None
        }
    
    try:
        scraper = LinkedInJobScraper()
        job_data = scraper.scrape_job(linkedin_url)
        
        if not job_data:
            return {
                "success": False,
                "is_cv": True,
                "error_message": "Failed to scrape the provided LinkedIn URL.",
                "data": None
            }
        
        job_posting_text = LLMResponseFormatter.build_job_posting_text(job_data)
        if not job_posting_text:
            return {
                "success": False,
                "is_cv": True,
                "error_message": "Scraped job posting had no usable text.",
                "data": None
            }
        
        logger.info(f"Successfully scraped and analyzing LinkedIn job")
        
    except Exception as e:
        logger.error(f"LinkedIn scraping failed: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to scrape LinkedIn: {str(e)}")
    
    result = await llm_ops.analyze_cv_with_job(cv_content, job_posting_text, SYSTEM_PROMPT)
    result["is_cv"] = True
    result["error_message"] = None
    
    return {"success": True, "is_cv": True, "error_message": None, "data": result}


@router.post("/recommend_courses", response_model=CourseRecommendationResponse)
async def recommend_courses(payload: CourseRecommendationRequest) -> CourseRecommendationResponse:
    """Recommend courses based on skills and role."""
    if llm_ops is None:
        raise HTTPException(status_code=500, detail="LLM service is not available")
    
    result = await llm_ops.recommend_courses(
        target_role=payload.target_role,
        skills=payload.skills,
        level=payload.level,
        count=payload.count
    )
    
    courses = [
        LearningResource(**course) 
        for course in result.get("courses", [])
    ]
    
    logger.info(f"Generated {len(courses)} course recommendations")
    return CourseRecommendationResponse(courses=courses)


@router.post("/analyze_candidate", response_model=CandidateProfileResponse)
async def analyze_candidate(
    cv_file: Optional[UploadFile] = File(None),
    github_url: Optional[str] = Form(None),
    linkedin_url: Optional[str] = Form(None)
) -> CandidateProfileResponse:
    """Analyze complete candidate profile."""
    if not cv_file and not github_url and not linkedin_url:
        raise HTTPException(
            status_code=400,
            detail="At least one of CV, GitHub URL, or LinkedIn URL must be provided"
        )
    
    if llm_ops is None:
        raise HTTPException(status_code=500, detail="LLM service is not available")
    
    profile_data = {}
    cv_text = ""
    
    if cv_file:
        try:
            cv_content = await cv_file.read()
            cv_text = await PDFExtractor.extract_text_from_pdf(cv_content)
            profile_data['cv_text'] = cv_text
            logger.info("Successfully extracted CV text")
        except Exception as e:
            logger.error(f"Failed to read CV: {e}")
            raise HTTPException(status_code=400, detail=f"Failed to read CV: {str(e)}")
    
    github_data = None
    if github_url:
        try:
            github_scraper = GitHubProfileScraper()
            github_data = github_scraper.scrape_profile(github_url)
            if github_data:
                profile_data['github_data'] = github_data
                logger.info(f"Successfully scraped GitHub profile")
        except Exception as e:
            logger.warning(f"GitHub scraping failed: {e}")
    
    linkedin_data = None
    if linkedin_url:
        try:
            linkedin_scraper = LinkedInJobScraper()
            linkedin_data = linkedin_scraper.scrape_job(linkedin_url)
            if linkedin_data:
                profile_data['linkedin_data'] = linkedin_data
                logger.info(f"Successfully scraped LinkedIn profile")
        except Exception as e:
            logger.warning(f"LinkedIn scraping failed: {e}")
    
    summary = await llm_ops.generate_candidate_summary(cv_text, github_data, linkedin_data)
    
    candidate_name = "Unknown"
    if github_data and github_data.get('name'):
        candidate_name = github_data['name']
    elif linkedin_data and linkedin_data.get('title'):
        candidate_name = linkedin_data['title']
    
    profile_id = generate_profile_id(cv_text, github_url, linkedin_url)
    candidate_profiles[profile_id] = profile_data
    
    logger.info(f"Created candidate profile: {profile_id}")
    
    return CandidateProfileResponse(
        profile_id=profile_id,
        candidate_name=candidate_name,
        summary=summary,
        github_data=github_data,
        linkedin_data=linkedin_data,
        cv_text=cv_text[:500] + "..." if len(cv_text) > 500 else cv_text
    )
