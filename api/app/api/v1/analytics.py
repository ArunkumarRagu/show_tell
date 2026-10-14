from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analytics import AnalyticsOverview
from app.schemas.common import StandardResponse
from app.services.analytics_service import AnalyticsService
from app.api.deps import get_current_admin
from app.models.user import UserModel

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=StandardResponse[AnalyticsOverview])
def get_analytics_overview(
    db: Session = Depends(get_db),
    _admin: UserModel = Depends(get_current_admin)
):
    service = AnalyticsService(db)
    data = service.get_overview()
    return StandardResponse(success=True, message="Analytics overview retrieved", data=data)
