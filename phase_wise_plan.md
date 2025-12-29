🚀 FINAL PHASE-WISE DEVELOPMENT PLAN
Instructions for You:

Create a file named MASTER_PLAN.md in your project root and paste the "Advanced Master Plan" we created earlier into it.

Start a new chat with Copilot for each Phase.

Copy the "Prompt for Copilot" block for that phase and paste it into the chat.

PHASE 0: Initialization & Environment (Time: 0 - 1 Hour)

Goal: strict folder structure, Git initialization, and dependency installation.

Actions:

Initialize Git Repository with .gitignore.

Create backend/ (Django) and frontend/ (React+Vite) directories.

Install strict dependencies (Django, DRF, SimpleJWT, Postgres drivers).

Install Tailwind CSS for Frontend.

Prompt for Copilot (Phase 0):

**"Read the MASTER_PLAN.md file. We are starting Phase 0.

Initialize the project structure with 'backend' and 'frontend' folders.

For Backend: Create a virtual environment, install Django, DRF, SimpleJWT, psycopg2-binary, python-dotenv, and django-cors-headers. Generate a requirements.txt.

For Frontend: Initialize a React Vite app (npm create vite@latest). Install axios, react-router-dom, tailwindcss, lucide-react, and react-hot-toast. Initialize Tailwind.

Create a .gitignore that excludes venv, node_modules, and .env files.

Ensure the folder structure is clean and ready for development."**

PHASE 1: Backend Core & Authentication (Time: 1 - 6 Hours)

Goal: A working API that handles Users, Security, and JWT tokens.

Actions:

Database: Create CustomUser model (UUID, Email as ID, Roles).

Auth API: Register (Hash password), Login (Issue JWT).

Security: Implement IsAdminRole permission class.

Prompt for Copilot (Phase 1):

**"Read the MASTER_PLAN.md file. We are starting Phase 1 (Backend Core).

Create a Django app named users.

Implement the CustomUser model exactly as specified in the Master Plan (UUID, Email as Username, Role choices). Run migrations.

Configure SimpleJWT in settings.py to use Bearer tokens.

Create serializers.py: UserRegistrationSerializer (with password validation) and UserLoginSerializer.

Create views.py: Implement RegisterView and LoginView.

Create urls.py for these endpoints.

Style Requirement: Add docstrings explaining the security logic (e.g., 'Why we use UUIDs'). Use try-except blocks for robust error handling."**

PHASE 2: Admin Logic & RBAC (Time: 6 - 12 Hours)

Goal: The specific "Admin Dashboard" APIs requested in the PDF.

Actions:

Admin List: GET /api/admin/users/ with Server-Side Pagination.

Status Toggle: PATCH /api/admin/users/{id}/status/.

User Profile: GET /PUT /api/users/profile/.

Prompt for Copilot (Phase 2):

**"Read the MASTER_PLAN.md file. We are starting Phase 2 (Admin Features).

In permissions.py, create IsAdminUser class that checks if request.user.role == 'admin'.

In views.py, implement AdminUserListView. CRITICAL: Use PageNumberPagination (page_size=10). Do NOT return all users at once.

Implement UserStatusUpdateView to toggle is_active. Add logic: 'Admin cannot deactivate themselves'.

Implement UserProfileView for users to view/update their own data.

Optimization: Use .only() or .defer() in the QuerySet to fetch only necessary fields."**

PHASE 3: Frontend Architecture (Time: 12 - 18 Hours)

Goal: The "Brain" of the frontend (Auth State & Networking).

Actions:

Axios: Setup Interceptors (Auto-attach token, Auto-logout on 401).

Context: AuthContext.jsx to manage Login state globally.

Router: ProtectedRoute.jsx wrapper.

Prompt for Copilot (Phase 3):

**"Read the MASTER_PLAN.md file. We are starting Phase 3 (Frontend Architecture).

Create src/utils/axiosInstance.js. Add an interceptor to handle 401 errors by clearing local storage and redirecting to login.

Create src/context/AuthContext.jsx. It must persist the JWT token in localStorage and provide user, login, and logout to the app.

Create src/components/ProtectedRoute.jsx. It should accept an allowedRoles prop and redirect unauthorized users.

Ensure this code is modular and reusable."**

PHASE 4: UI Implementation (Time: 18 - 28 Hours)

Goal: Building the visual pages.

Actions:

Login/Signup: Forms with validation.

Admin Dashboard: Table with Pagination & "Ban" Modal.

Toast Notifications: Success/Error feedback.

Prompt for Copilot (Phase 4):

**"Read the MASTER_PLAN.md file. We are starting Phase 4 (UI Building).

Build Login.jsx and Signup.jsx using Tailwind. Connect them to the AuthContext.

Build Dashboard.jsx for Admins.

Create a Table component to display users.

Add 'Next/Prev' buttons that trigger the API pagination.

Add a 'Ban/Unban' button.

Strict Requirement: Create a ConfirmationModal component. The 'Ban' button must trigger this modal before calling the API.

Use react-hot-toast to show success messages after actions."**

PHASE 5: Quality Assurance & "Bonus" (Time: 28 - 38 Hours)

Goal: Turning "Bonus" points into "Guaranteed" points.

Actions:

Testing: Write 5+ Pytest cases (Mandatory).

Docker: Add Dockerfile & Compose (Bonus).

CI/CD: Add GitHub Actions (Bonus).

Prompt for Copilot (Phase 5):

**"Read the MASTER_PLAN.md file. We are entering Phase 5 (QA & Bonus).

Testing: Create users/tests.py. Write 5 pytest cases: Registration, Login, Admin Pagination, Role Permission Denied, and Soft Delete functionality.

Docker: Generate a production-ready Dockerfile for the backend and a docker-compose.yml for the full stack.

CI/CD: Generate a .github/workflows/django.yml file that runs these tests automatically on push.

This is critical for the assessment bonus points."**

PHASE 6: Deployment & Submission (Time: 38 - 48 Hours)

Goal: Going Live.

Actions:

Deploy Backend: Render.com (Web Service).

Deploy Frontend: Vercel (Import Repo).

Documentation: README.md & Video.

Manual Steps (No Copilot):

Push code to GitHub.

Connect Render to your GitHub Repo (Build command: pip install -r requirements.txt && python manage.py migrate).

Connect Vercel to GitHub (Build command: npm run build).

Video: Record yourself logging in as Admin, banning a user, and showing the GitHub Actions tab passing.

Email: Draft the email exactly as requested in the PDF.

Final Checklist Before Sending

[ ] Subject Line: Backend Developer Intern Assessment_Arpit_Agrahari

[ ] Attachments: PDF & Word doc of your report.

[ ] Links: GitHub Repo, Live Frontend URL, Live Backend URL.

[ ] Video: Link to Google Drive/YouTube.

[ ] Fresh Email: Do not reply to the old thread. Write a new one.