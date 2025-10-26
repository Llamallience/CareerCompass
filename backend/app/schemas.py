"""Pydantic models and schemas for API responses and requests."""

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional


# ===== CV Analysis Models =====

class MatchScore(BaseModel):
    """Match score between CV and job posting."""
    value: int = Field(..., ge=0, le=100, description="Score from 0 to 100")
    unit: str = Field(default="percentage", description="Unit of measurement")


class AnalysisResults(BaseModel):
    """Results from CV analysis."""
    match_score: MatchScore
    target_role: str
    strong_skills: list[str]
    strong_skills_comment: str
    skills_to_develop: list[str]
    skills_to_develop_comment: str


class LearningResource(BaseModel):
    """Recommended learning resource."""
    title: str
    category: str
    tags: list[str]
    link: str


class ResponseModel(BaseModel):
    """Standard response for CV analysis."""
    analysis_results: AnalysisResults
    suggested_learning_resources: list[LearningResource]
    is_cv: bool
    error_message: Optional[str] = None


class LinkedInRequest(BaseModel):
    """Request to analyze LinkedIn job posting."""
    linkedin_url: str = Field(..., description="LinkedIn job posting URL")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {"linkedin_url": "https://www.linkedin.com/jobs/view/4311472156"}
            ]
        }
    }


# ===== Course Recommendation Models =====

class CourseRecommendationRequest(BaseModel):
    """Request for course recommendations."""
    target_role: Optional[str] = Field(None, description="Target job role")
    skills: Optional[list[str]] = Field(None, description="Skills to focus on")
    level: Optional[str] = Field(None, description="Level: beginner, intermediate, or advanced")
    count: int = Field(default=5, ge=1, le=20, description="Number of courses to recommend")


class CourseRecommendationResponse(BaseModel):
    """Response with recommended courses."""
    courses: list[LearningResource]


# ===== Candidate Profile Models =====

class CandidateProfileRequest(BaseModel):
    """Request to analyze candidate profile."""
    github_url: Optional[HttpUrl] = Field(None, description="GitHub profile URL")
    linkedin_url: Optional[HttpUrl] = Field(None, description="LinkedIn profile URL")


class CandidateProfileResponse(BaseModel):
    """Complete candidate profile response."""
    profile_id: str = Field(..., description="Unique profile identifier")
    candidate_name: str
    summary: str
    github_data: Optional[dict] = None
    linkedin_data: Optional[dict] = None
    cv_text: Optional[str] = None


class ChatWithCandidateRequest(BaseModel):
    """Request to chat with candidate AI profile."""
    profile_id: str = Field(..., description="Profile ID from analyze_candidate")
    question: str = Field(..., description="Question for the candidate")
    use_web_search: bool = Field(default=False, description="Enable web search for answers")


class ChatWithCandidateResponse(BaseModel):
    """Response from candidate AI chat."""
    answer: str
    sources: Optional[list[str]] = None


# ===== Job Search Models =====

class SearchRequest(BaseModel):
    """Request to search jobs."""
    natural_query: str
    limit: int = Field(default=25, ge=1, le=100)
    description_weight: Optional[float] = None
    title_weight: Optional[float] = None
    description: Optional[str] = None
    similar_description_weight: Optional[float] = None
    title: Optional[str] = None
    similar_title_weight: Optional[float] = None
    states_include: Optional[list[str]] = None
    states_exclude: Optional[list[str]] = None
    search_cities_include: Optional[list[str]] = None
    search_cities_exclude: Optional[list[str]] = None
    search_countries_include: Optional[list[str]] = None
    search_countries_exclude: Optional[list[str]] = None
    companies_include: Optional[list[str]] = None
    companies_exclude: Optional[list[str]] = None
    job_levels_include: Optional[list[str]] = None
    job_levels_exclude: Optional[list[str]] = None
    job_types_include: Optional[list[str]] = None
    job_types_exclude: Optional[list[str]] = None
    job_categories_include: Optional[list[str]] = None
    job_categories_exclude: Optional[list[str]] = None
    job_skills_include: Optional[list[str]] = None
    job_skills_exclude: Optional[list[str]] = None


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    error_code: Optional[str] = None
    timestamp: Optional[str] = None
