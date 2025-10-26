"""Superlinked job search API endpoints."""

import logging
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException, UploadFile, File

from app.config import get_settings
from app.schemas import SearchRequest
from app.utils import PDFExtractor, parse_request_dict

router = APIRouter()
logger = logging.getLogger(__name__)
settings = get_settings()


@router.post("/search")
async def search_jobs(request: SearchRequest) -> dict:
    """
    Search jobs using natural language query.
    
    Args:
        request: Search request with query and optional filters
        
    Returns:
        Search results from Superlinked
        
    Raises:
        HTTPException: If search fails
    """
    try:
        payload = parse_request_dict(request.model_dump())
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.SUPERLINKED_URL}/api/v1/search/job",
                json=payload,
                headers={"x-include-metadata": "true"},
                timeout=settings.SUPERLINKED_TIMEOUT
            )
            
            if response.status_code == 200:
                logger.info(f"Job search completed successfully")
                return response.json()
            else:
                logger.error(f"Superlinked search failed with status {response.status_code}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Search failed with status code {response.status_code}"
                )
    
    except httpx.RequestError as e:
        logger.error(f"Connection error to Superlinked: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Connection error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal error: {str(e)}"
        )


@router.post("/search/job")
async def search_jobs_by_cv(
    cv_file: UploadFile = File(...),
    limit: int = 25,
    description_weight: Optional[float] = None,
    title_weight: Optional[float] = None,
    description: Optional[str] = None,
    similar_description_weight: Optional[float] = None,
    title: Optional[str] = None,
    similar_title_weight: Optional[float] = None,
    states_include: Optional[list[str]] = None,
    states_exclude: Optional[list[str]] = None,
    search_cities_include: Optional[list[str]] = None,
    search_cities_exclude: Optional[list[str]] = None,
    search_countries_include: Optional[list[str]] = None,
    search_countries_exclude: Optional[list[str]] = None,
    companies_include: Optional[list[str]] = None,
    companies_exclude: Optional[list[str]] = None,
    job_levels_include: Optional[list[str]] = None,
    job_levels_exclude: Optional[list[str]] = None,
    job_types_include: Optional[list[str]] = None,
    job_types_exclude: Optional[list[str]] = None,
    job_categories_include: Optional[list[str]] = None,
    job_categories_exclude: Optional[list[str]] = None,
    job_skills_include: Optional[list[str]] = None,
    job_skills_exclude: Optional[list[str]] = None
) -> dict:
    """
    Search jobs by uploading a CV PDF.
    
    Args:
        cv_file: PDF file of CV
        limit: Maximum number of results
        **filters: Optional filter parameters
        
    Returns:
        Search results from Superlinked
        
    Raises:
        HTTPException: If PDF is invalid or search fails
    """
    try:
        # Extract text from PDF
        cv_content = await PDFExtractor.extract_text_from_pdf(await cv_file.read())
        
        logger.info(f"Extracted {len(cv_content)} characters from CV")
        
        # Build request payload
        payload = {
            'natural_query': cv_content,
            'limit': min(limit, settings.MAX_SEARCH_LIMIT)
        }
        
        # Add optional filters
        filters = {
            'description_weight': description_weight,
            'title_weight': title_weight,
            'description': description,
            'similar_description_weight': similar_description_weight,
            'title': title,
            'similar_title_weight': similar_title_weight,
            'states_include': states_include,
            'states_exclude': states_exclude,
            'search_cities_include': search_cities_include,
            'search_cities_exclude': search_cities_exclude,
            'search_countries_include': search_countries_include,
            'search_countries_exclude': search_countries_exclude,
            'companies_include': companies_include,
            'companies_exclude': companies_exclude,
            'job_levels_include': job_levels_include,
            'job_levels_exclude': job_levels_exclude,
            'job_types_include': job_types_include,
            'job_types_exclude': job_types_exclude,
            'job_categories_include': job_categories_include,
            'job_categories_exclude': job_categories_exclude,
            'job_skills_include': job_skills_include,
            'job_skills_exclude': job_skills_exclude,
        }
        
        # Add non-None filters
        for key, value in filters.items():
            if value is not None:
                payload[key] = value
        
        # Send to Superlinked
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.SUPERLINKED_URL}/api/v1/search/cv-job",
                json=payload,
                headers={"x-include-metadata": "true"},
                timeout=settings.SUPERLINKED_TIMEOUT
            )
            
            if response.status_code == 200:
                logger.info(f"CV-based job search completed successfully")
                return response.json()
            else:
                logger.error(
                    f"Superlinked CV search failed with status {response.status_code}: {response.text}"
                )
                raise HTTPException(
                    status_code=500,
                    detail=f"CV search failed with status code {response.status_code}"
                )
    
    except Exception as e:
        logger.error(f"CV-based search error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal error: {str(e)}"
        )
