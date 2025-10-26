"""Utility functions for common operations."""

import json
import logging
from io import BytesIO
from typing import Optional, Tuple
import hashlib
import pdfplumber
from fastapi import HTTPException

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class CVValidator:
    """Utility class for CV validation."""
    
    @staticmethod
    def is_cv_document(text: str) -> Tuple[bool, str]:
        """
        Check if the extracted text appears to be a CV/resume.
        
        Args:
            text: Extracted text from document
            
        Returns:
            (is_cv: bool, error_message: str)
        """
        text_lower = text.lower()
        keyword_count = sum(
            1 for keyword in settings.CV_KEYWORDS 
            if keyword in text_lower
        )
        
        if keyword_count >= settings.CV_KEYWORD_THRESHOLD:
            return True, ""
        
        if len(text.strip()) < settings.CV_MIN_LENGTH:
            return False, f"Document is too short to be a valid CV (minimum {settings.CV_MIN_LENGTH} characters)"
        
        return False, "Document does not appear to contain CV/resume content"


class PDFExtractor:
    """Utility class for PDF extraction."""
    
    @staticmethod
    async def extract_text_from_pdf(file_content: bytes) -> str:
        """
        Extract text from PDF file.
        
        Args:
            file_content: Raw bytes of PDF file
            
        Returns:
            Extracted text from all pages
            
        Raises:
            HTTPException: If PDF cannot be read or has invalid format
        """
        try:
            with pdfplumber.open(BytesIO(file_content)) as pdf:
                text = ""
                for page in pdf.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
                
                if not text.strip():
                    logger.warning("PDF file is empty or contains no text")
                    raise HTTPException(
                        status_code=400,
                        detail="Could not extract text from PDF"
                    )
                
                return text
        except pdfplumber.exceptions.PDFException as e:
            logger.error(f"PDF parsing error: {e}")
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file or could not extract text"
            )
        except Exception as e:
            logger.error(f"Unexpected error during PDF extraction: {e}")
            raise HTTPException(
                status_code=400,
                detail=f"Failed to process PDF: {str(e)}"
            )


class LLMResponseFormatter:
    """Utility class for formatting LLM responses."""
    
    @staticmethod
    def build_job_posting_text(job: dict) -> str:
        """
        Construct human-readable job posting text from scraper output.
        
        Args:
            job: Job data dictionary from scraper
            
        Returns:
            Formatted job posting text
        """
        parts = []
        
        # Build header
        title = job.get('title') or ''
        company = job.get('company') or ''
        location = job.get('location') or ''
        header_parts = [p for p in [title, company, location] if p]
        if header_parts:
            parts.append(f"Job: {' | '.join(header_parts)}")
        
        # Add sections
        if job.get('company_description'):
            parts.append(f"Company Description:\n{job['company_description']}")
        if job.get('role_description'):
            parts.append(f"Role Description:\n{job['role_description']}")
        if job.get('description'):
            parts.append(f"Job Description:\n{job['description']}")
        
        # Add qualifications
        quals = job.get('qualifications') or []
        if isinstance(quals, list) and quals:
            parts.append("Qualifications:\n- " + "\n- ".join(quals))
        
        return "\n\n".join(parts).strip()
    
    @staticmethod
    def build_candidate_context(cv_text: str, github_data: dict, linkedin_data: dict) -> str:
        """
        Build context string for candidate AI chatbot.
        
        Args:
            cv_text: CV content
            github_data: GitHub profile data
            linkedin_data: LinkedIn profile data
            
        Returns:
            Formatted context string
        """
        context_parts = [
            "You are answering questions on behalf of a job candidate. "
            "Use the following information to answer accurately and professionally.\n"
        ]
        
        if cv_text:
            context_parts.append(f"CV/Resume:\n{cv_text[:3000]}")
        
        if github_data:
            github_str = _format_github_data(github_data)
            context_parts.append(f"GitHub Profile Summary:\n{github_str}")
        
        if linkedin_data:
            linkedin_str = json.dumps(linkedin_data, indent=2)[:1000]
            context_parts.append(f"LinkedIn Profile:\n{linkedin_str}")
        
        context_parts.append(
            "\nAnswer the employer's question professionally, accurately, and concisely. "
            "If you don't have information to answer, say so honestly."
        )
        
        return "\n\n".join(context_parts)


def _format_github_data(github_data: dict) -> str:
    """Format GitHub data for display."""
    return f"""- Username: {github_data.get('username', 'N/A')}
- Name: {github_data.get('name', 'N/A')}
- Bio: {github_data.get('bio', 'N/A')}
- Location: {github_data.get('location', 'N/A')}
- Public Repos: {github_data.get('public_repos', 0)}
- Followers: {github_data.get('followers', 0)}
- Languages: {', '.join(github_data.get('languages', {}).keys()) if github_data.get('languages') else 'N/A'}
- Top Repositories: {json.dumps(github_data.get('top_repositories', [])[:3], indent=2)}
- Recent Activity: {github_data.get('recent_activity', 'N/A')}"""


def generate_profile_id(cv_text: str, github_url: Optional[str], linkedin_url: Optional[str]) -> str:
    """
    Generate unique profile ID.
    
    Args:
        cv_text: CV content
        github_url: GitHub URL
        linkedin_url: LinkedIn URL
        
    Returns:
        12-character hash ID
    """
    combined = f"{cv_text[:100]}{github_url or ''}{linkedin_url or ''}"
    return hashlib.md5(combined.encode()).hexdigest()[:12]


def parse_request_dict(data: dict) -> dict:
    """
    Clean request dictionary by removing None values.
    
    Args:
        data: Raw request data
        
    Returns:
        Cleaned dictionary with non-None values
    """
    return {k: v for k, v in data.items() if v is not None}
