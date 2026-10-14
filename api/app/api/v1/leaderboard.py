from typing import List, Optional, Union
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.team import TeamResponse
from app.schemas.user import UserResponse
from app.schemas.common import StandardResponse, PaginatedResponse, create_paginated_response
from app.repositories.team_repository import TeamRepository
from app.repositories.user_repository import UserRepository
from app.api.deps import get_current_user
from app.models.user import UserModel
from app.api.v1.users import _user_to_response

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/teams", response_model=Union[PaginatedResponse[TeamResponse], StandardResponse[List[TeamResponse]]])
def get_team_leaderboard(
    page: Optional[int] = Query(None, ge=1, description="Page number for pagination"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Page size (max 100)"),
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = TeamRepository(db)
    if page is not None:
        size = page_size or 20
        teams, total = repo.get_paginated(page=page, page_size=size)
        res = [TeamResponse.model_validate(t) for t in teams]
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="Team leaderboard retrieved successfully")

    teams = repo.get_all()
    res = [TeamResponse.model_validate(t) for t in teams]
    return StandardResponse(success=True, message="Team leaderboard retrieved successfully", data=res)

@router.get("/users", response_model=Union[PaginatedResponse[UserResponse], StandardResponse[List[UserResponse]]])
def get_user_leaderboard(
    page: Optional[int] = Query(None, ge=1, description="Page number for pagination"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Page size (max 100)"),
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = UserRepository(db)
    if page is not None:
        size = page_size or 20
        users, total = repo.get_paginated(page=page, page_size=size)
        res = [_user_to_response(u) for u in users]
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="User leaderboard retrieved successfully")

    users = repo.get_all()
    res = [_user_to_response(u) for u in users]
    return StandardResponse(success=True, message="User leaderboard retrieved successfully", data=res)

