# API Service Documentation

This directory contains all API-related functionality for the application.

## Structure

```
api/
├── apiClient.js              # Axios configuration
├── cvAnalysisService.js      # CV Analysis API
├── superlinkedService.js     # Superlinked Job Search API
├── index.js                  # Service exports
└── README.md                 # This file
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for your API

## API Endpoints

### 1. CV Analysis API

**Endpoint:** `POST /analyze_linkedin`

**Request (FormData):**

- `cv_file`: File (PDF)
- `linkedin_url`: string (optional)

**Response:**

```javascript
{
  analysis_results: {
    match_score: { value: 85, unit: "percent" },
    target_role: "Senior Frontend Developer",
    strong_skills: ["React", "Next.js", "TailwindCSS", ...],
    skills_to_develop: ["GraphQL", "AWS Deployment", ...]
  },
  suggested_learning_resources: [
    {
      title: "GraphQL Full Course",
      category: "Course",
      tags: ["GraphQL"],
      link: "https://..."
    }
  ]
}
```

**Usage:**

```javascript
import { analyzeCv } from '@/api';

const results = await analyzeCv(file, linkedinUrl);
```

---

### 2. Superlinked Job Search API

**Endpoint:** `POST /api/superlinked/search`

**Request:**

```javascript
{
  natural_query: "Python developer jobs in remote locations"
}
```

**Response:**

```javascript
{
  entries: [
    {
      id: "job-1",
      fields: {
        job_title: "Senior Python Developer",
        company: "TechCorp",
        job_location: "Remote",
        job_link: "https://...",
        job_skills: ["Python", "Django", ...],
        salary: "$120k - $160k"
      },
      metadata: {
        score: 0.92
      }
    }
  ]
}
```

**Usage:**

```javascript
import { searchJobsSuperlinked } from '@/api';

const results = await searchJobsSuperlinked("Python developer");
```

---

### 3. CV-Based Job Search API

**Endpoint:** `POST /api/superlinked/search/job`

**Request (FormData):**

- `cv_file`: File (PDF)

**Response:**

```javascript
{
  entries: [
    {
      id: "job-1",
      fields: {
        job_title: "Senior Python Developer",
        company: "TechCorp",
        job_location: "Remote",
        job_link: "https://...",
        job_skills: ["Python", "Django", ...],
        salary: "$120k - $160k"
      },
      metadata: {
        score: 0.92
      }
    }
  ]
}
```

**Usage:**

```javascript
import { searchJobsByCvSuperlinked } from '@/api';

const results = await searchJobsByCvSuperlinked(cvFile);
```

## Error Handling

All API functions include try-catch blocks and return promises. Handle errors in your components:

```javascript
try {
  const results = await searchJobsSuperlinked(query);
  setData(results);
} catch (error) {
  console.error("Error:", error);
  setError("An error occurred. Please try again.");
}
```

## Axios Configuration

The API client includes:

- Base URL configuration from environment variables
- Response interceptors for global error handling
- 30-second timeout
- Automatic JSON content-type headers

## Backend Connection

Make sure your backend API is running and accessible at the URL specified in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Test each endpoint individually to ensure proper connectivity.
