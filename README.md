# PurpleMerit - User Management System

[![Django CI](https://github.com/ashit06/Purple_Merit/actions/workflows/django.yml/badge.svg)](https://github.com/ashit06/Purple_Merit/actions/workflows/django.yml)

🔗 **Live Demo:** [Frontend](https://purple-merit-red.vercel.app) | [Backend API](https://purplemerit-backend.onrender.com)

---

## 📋 Project Overview

PurpleMerit is a full-stack **User Management System** with Role-Based Access Control (RBAC). It provides secure JWT authentication, an Admin Dashboard with server-side pagination, and user ban/activate functionality.

### Key Features
- ✅ JWT Authentication (Login, Register, Auto-refresh)
- ✅ Role-Based Access Control (Admin vs User)
- ✅ Admin Dashboard with Server-Side Pagination
- ✅ User Ban/Activate with Confirmation Modal
- ✅ Protected Routes & RBAC on Frontend
- ✅ Profile Edit & Change Password
- ✅ Dockerized Deployment
- ✅ CI/CD with GitHub Actions
- ✅ 15 Unit Tests (100% Passing)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Django 5, Django REST Framework, SimpleJWT |
| Frontend | React (Vite), Tailwind CSS, Context API |
| Database | PostgreSQL (Production), SQLite (Local) |
| DevOps | Docker, GitHub Actions, Render, Vercel |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL (optional for local)

### Local Development (Native)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py create_admin  # Creates admin@test.com / Admin123
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Local Development (Docker)
```bash
docker-compose up --build
```
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- PostgreSQL: localhost:5432

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Django secret key |
| `DEBUG` | Set to `False` in production |
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins |
| `FRONTEND_URL` | Vercel frontend URL |
| `ADMIN_EMAIL` | Admin user email (for auto-creation) |
| `ADMIN_PASSWORD` | Admin user password |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL (e.g., `https://api.example.com/api`) |

---

## 📡 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | Public |
| POST | `/api/auth/login/` | Login, get JWT tokens | Public |
| POST | `/api/auth/token/refresh/` | Refresh access token | Public |

### User Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auth/profile/` | Get current user profile | User |
| PUT | `/api/auth/profile/` | Update name/email | User |
| POST | `/api/auth/profile/change-password/` | Change password | User |

### Admin Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auth/admin/users/` | List all users (paginated) | Admin |
| PATCH | `/api/auth/admin/users/<uuid>/status/` | Toggle user active status | Admin |

### Example Request/Response

**Login:**
```bash
POST /api/auth/login/
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Admin123"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid-string",
    "email": "admin@test.com",
    "full_name": "Admin User",
    "role": "admin"
  }
}
```

---

## 🧪 Testing

Run the test suite:
```bash
cd backend
pytest -v
```

### Test Coverage (15 Tests)
- ✅ User Registration & Password Hashing
- ✅ JWT Login & Token Validation
- ✅ Weak Password Rejection
- ✅ Invalid Credentials Handling
- ✅ UUID Primary Key Verification
- ✅ Admin Can List Users (Paginated)
- ✅ Standard User Cannot Access Admin Endpoints
- ✅ Unauthenticated Access Blocked
- ✅ Pagination Limit (10 per page)
- ✅ Admin Self-Ban Prevention
- ✅ Admin Can Ban Other Users
- ✅ Soft Delete Persistence
- ✅ User Can View Own Profile
- ✅ User Can Update Profile
- ✅ Profile Requires Authentication

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `Admin123` |

---

## 📁 Project Structure

```
Purple_Merit/
├── backend/
│   ├── config/          # Django settings
│   ├── users/           # User app (models, views, serializers, tests)
│   │   ├── management/  # Custom management commands
│   │   │   └── commands/create_admin.py
│   │   ├── models.py    # CustomUser with UUID, email auth
│   │   ├── views.py     # Auth, Admin, Profile endpoints
│   │   ├── serializers.py
│   │   ├── permissions.py  # IsAdminRole RBAC
│   │   └── tests.py     # 15 unit tests
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, ProtectedRoute, Modal
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Login, Signup, Profile, Dashboard
│   │   └── utils/       # axiosInstance with interceptors
│   ├── vercel.json
│   └── Dockerfile
├── docker-compose.yml
├── .github/workflows/django.yml
└── README.md
```

---

## 🚢 Deployment

### Backend (Render)
1. Create PostgreSQL database on Render
2. Create Web Service with:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt && python manage.py migrate && python manage.py create_admin`
   - **Start Command:** `gunicorn config.wsgi:application`
3. Set environment variables:
   | Variable | Value |
   |----------|-------|
   | `SECRET_KEY` | Your random secret key |
   | `DATABASE_URL` | Internal Database URL from Render PostgreSQL |
   | `PYTHON_VERSION` | `3.10.0` |
   | `ADMIN_EMAIL` | `admin@test.com` |
   | `ADMIN_PASSWORD` | `Admin123` |
   | `ADMIN_NAME` | `Admin User` |
   | `FRONTEND_URL` | Your Vercel URL (add after frontend deploy) |

### Frontend (Vercel)
1. Import GitHub repo
2. Set Root Directory to `frontend`
3. Set `VITE_API_BASE_URL` = `https://your-backend.onrender.com/api`

---

## 🎥 Demo Video

[Walkthrough Video Link](YOUR_VIDEO_LINK_HERE)

---

## 👤 Author

**Arpit Agrahari**

---

## 📄 License

This project is for assessment purposes.
