"""LLM client management and operations."""

import logging
import json
from typing import Optional, Any
from fastapi import HTTPException
from openai import OpenAI
from groq import Groq

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class LLMClientManager:
    """Singleton manager for LLM clients."""
    
    _instance = None
    _openai_client: Optional[OpenAI] = None
    _groq_client: Optional[Groq] = None
    
    def __new__(cls):
        """Implement singleton pattern."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize_clients()
        return cls._instance
    
    def _initialize_clients(self) -> None:
        """Initialize LLM clients."""
        # OpenAI-compatible client (Groq)
        try:
            self._openai_client = OpenAI(
                api_key=settings.GROQ_API_KEY,
                base_url=settings.GROQ_BASE_URL
            )
            logger.info("OpenAI-compatible client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}")
            self._openai_client = None
        
        # Native Groq client
        try:
            self._groq_client = Groq(api_key=settings.GROQ_API_KEY)
            logger.info("Groq client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")
            self._groq_client = None
    
    @property
    def openai_client(self) -> OpenAI:
        """Get OpenAI-compatible client."""
        if self._openai_client is None:
            raise HTTPException(
                status_code=500,
                detail="LLM service is not available (OpenAI client)"
            )
        return self._openai_client
    
    @property
    def groq_client(self) -> Groq:
        """Get Groq client."""
        if self._groq_client is None:
            raise HTTPException(
                status_code=500,
                detail="LLM service is not available (Groq client)"
            )
        return self._groq_client
    
    def is_available(self) -> bool:
        """Check if any client is available."""
        return self._openai_client is not None or self._groq_client is not None


class LLMOperations:
    """High-level LLM operations."""
    
    def __init__(self):
        """Initialize with client manager."""
        self.manager = LLMClientManager()
    
    async def analyze_cv_with_job(
        self,
        cv_content: str,
        job_posting: str,
        system_prompt: str
    ) -> dict:
        """
        Analyze CV against job posting using LLM.
        
        Args:
            cv_content: CV text
            job_posting: Job posting text
            system_prompt: System prompt for the model
            
        Returns:
            Analysis results as dictionary
            
        Raises:
            HTTPException: If LLM request fails
        """
        prompt = f"""
Compare the user's CV with the job posting. For strong_skills_comment and skills_to_develop_comment, 
provide detailed advice including specific recommendations for improvement or how to leverage the skills. 
Provide a response in the following JSON schema:

{json.dumps(self._get_response_schema(), indent=2)}

CV:
{cv_content}

Job Posting:
{job_posting}

Provide only the JSON response.
"""
        
        try:
            response = self.manager.openai_client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': prompt}
                ],
                response_format={"type": "json_object"},
                temperature=settings.LLM_TEMPERATURE,
            )
            
            result = json.loads(response.choices[0].message.content)
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response: {e}")
            raise HTTPException(
                status_code=502,
                detail="Invalid response format from LLM"
            )
        except Exception as e:
            logger.error(f"LLM analysis failed: {e}")
            raise HTTPException(
                status_code=502,
                detail={
                    'message': 'Failed to analyze CV',
                    'api_base_url': settings.GROQ_BASE_URL,
                    'model': settings.GROQ_MODEL,
                    'error': str(e)
                }
            )
    
    async def generate_candidate_summary(
        self,
        cv_text: str,
        github_data: Optional[dict],
        linkedin_data: Optional[dict]
    ) -> str:
        """
        Generate professional summary for candidate.
        
        Args:
            cv_text: CV content
            github_data: GitHub profile data
            linkedin_data: LinkedIn profile data
            
        Returns:
            Generated summary string
        """
        summary_prompt = f"""Analyze this candidate's profile and create a concise professional summary (2-3 sentences).

CV Content:
{cv_text[:2000] if cv_text else 'Not provided'}

GitHub Profile:
{json.dumps(github_data, indent=2)[:1000] if github_data else 'Not provided'}

LinkedIn Profile:
{json.dumps(linkedin_data, indent=2)[:1000] if linkedin_data else 'Not provided'}

Provide a professional summary highlighting key strengths, experience, and technical skills."""
        
        try:
            response = self.manager.groq_client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert recruiter creating candidate summaries."
                    },
                    {"role": "user", "content": summary_prompt}
                ],
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.warning(f"Summary generation failed: {e}")
            return "Profile analysis in progress."
    
    async def recommend_courses(
        self,
        target_role: Optional[str],
        skills: Optional[list[str]],
        level: Optional[str],
        count: int
    ) -> dict:
        """
        Generate course recommendations.
        
        Args:
            target_role: Target job role
            skills: Skills to focus on
            level: Experience level
            count: Number of courses to recommend
            
        Returns:
            Dictionary with courses list
            
        Raises:
            HTTPException: If request fails
        """
        constraints = []
        if target_role:
            constraints.append(f"target role: {target_role}")
        if skills:
            constraints.append(f"focus skills: {', '.join(skills)}")
        if level:
            constraints.append(f"level: {level}")
        
        constraint_text = " | ".join(constraints) if constraints else "general upskilling"
        
        user_prompt = f"""Provide {count} course recommendations for {constraint_text}.

Return your response as a JSON object with this exact structure:
{{
  "courses": [
    {{
      "title": "Course Name",
      "category": "Category",
      "tags": ["tag1", "tag2"],
      "link": "https://..."
    }}
  ]
}}

Only return valid JSON, no markdown or explanations."""
        
        sys_prompt = (
            "You are a career coach. Recommend real, popular online courses with direct URLs. "
            "Prefer reputable platforms (Coursera, edX, Udemy, DeepLearning.AI, Fast.ai, Datacamp, Khan Academy). "
            "Return strictly valid JSON matching the provided schema. Ensure links are accessible and public."
        )
        
        try:
            response = self.manager.groq_client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {"role": "system", "content": sys_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=settings.LLM_COURSE_TEMPERATURE,
                response_format={"type": "json_object"},
            )
            
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse course recommendations: {e}")
            raise HTTPException(
                status_code=502,
                detail="Invalid response format from LLM"
            )
        except Exception as e:
            logger.error(f"Course recommendation failed: {e}")
            raise HTTPException(
                status_code=502,
                detail={
                    "message": "Failed to generate course recommendations",
                    "model": settings.GROQ_MODEL,
                    "error": str(e)
                }
            )
    
    async def chat_with_candidate(
        self,
        context: str,
        question: str,
        use_web_search: bool = False
    ) -> tuple[str, list[str]]:
        """
        Chat with candidate AI profile.
        
        Args:
            context: Candidate profile context
            question: Question from employer
            use_web_search: Whether to use web search
            
        Returns:
            (answer, sources) tuple
        """
        messages = [
            {"role": "system", "content": context},
            {"role": "user", "content": question}
        ]
        
        sources = []
        
        try:
            response = self.manager.groq_client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=messages,
                temperature=settings.LLM_TEMPERATURE,
                max_tokens=settings.MAX_TOKENS
            )
            
            return response.choices[0].message.content.strip(), sources
            
        except Exception as e:
            logger.error(f"Candidate chat failed: {e}")
            raise HTTPException(
                status_code=502,
                detail={
                    "message": "Failed to generate response",
                    "error": str(e)
                }
            )
    
    @staticmethod
    def _get_response_schema() -> dict:
        """Get JSON schema for CV analysis response."""
        return {
            "type": "object",
            "properties": {
                "analysis_results": {
                    "type": "object",
                    "properties": {
                        "match_score": {
                            "type": "object",
                            "properties": {
                                "value": {"type": "integer", "minimum": 0, "maximum": 100},
                                "unit": {"type": "string"}
                            },
                            "required": ["value", "unit"]
                        },
                        "target_role": {"type": "string"},
                        "strong_skills": {"type": "array", "items": {"type": "string"}},
                        "strong_skills_comment": {"type": "string"},
                        "skills_to_develop": {"type": "array", "items": {"type": "string"}},
                        "skills_to_develop_comment": {"type": "string"}
                    },
                    "required": [
                        "match_score", "target_role", "strong_skills",
                        "strong_skills_comment", "skills_to_develop",
                        "skills_to_develop_comment"
                    ]
                },
                "suggested_learning_resources": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "title": {"type": "string"},
                            "category": {"type": "string"},
                            "tags": {"type": "array", "items": {"type": "string"}},
                            "link": {"type": "string"}
                        },
                        "required": ["title", "category", "tags", "link"]
                    }
                }
            },
            "required": ["analysis_results", "suggested_learning_resources"]
        }
