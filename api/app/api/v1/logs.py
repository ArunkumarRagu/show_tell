from typing import List, Optional, Union
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.log import ActivityLogResponse, AdminLogResponse
from app.schemas.common import StandardResponse, PaginatedResponse, create_paginated_response
from app.repositories.log_repository import LogRepository
from app.api.deps import get_current_user, get_current_admin
from app.models.user import UserModel

router = APIRouter(prefix="/logs", tags=["Logs"])

@router.get("/user", response_model=Union[PaginatedResponse[ActivityLogResponse], StandardResponse[List[ActivityLogResponse]]])
def get_user_activity_logs(
    page: Optional[int] = Query(None, ge=1, description="Page number for pagination"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Page size (max 100)"),
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    repo = LogRepository(db)
    user_id = None if current_user.role == "admin" else current_user.id
    if page is not None:
        size = page_size or 20
        logs, total = repo.get_paginated_activity_logs(user_id=user_id, page=page, page_size=size)
        res = [ActivityLogResponse.model_validate(l) for l in logs]
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="User activity logs retrieved successfully")

    if current_user.role == "admin":
        logs = repo.get_all_activity_logs()
    else:
        logs = repo.get_activity_logs_for_user(current_user.id)
    res = [ActivityLogResponse.model_validate(l) for l in logs]
    return StandardResponse(success=True, message="User activity logs retrieved successfully", data=res)

@router.get("/admin", response_model=Union[PaginatedResponse[AdminLogResponse], StandardResponse[List[AdminLogResponse]]])
def get_admin_logs(
    page: Optional[int] = Query(None, ge=1, description="Page number for pagination"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Page size (max 100)"),
    db: Session = Depends(get_db),
    _admin: UserModel = Depends(get_current_admin)
):
    repo = LogRepository(db)
    if page is not None:
        size = page_size or 20
        logs, total = repo.get_paginated_admin_logs(page=page, page_size=size)
        res = [AdminLogResponse.model_validate(l) for l in logs]
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="Admin audit logs retrieved successfully")

    logs = repo.get_admin_logs()
    res = [AdminLogResponse.model_validate(l) for l in logs]
    return StandardResponse(success=True, message="Admin audit logs retrieved successfully", data=res)

