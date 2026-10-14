from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.analytics import SystemSettingsUpdate
from app.schemas.common import StandardResponse
from app.repositories.settings_repository import SettingsRepository
from app.repositories.log_repository import LogRepository
from app.api.deps import get_current_user, get_current_admin
from app.models.user import UserModel

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("", response_model=StandardResponse[dict])
def get_settings(
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = SettingsRepository(db)
    data = repo.get_all()
    return StandardResponse(success=True, message="Settings retrieved", data=data)

@router.put("", response_model=StandardResponse[dict])
def update_settings(
    settings_in: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = SettingsRepository(db)
    updated = repo.update(settings_in.model_dump())

    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Updated settings", "Competition rules", "success")

    return StandardResponse(success=True, message="Settings updated successfully", data=updated)
