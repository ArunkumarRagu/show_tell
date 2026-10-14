from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.teams import router as teams_router
from app.api.v1.activities import router as activities_router
from app.api.v1.leaderboard import router as leaderboard_router
from app.api.v1.logs import router as logs_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.settings import router as settings_router

api_v1_router = APIRouter()

# Include modular API blueprint routers
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(teams_router)
api_v1_router.include_router(activities_router)
api_v1_router.include_router(leaderboard_router)
api_v1_router.include_router(logs_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(settings_router)
