MASTER IMPLEMENTATION PLAN: PurpleMerit Assessment
Role: Senior Full-Stack Architect Deadline: 48 Hours (Strict) Constraint: Production Grade, Dockerized, Cloud-Hosted.

1. PROJECT OVERVIEW & SCOPE
Objective: Build a secure, scalable User Management System with Role-Based Access Control (RBAC).

Core Features: Login/Signup (JWT), User Profile Management, Admin Dashboard (Ban/Unban users).

Deployment Strategy:

Live Demo: Render (Backend) + Vercel (Frontend) for maximum reliability.

Codebase: Fully Dockerized (Bonus Requirement) + CI/CD Pipelines.

Note on PDF Discrepancy: The PDF mentions "AI Simulation" and "Tasks". These are conflicting copy-paste errors from a different assessment. We will strictly focus on the "User Management System" title and requirements to ensure a polished, bug-free core product.

2. TECH STACK & ARCHITECTURE
Backend: Django 5.x + Django REST Framework (DRF).

Auth: simplejwt (Stateless Authentication).

Database: PostgreSQL (Production) / SQLite (Local Docker fallback).

Frontend: React (Vite) + Tailwind CSS.

State: Context API (AuthContext).

HTTP: Axios with Interceptors.

DevOps (Bonus):

Docker: docker-compose for full local orchestration.

CI/CD: GitHub Actions (Automated Testing).

Testing: pytest (Backend).

3. DATABASE SCHEMA (OPTIMIZED)
Model: users.CustomUser (Inherits AbstractUser)

Field	Type	Optimization Logic (Senior Dev Rationale)
id	UUID	Security: Prevents ID enumeration attacks.
email	EmailField	Perf: unique=True, db_index=True. Replaces username.
full_name	CharField	Required.
role	CharField	Choices: ['admin', 'user']. Indexed for fast Admin filtering.
is_active	Bool	Default True. Used for "Soft Ban".
date_joined	DateTime	Audit trail.
Constraints:

USERNAME_FIELD = 'email'

REQUIRED_FIELDS = ['full_name']

4. BACKEND SPECIFICATIONS (Django)
A. Authentication

Signup (POST /api/auth/register/):

Validate Password (Min 8 chars, alphanumeric).

Return JWT Token immediately (Auto-login).

Login (POST /api/auth/login/):

Return access, refresh, and user role.

B. Admin Dashboard (Protected: IsAdminUser)

List Users (GET /api/admin/users/):

CRITICAL: Must use Server-Side Pagination (PageNumberPagination, size=10).

Optimization: Use .only() to fetch minimal fields.

Toggle Status (PATCH /api/admin/users/<id>/status/):

Payload: { "is_active": false }

Logic: Prevent Admin from banning themselves.

C. Testing Strategy (Mandatory 5 Tests)

We will write a pytest suite in users/tests/:

test_user_registration: Verify hashing.

test_login_success: Verify JWT token issuance.

test_admin_restriction: Verify standard user gets 403 Forbidden on Admin routes.

test_pagination: Verify Admin API returns exactly 10 users per page.

test_soft_ban: Verify is_active toggle functionality.

5. FRONTEND SPECIFICATIONS (React)
A. Core Components

AuthContext: Handles Login/Logout and persists Token in localStorage.

AxiosInterceptor: Detects 401 Unauthorized responses and auto-redirects to Login.

ProtectedRoute: A wrapper component checking user.role before rendering Admin pages.

B. UI/UX Requirements

Admin Table: Columns [Name, Email, Role, Status].

Pagination: "Next" / "Previous" buttons triggering API refetch.

Confirmation Modal: Clicking "Deactivate" MUST show a popup: "Are you sure you want to ban this user?"

Responsive: Use Tailwind grid/flex to ensure mobile compatibility.

6. CONTAINERIZATION (DOCKER - BONUS)
We will add the following files to the root directory to satisfy the "Dockerized Setup" bonus.

A. Dockerfile (Backend)

Dockerfile
# Simplified for reference
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
B. docker-compose.yml

Service 1 (db): Postgres 15 image.

Service 2 (backend): Builds from ./backend, depends on db.

Service 3 (frontend): Builds from ./frontend.

Why: This proves you know how to orchestrate the full stack locally.

7. CI/CD PIPELINE (GITHUB ACTIONS - BONUS)
We will create .github/workflows/django_test.yml:

Trigger: Push to main.

Steps:

Checkout Code.

Set up Python 3.10.

Install Dependencies (pip install -r requirements.txt).

Run Tests (pytest).

Benefit: This provides the "CI/CD Pipeline configuration" requested in the PDF Bonus section.

8. STEP-BY-STEP EXECUTION PROTOCOL
Phase 1: Core Backend (Hours 0-12)

Initialize Django Project & users app.

Implement CustomUser model & Migrations.

Implement Auth & Admin APIs with JWT.

Write the 5 Mandatory Unit Tests.

Phase 2: Frontend Implementation (Hours 12-24)

Setup Vite + Tailwind.

Implement Login/Signup Pages.

Implement Admin Dashboard with Pagination & Modal.

Connect Axios to Backend APIs.

Phase 3: The "Bonus" Run (Hours 24-36)

Create Dockerfile and docker-compose.yml.

Create GitHub Actions Workflow (.yml).

Verify CI passes on GitHub.

Phase 4: Deployment & Polish (Hours 36-48)

Deploy Backend to Render (as a Web Service).

Deploy Frontend to Vercel.

Record Walkthrough Video (Mentioning: "Includes Docker & CI/CD").

Submit Email exactly as requested.

END OF MASTER PLAN