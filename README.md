# Pathfind – AI-Powered Job Application Platform

This is a [Next.js](https://nextjs.org) frontend project optimized for speed and intelligent job discovery. Our tech stack is Next.js 16 (App Router), Tailwind CSS, Framer Motion, and Zustand for state management. 

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `/src/app`: Next.js App Router pages and layouts.
- `/src/components`: UI components, organized by domain (`ui`, `dashboard`, `application`, etc.).
- `/src/lib`: Utilities, central API client, and mock data.
- `/src/store`: Zustand stores for client-side state management.
- `/src/types`: Global TypeScript types.

---

## Backend API Contracts (Django Integration)

This section defines the precise JSON structures our Next.js frontend expects from the upcoming Django backend. All frontend API calls are routed through `src/lib/api.ts`. Point your backend endpoint to `NEXT_PUBLIC_API_URL` (default: `http://localhost:8000/api/v1`).

### Authentication & User

**`POST /api/v1/auth/login/`**
Request:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "access": "jwt-access-token",
  "refresh": "jwt-refresh-token",
  "user": {
    "id": "u-123",
    "name": "Jane Doe",
    "email": "user@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "onboarding_complete": true
  }
}
```

### Profile & Preferences

**`GET /api/v1/profile/`**
Response:
```json
{
  "headline": "Senior Frontend Engineer",
  "summary": "5+ years of experience in React...",
  "phone": "555-1234",
  "location": "San Francisco, CA",
  "website": "https://janedoe.com",
  "linkedin": "https://linkedin.com/in/janedoe",
  "skills": ["React", "TypeScript", "Node.js"],
  "experience": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "start_date": "2020-01-01",
      "end_date": "2023-01-01",
      "current": false,
      "description": "Built scalable web apps..."
    }
  ],
  "education": [
    {
      "institution": "State University",
      "degree": "B.S. Computer Science",
      "field": "Computer Science",
      "start_date": "2015-09-01",
      "end_date": "2019-05-01"
    }
  ]
}
```

**`POST /api/v1/ai/resume/parse/`** (Multipart/form-data)
Request: file input `resume`
Response:
```json
{
  "skills": ["Python", "Django", "React"],
  "experience": [ ... ],
  "education": [ ... ],
  "headline": "Full-stack Developer",
  "summary": "Extracted summary..."
}
```

### Jobs

**`GET /api/v1/jobs/`** (Query Params: `keyword`, `location`, `industry`, `remote`, etc.)
Response:
```json
{
  "count": 42,
  "next": "url-to-next-page",
  "previous": null,
  "results": [
    {
      "id": "j-123",
      "title": "Frontend Engineer",
      "company": "Stripe",
      "company_logo": "S",
      "location": "San Francisco, CA",
      "type": "Full-time",
      "salary": "$150k - $200k",
      "description": "We are looking for...",
      "requirements": ["3+ years React", "TypeScript"],
      "skills": ["React", "TypeScript", "CSS"],
      "match_score": 92,
      "posted_date": "2 days ago",
      "industry": "FinTech",
      "experience_level": "Mid",
      "remote": true
    }
  ]
}
```

### Applications Pipeline

**`POST /api/v1/applications/`**
Request:
```json
{
  "job_id": "j-123",
  "status": "applied",
  "notes": "Emailed recruiter.",
  "ai_resume": "Tailored markdown content...",
  "ai_cover_letter": "Tailored cover letter string..."
}
```
Response: Returns the created application object.

**`GET /api/v1/applications/`**
Response:
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "app-123",
      "job_id": "j-123",
      "job": { /* full Job object */ },
      "status": "applied",
      "applied_date": "2024-03-10",
      "last_activity": "just now",
      "last_activity_description": "Moved to Applied",
      "notes": "Emailed recruiter",
      "resume_url": null,
      "cover_letter": null,
      "ai_resume": "...",
      "ai_cover_letter": "..."
    }
  ]
}
```

### AI Generation Hooks

**`POST /api/v1/ai/resume/generate/`** 
Request:
```json
{
  "job_id": "j-123",
  "profile_id": "u-123"
}
```
Response:
```json
{
  "content": "Tailored resume markdown...",
  "tokens_used": 1500,
  "model": "gpt-4"
}
```

**`POST /api/v1/ai/cover-letter/generate/`**
Request:
```json
{
  "job_id": "j-123",
  "tone": "enthusiastic"
}
```
Response:
```json
{
  "content": "Dear Hiring Manager, ...",
  "tokens_used": 800,
  "model": "gpt-4"
}
```

### Templates

**`POST /api/v1/templates/`**
Request:
```json
{
  "name": "Frontend Standard Cover Letter",
  "type": "cover_letter",
  "content": "I am thrilled to apply for the [Title] role at [Company]..."
}
```
Response returns the added template object with ID and created timestamp.
