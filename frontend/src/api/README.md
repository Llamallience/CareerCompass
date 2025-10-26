# API Service Documentation

This directory contains all API-related functionality for the application.

## Structure

```
api/
├── apiService.js    # Main API service with axios configuration
├── mockData.json    # Mock data for all endpoints
└── README.md        # This file
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_USE_MOCK=true
```

- `NEXT_PUBLIC_API_BASE_URL`: The base URL for your API
- `NEXT_PUBLIC_USE_MOCK`: Set to `true` to use mock data, `false` to use real API

## API Endpoints

### 1. Job Search API

**Endpoint:** `POST /api/job-search`

**Request:**

```javascript
{
  query: "Data Scientist jobs in Australia with Machine Learning skills";
}
```

**Response:**

```javascript
{
  targetJob: "AI/ML Engineer",
  missingSkills: ["Python", "NumPy", "Pandas", ...],
  avoidPath: "Important warnings and tips",
  roadmap: [
    {
      step: "Step 1: ...",
      description: "..."
    }
  ]
}
```

**Usage:**

```javascript
import { searchJobs } from "@/api/apiService";

const results = await searchJobs("AI/ML Engineer");
```

---

### 2. CV Analysis API

**Endpoint:** `POST /api/cv-analysis`

**Request (FormData):**

- `cvFile`: File (PDF)
- `linkedinUrl`: string (optional)
- `targetJobTitle`: string (optional)

**Response:**

```javascript
{
  matchPercentage: 85,
  jobTitle: "Senior Frontend Developer",
  missingSkills: ["GraphQL", "AWS Deployment"],
  strongSkills: ["React", "Next.js", "TailwindCSS"],
  suggestedResources: [
    {
      skill: "GraphQL",
      resourceName: "GraphQL Full Course",
      resourceUrl: "https://...",
      type: "Course"
    }
  ],
  recommendations: ["Add GraphQL experience...", ...]
}
```

**Usage:**

```javascript
import { analyzeCv } from '@/api/apiService';

const file = // File object from input
const results = await analyzeCv(file, linkedinUrl, targetJobTitle);
```

---

### 3. Career Paths API

**Endpoint:** `GET /api/career-paths`

**Response:**

```javascript
[
  {
    id: "frontend-developer",
    title: "Frontend Developer",
    description: "Build user interfaces...",
    averageSalary: { min: 60000, max: 120000, currency: "USD" },
    requiredSkills: ["HTML/CSS", "JavaScript", ...],
    optionalSkills: ["TypeScript", ...],
    learningPath: ["HTML/CSS fundamentals", ...]
  }
]
```

**Usage:**

```javascript
import { getCareerPaths } from "@/api/apiService";

const careers = await getCareerPaths();
```

---

### 4. Career Path Details API

**Endpoint:** `GET /api/career-paths/:id`

**Usage:**

```javascript
import { getCareerPathById } from "@/api/apiService";

const career = await getCareerPathById("frontend-developer");
```

## Mock Data vs Real API

The service automatically switches between mock data and real API based on the `NEXT_PUBLIC_USE_MOCK` environment variable.

### Development Mode (Mock Data)

- Simulates API delays (1-2 seconds)
- Returns consistent mock responses
- No backend required

### Production Mode (Real API)

- Connects to actual backend
- Handles authentication tokens
- Full error handling

## Error Handling

All API functions include try-catch blocks and return promises. Handle errors in your components:

```javascript
try {
  const results = await searchJobs(query);
  setData(results);
} catch (error) {
  console.error("Error:", error);
  setError("An error occurred. Please try again.");
}
```

## Axios Configuration

The API client includes:

- Request interceptors for auth tokens
- Response interceptors for global error handling
- 30-second timeout
- Automatic JSON content-type headers

## Next Steps

When ready to connect to your real backend:

1. Update `.env.local`:

   ```env
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
   ```

2. Implement authentication if needed in `apiService.js`:

   ```javascript
   const token = localStorage.getItem("token");
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   ```

3. Test each endpoint individually

4. Update mock data structure if API response format differs
