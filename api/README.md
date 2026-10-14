# HAT Converse — FastAPI Backend (`api`)

Production-ready FastAPI backend for **HAT Converse** platform.

## Features & Stack
- **Framework**: FastAPI with Pydantic v2
- **Database**: PostgreSQL (with SQLite fallback for local dev/test) via SQLAlchemy 2.0 ORM
- **Migrations**: Alembic
- **Logging**: Loguru with sensitive field sanitization & Uvicorn log interception
- **Authentication**: JWT tokens + Bcrypt password hashing
- **Testing**: Pytest test suite with in-memory database isolation
- **Containerization**: Docker & Docker Compose setup

## Container & Local Controls (via Root Makefile)

From project root:
- `make up`: Start PostgreSQL & FastAPI containers
- `make down`: Stop containers
- `make test`: Run pytest suite
- `make dev-backend`: Start uvicorn dev server

## Manual Local Setup

```bash
cd api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Interactive API Docs:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`
