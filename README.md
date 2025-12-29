# PurpleMerit - User Management System

[![Django CI](https://github.com/YOUR_USERNAME/Purple_Merit/actions/workflows/django.yml/badge.svg)](https://github.com/YOUR_USERNAME/Purple_Merit/actions/workflows/django.yml)

🔗 **Live Demo:** [Frontend](https://your-app.vercel.app) | [Backend API](https://your-api.onrender.com)

---

## 📋 Project Overview

PurpleMerit is a full-stack **User Management System** with Role-Based Access Control (RBAC). It provides secure JWT authentication, an Admin Dashboard with server-side pagination, and user ban/activate functionality.

### Key Features
- ✅ JWT Authentication (Login, Register, Auto-refresh)
- ✅ Role-Based Access Control (Admin vs User)
- ✅ Admin Dashboard with Server-Side Pagination
- ✅ User Ban/Activate with Confirmation Modal
- ✅ Protected Routes & RBAC on Frontend
- ✅ Dockerized Deployment
- ✅ CI/CD with GitHub Actions

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
| PUT | `/api/auth/profile/` | Update current user profile | User |

### Admin Endpoints
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/auth/admin/users/` | List all users (paginated) | Admin |
| PATCH | `/api/auth/admin/users/<uuid>/status/` | Toggle user active status | Admin |

---

## 🧪 Testing

Run the test suite:
```bash
cd backend
pytest -v
```

### Test Coverage
- ✅ User Registration & Password Hashing
- ✅ JWT Login & Token Validation
- ✅ RBAC Permission Enforcement
- ✅ Server-Side Pagination
- ✅ Admin Self-Ban Prevention
- ✅ Soft Delete Persistence

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
│   ├── users/           # User app (models, views, serializers)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, ProtectedRoute, Modal
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Login, Signup, Profile, Dashboard
│   │   └── utils/       # axiosInstance
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
   - Build: `pip install -r requirements.txt && python manage.py migrate`
   - Start: `gunicorn config.wsgi:application`
3. Set environment variables

### Frontend (Vercel)
1. Import GitHub repo
2. Set Root Directory to `frontend`
3. Set `VITE_API_BASE_URL` environment variable

---

## 👤 Author

**Arpit Agrahari**

---

## 📄 License

This project is for assessment purposes.
