.PHONY: help up dev qa prod down logs restart build dev-backend dev-frontend install install-dev test migrate seed clean enable-hooks disable-hooks format format-frontend format-backend lint lint-frontend lint-backend check build-frontend

# Default target
.DEFAULT_GOAL := help

## ----------------------------------------------------------------------
## 🛠️ HAT CONVERSE - MULTI-ENVIRONMENT PLATFORM MANAGEMENT
## ----------------------------------------------------------------------

help: ## Display available commands
	@echo ""
	@echo "  ================================================================"
	@echo "    ⚡ HAT CONVERSE - MULTI-ENVIRONMENT PLATFORM MANAGEMENT ⚡"
	@echo "  ================================================================"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""

up: dev ## Alias for 'make dev' (starts local dev containers with live reload)

dev: ## Start Local Dev environment (DB:5432, API:8000, Web:5173 with hot reload)
	@echo "🚀 Starting Local Dev containers (hot-reload enabled)..."
	docker compose -f docker/compose.yaml -f docker/compose.override.yaml --env-file .env.dev up -d --build
	@echo "✅ Dev containers running!"
	@echo "   Frontend: http://localhost:5173"
	@echo "   Backend:  http://localhost:8000/docs"

qa: ## Start QA / Staging environment (Production images + QA database)
	@echo "🧪 Starting QA containers..."
	docker compose -f docker/compose.yaml -f docker/compose.qa.yaml --env-file .env.qa up -d --build
	@echo "✅ QA environment running at http://localhost:80"

prod: ## Start Production environment (Replicas, resource limits, Nginx gateway)
	@echo "🏭 Starting Production containers..."
	docker compose -f docker/compose.yaml -f docker/compose.prod.yaml --env-file .env.prod up -d --build
	@echo "✅ Production environment running at http://localhost:80"

down: ## Stop and remove all Docker containers & networks
	@echo "🛑 Stopping Docker containers..."
	docker compose -f docker/compose.yaml -f docker/compose.override.yaml down

logs: ## Tail logs from running Docker containers
	docker compose -f docker/compose.yaml -f docker/compose.override.yaml logs -f

restart: down dev ## Restart dev Docker containers

build: ## Rebuild dev Docker containers without starting them
	docker compose -f docker/compose.yaml -f docker/compose.override.yaml build

dev-backend: ## Run FastAPI backend locally without Docker
	@echo "🔥 Starting FastAPI backend locally..."
	cd api && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

dev-frontend: ## Run React frontend locally with pnpm without Docker
	@echo "🎨 Starting React frontend locally with pnpm..."
	cd web_app && pnpm run dev

install: ## Install Python backend dependencies and pnpm frontend packages
	@echo "📦 Installing backend requirements..."
	pip install -r api/requirements.txt
	@echo "📦 Installing frontend dependencies with pnpm..."
	cd web_app && pnpm install

install-dev: install ## Install dev requirements (Black, Flake8, Codespell, Prettier)
	@echo "📦 Installing backend dev requirements (Black, Flake8, Codespell)..."
	pip install -r api/requirements-dev.txt

test: ## Run backend unit & integration tests with pytest
	@echo "🧪 Running pytest suite..."
	cd api && pytest

migrate: ## Run Alembic database migrations
	@echo "🗄️ Running Alembic database migrations..."
	cd api && alembic upgrade head

seed: ## Seed initial data into the database
	@echo "🌱 Seeding initial database records..."
	cd api && python -m app.seed

clean: ## Clean up temporary files, build artifacts, and caches
	@echo "🧹 Cleaning caches..."
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	rm -rf web_app/dist api/hat_app.db

## ----------------------------------------------------------------------
## 🪝 HUSKY GIT HOOKS & CODE QUALITY CONTROLS
## ----------------------------------------------------------------------

enable-hooks: ## Enable Git Husky pre-commit hooks
	@echo "🔧 Enabling Git hooks..."
	git config core.hooksPath .husky
	chmod +x .husky/* 2>/dev/null || true
	@echo "✅ Git hooks enabled (.husky)!"

disable-hooks: ## Disable Git Husky pre-commit hooks
	@echo "🚫 Disabling Git hooks..."
	git config core.hooksPath /dev/null
	@echo "✅ Git hooks disabled!"

format-frontend: ## Auto-format frontend code with Prettier (.ts, .tsx, .css, .json)
	@echo "🎨 Formatting frontend code with Prettier..."
	cd web_app && pnpm run format

format-backend: ## Auto-format backend Python code with Black
	@echo "🐍 Formatting backend code with Black..."
	python3 -m black api

format: format-frontend format-backend ## Auto-format both frontend and backend code

lint-frontend: ## Run Prettier check, ESLint, and TypeScript typecheck on frontend
	@echo "🎨 Checking frontend formatting with Prettier..."
	cd web_app && pnpm run format:check
	@echo "🔍 Linting frontend with ESLint..."
	cd web_app && pnpm run lint
	@echo "🔬 Checking frontend types with TypeScript..."
	cd web_app && pnpm run typecheck

build-frontend: ## Build frontend bundle with Vite (build check)
	@echo "📦 Building frontend with Vite..."
	cd web_app && pnpm run build

lint-backend: ## Run Black check, Flake8 code quality, and Codespell typo check
	@echo "🐍 Checking backend formatting with Black..."
	python3 -m black --check api
	@echo "🔍 Checking backend code quality with Flake8..."
	python3 -m flake8 --config api/.flake8 api
	@echo "🔤 Checking typos with Codespell..."
	python3 -m codespell_lib api

lint: lint-frontend lint-backend ## Run all linting, formatting, and typo checks

check: lint build-frontend ## Run complete code quality, typo, typecheck, and build checks
