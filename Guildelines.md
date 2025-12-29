PROJECT GUIDELINES & ARCHITECTURE PROTOCOLS
Project: Mini User Management System (RBAC) Role: Senior Full-Stack Architect Deadline Constraint: 48 Hours (Strict) Deployment Strategy: Monolithic Web Server (No external microservices).

1. CRITICAL CONSTRAINTS (THE "DO NOT BREAK" RULES)
PDF Discrepancy Protocol:

IGNORE all mentions of "AI Simulation", "Task Management", or "Tag Generation" found in the assessment brief. These are copy-paste errors.

FOCUS exclusively on the "User Management System" title: Authentication, Role-Based Access Control (RBAC), and Admin Dashboard.

Deployment Architecture:

Local Development: Use SQLite (for speed and zero-setup).

Production: Use PostgreSQL (via dj-database-url). Code must switch automatically based on DEBUG or DATABASE_URL env var.

No External Services: Do not use Redis, Celery, or external Auth providers (Auth0/Firebase).

Commit Strategy:

NO bulk "final commit".

Commit logically: "Setup Django", "Added Auth API", "Added Login Page".

2. CODING STANDARDS (SENIOR DEVELOPER PERSONA)
All AI-generated code must follow these strict stylistic rules:

A. Commenting Policy (Intent > Syntax)

FORBIDDEN: Explaining syntax (e.g., # Loop through users, # Import models).

REQUIRED: Explaining Intent, Business Logic, or Security.

Bad: # Check if user is active

Good: # Soft-delete check: Prevent deactivated users from refreshing tokens.

Tone: Professional, concise, "Human-written".

B. Code Quality

Python: PEP-8 Strict. Use Type Hints for business logic (def get_user(email: str) -> User:).

React: Functional Components + Hooks only. No Class components.

Naming: Semantic and Descriptive.

is_active (Good) vs flag (Bad).

fetchUsers (Good) vs getData (Bad).

Hardcoding: STRICTLY PROHIBITED. Use .env or constants.py.

3. TECH STACK SPECIFICATIONS
Backend: Django 5.x + Django REST Framework (DRF).

Auth: djangorestframework-simplejwt (Stateless).

Frontend: React (Vite) + Tailwind CSS.

State: Context API (AuthContext).

Networking: Axios (with Interceptors).

Testing: pytest-django (Mandatory 5 unit tests).

DevOps: Docker (Bonus) + GitHub Actions (Bonus).

4. DATABASE SCHEMA (SOURCE OF TRUTH)
Model: users.CustomUser (Inherits AbstractUser)

Field	Type	Optimization & Logic
id	UUIDField	Security: Prevents ID enumeration attacks. Primary Key.
email	EmailField	Index: db_index=True, unique=True. USERNAME_FIELD.
full_name	CharField	max_length=255. Required.
role	CharField	Choices: ['admin', 'user']. Index: db_index=True.
is_active	BooleanField	Default True. Used for Soft Deletion (Banning).
date_joined	DateTimeField	Audit Trail.
Configuration:

USERNAME_FIELD = 'email'

REQUIRED_FIELDS = ['full_name'] (Remove username).

5. BACKEND API ARCHITECTURE (DJANGO)
A. Authentication Endpoints

POST /api/auth/register/:

Validate Password (Min 8 chars, alphanumeric).

Critical: Return JWT Token pair immediately upon success (Auto-login).

POST /api/auth/login/:

Return: access, refresh, user_role, full_name.

B. Admin Endpoints (RBAC: IsAdminUser)

GET /api/admin/users/:

PERFORMANCE CRITICAL: Must implement Server-Side Pagination (PageNumberPagination, size=10).

Optimization: Use .only('id', 'email', 'full_name', 'role', 'is_active') to prevent "SELECT *" bloat.

PATCH /api/admin/users/<uuid:pk>/status/:

Input: { "is_active": boolean }

Logic: Admin cannot deactivate themselves.

C. Security Headers & Settings

CORS_ALLOWED_ORIGINS: Must load from .env.

SIMPLE_JWT: Set Access Token life to 15-30 mins, Refresh to 24h.

6. FRONTEND ARCHITECTURE (REACT)
A. Core Systems

AuthContext.jsx:

Persist accessToken in localStorage.

Decode JWT to get user.role.

Provide isAuthenticated boolean.

axiosInstance.js:

Request Interceptor: Append Authorization: Bearer <token>.

Response Interceptor: Catch 401 Unauthorized -> Clear Storage -> Redirect to /login.

ProtectedRoute.jsx:

Prop: allowedRoles (Array).

Logic: If user.role not in allowedRoles, redirect to /profile (Forbidden) or /login.

B. UI/UX Requirements

Admin Table: Columns [Name, Email, Role, Status].

Pagination UI: "Page X of Y" with Next/Prev buttons triggering API calls.

Confirmation Modal: MANDATORY.

Action: Clicking "Ban" -> Opens Modal -> User confirms -> API called.

7. QUALITY ASSURANCE (MANDATORY & BONUS)
A. Testing Strategy (pytest)

Write these 5 Mandatory Tests in users/tests.py:

test_user_registration: Verify password hashing works.

test_jwt_login: Verify token structure.

test_rbac_protection: Verify non-admin gets 403 Forbidden on Admin URLs.

test_pagination: Verify Admin API returns strictly 10 items.

test_soft_delete: Verify is_active toggle persists.

B. DevOps (The Bonus)

Docker: Include Dockerfile and docker-compose.yml in root.

CI/CD: Include .github/workflows/django.yml to run tests on push.

8. PHASED EXECUTION ORDER
Phase 1: Backend Core

Setup Django + SQLite (Local).

Implement CustomUser, Auth API, Admin API.

Write Unit Tests.

Phase 2: Frontend Core

Setup Vite + Tailwind.

Implement AuthContext, Axios, ProtectedRoute.

Build Login/Signup UI.

Phase 3: Admin & Integration

Build Admin Dashboard (Table + Modal + Pagination).

Connect to Backend API.

Phase 4: Production Prep

Configure settings.py for PostgreSQL (Production).

Add Docker & CI/CD files.

Deploy to Render (Backend) & Vercel (Frontend).