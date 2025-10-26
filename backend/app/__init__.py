"""FastAPI application factory."""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.api.routes.superlinked import router as superlinked_router
from app.api.routes.cv_analysis import router as cv_analysis_router

# Configure logging
logger = logging.getLogger(__name__)
settings = get_settings()

def create_app() -> FastAPI:
    """Create and configure FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        debug=settings.DEBUG
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Update with specific origins in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(
        superlinked_router,
        prefix="/api/superlinked",
        tags=["superlinked"]
    )
    app.include_router(
        cv_analysis_router,
        prefix="/api/cv-analysis",
        tags=["cv-analysis"]
    )
    
    # Health check endpoint
    @app.get("/health")
    async def health_check() -> dict:
        """Health check endpoint."""
        return {
            "status": "healthy",
            "app": settings.APP_NAME,
            "version": settings.APP_VERSION
        }
    
    logger.info(f"Application created: {settings.APP_NAME} v{settings.APP_VERSION}")
    
    return app

# Create app instance
app = create_app()

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )