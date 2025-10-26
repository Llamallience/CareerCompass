"""Application configuration and settings."""

import os
from functools import lru_cache
from typing import Optional
from pydantic import BaseModel
import logging


class Settings(BaseModel):
    """Application settings from environment variables."""
    
    # API Configuration
    APP_NAME: str = "Job Search API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    
    # Groq/LLM Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_BASE_URL: str = os.getenv("GROQ_BASE_URL", "https://api.groq.com/openai/v1")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # Superlinked Configuration
    SUPERLINKED_URL: str = os.getenv("SUPERLINKED_URL", "http://superlinked:8080")
    SUPERLINKED_TIMEOUT: float = float(os.getenv("SUPERLINKED_TIMEOUT", "60.0"))
    
    # Request Configuration
    DEFAULT_SEARCH_LIMIT: int = 25
    MAX_SEARCH_LIMIT: int = 100
    REQUEST_TIMEOUT: float = 30.0
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_FILE_TYPES: list[str] = ["application/pdf"]
    
    # LLM Configuration
    LLM_TEMPERATURE: float = 0.7
    LLM_COURSE_TEMPERATURE: float = 0.4
    MAX_TOKENS: int = 800
    
    # CV Analysis Configuration
    CV_MIN_LENGTH: int = 200
    CV_KEYWORD_THRESHOLD: int = 3
    CV_KEYWORDS: list[str] = [
        'experience', 'education', 'skills', 'resume', 'cv', 'curriculum vitae',
        'work experience', 'professional experience', 'qualifications',
        'summary', 'objective', 'profile', 'contact', 'email', 'phone',
        'projects', 'certifications', 'languages', 'references'
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get application settings (cached)."""
    return Settings()


def setup_logging() -> logging.Logger:
    """Configure logging for the application."""
    settings = get_settings()
    
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            # Uncomment for file logging in production
            # logging.FileHandler('app.log')
        ]
    )
    
    return logging.getLogger(__name__)


logger = setup_logging()
