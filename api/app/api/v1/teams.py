from typing import List, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.team import TeamCreate, TeamUpdate, TeamResponse
from app.schemas.common import StandardResponse, PaginatedResponse, create_paginated_response
from app.repositories.team_repository import TeamRepository
from app.repositories.log_repository import LogRepository
from app.api.deps import get_current_user, get_current_admin
from app.models.user import UserModel

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("", response_model=Union[PaginatedResponse[TeamResponse], StandardResponse[List[TeamResponse]]])
def get_teams(
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
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="Teams retrieved successfully")

    teams = repo.get_all()
    res = [TeamResponse.model_validate(t) for t in teams]
    return StandardResponse(success=True, message="Teams retrieved successfully", data=res)


@router.post("", response_model=StandardResponse[TeamResponse], status_code=status.HTTP_201_CREATED)
def create_team(
    team_in: TeamCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = TeamRepository(db)
    existing = repo.get_by_name(team_in.name)
    if existing:
        raise HTTPException(status_code=400, detail="Team with this name already exists")
    team = repo.create(team_in)
    
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Created team", team.name, "success")

    return StandardResponse(success=True, message="Team created", data=TeamResponse.model_validate(team))

@router.get("/{team_id}", response_model=StandardResponse[TeamResponse])
def get_team_by_id(
    team_id: str,
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = TeamRepository(db)
    team = repo.get_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    return StandardResponse(success=True, message="Team retrieved", data=TeamResponse.model_validate(team))

@router.put("/{team_id}", response_model=StandardResponse[TeamResponse])
def update_team(
    team_id: str,
    team_in: TeamUpdate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = TeamRepository(db)
    updated = repo.update(team_id, team_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Team not found")
    
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Updated team", updated.name, "success")

    return StandardResponse(success=True, message="Team updated", data=TeamResponse.model_validate(updated))

@router.delete("/{team_id}", response_model=StandardResponse[dict])
def delete_team(
    team_id: str,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = TeamRepository(db)
    team = repo.get_by_id(team_id)
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    team_name = team.name
    repo.delete(team_id)
    
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Deleted team", team_name, "error")

    return StandardResponse(success=True, message="Team deleted", data={"id": team_id})
