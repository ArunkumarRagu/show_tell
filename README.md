# HAT Converse — Production Full-Stack Application

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB.svg?style=flat&logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791.svg?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Containers-Docker--Compose-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)

**HAT Converse** is a production-ready digital transformation and gamified team platform. Built with a modern **React.js (Vite + TypeScript + Tailwind)** frontend and a **FastAPI (Python + PostgreSQL + SQLAlchemy 2.0 ORM + Alembic + Loguru + Pytest)** backend.

---

## 🎨 Design System & HashAgile Theme

Inspired by **[HashAgile](https://hashagile.com/)** digital transformation solutions:
- **Primary Colors**: Deep Indigo `#0B0E17`, Electric Purple `#954DF9`, Vivid Cyan `#4A9DFF`, Vivid Orange `#FF6004`.
- **Typography**: Clean responsive layout, glassmorphic cards, vibrant gradient accents.

---

## ⚡ Quick Container Management with `Makefile`

A root `Makefile` is included to make building, managing, testing, and running containerized services effortless.

| Makefile Command | Description |
|---|---|
| `make up` | Start PostgreSQL and FastAPI backend in Docker containers |
| `make down` | Stop and remove all Docker containers & networks |
| `make logs` | Tail live logs from running Docker containers |
| `make restart` | Restart all Docker containers |
| `make build` | Rebuild Docker containers |
| `make dev-backend` | Run FastAPI dev server locally (`uvicorn --reload`) |
| `make dev-frontend` | Run React frontend dev server locally (`pnpm run dev`) |
| `make install` | Install Python backend requirements & pnpm packages |
| `make test` | Run backend Pytest test suite |
| `make migrate` | Execute Alembic database migrations |
| `make help` | Display available Makefile targets |

---

## 🏗️ Project Architecture

```text
project-root/
├── Makefile                  # Project automation & container controls
├── README.md                 # Project documentation
├── web_app/                  # React.js Frontend
│   ├── src/
│   │   ├── api/              # API Client (client, auth, endpoints)
│   │   ├── components/       # Layouts (UserLayout, AdminLayout) & UI elements
│   │   ├── context/          # AuthContext with JWT session management
│   │   ├── pages/            # User & Admin screens
│   │   └── types/            # TypeScript interfaces
│   ├── .env.example
│   └── package.json
│
└── api/                      # FastAPI Backend
    ├── app/
    │   ├── api/v1/           # REST endpoints (auth, users, teams, activities, leaderboard, analytics, logs, settings)
    │   ├── core/             # Config, Logging (Loguru), Security (JWT/Bcrypt), Database
    │   ├── models/           # SQLAlchemy 2.0 ORM Models
    │   ├── schemas/          # Pydantic v2 schemas
    │   ├── repositories/     # Data access layer (CRUD)
    │   ├── services/         # Business logic
    │   ├── middleware/       # Exception handling & CORS
    │   └── utils/            # Data seed script
    ├── alembic/              # Alembic DB Migrations
    ├── tests/                # Pytest test suite
    ├── Dockerfile
    ├── docker-compose.yml
    └── requirements.txt
```

---

## 🐳 Docker Setup (PostgreSQL + FastAPI)

To build and launch the containers:

```bash
make up
```

This starts:
- **PostgreSQL 16 Database**: `localhost:5432`
- **HAT Converse FastAPI Backend**: `localhost:8000` (auto-seeded with default teams, users, activities, and questions)

To stop containers:
```bash
make down
```

---

## 💻 Local Development Setup (Without Docker)

### 1. Backend (`api/`)

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend (`web_app/`)

```bash
cd web_app
pnpm install
cp .env.example .env
pnpm run dev
```
- App UI: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testing

Run backend Pytest test suite:

```bash
make test
```

---

## 🔑 Default Credentials

- **Admin Account**:
  - Employee ID: `ADM001` or `admin`
  - Password: `admin123`
- **User Account**:
  - Employee ID: `EMP001` (Alex Carter)
  - Password: `password123`
