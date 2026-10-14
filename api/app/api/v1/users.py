from typing import List, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.schemas.common import StandardResponse, PaginatedResponse, create_paginated_response
from app.repositories.user_repository import UserRepository
from app.repositories.log_repository import LogRepository
from app.api.deps import get_current_user, get_current_admin
from app.models.user import UserModel

router = APIRouter(prefix="/users", tags=["Users"])

def _user_to_response(u: UserModel) -> UserResponse:
    return UserResponse(
        id=u.id,
        name=u.name,
        employee_id=u.employee_id,
        email=u.email,
        team_id=u.team_id or "",
        team_name=u.team.name if u.team else "",
        score=u.score,
        rank=u.rank,
        status=u.status,
        role=u.role,
        activities_completed=u.activities_completed,
        avatar_color=u.avatar_color,
        joined_date=u.joined_date,
        last_active=u.last_active
    )

@router.get("", response_model=Union[PaginatedResponse[UserResponse], StandardResponse[List[UserResponse]]])
def get_users(
    page: Optional[int] = Query(None, ge=1, description="Page number for pagination"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Page size (max 100)"),
    role: Optional[str] = Query(None, description="Filter by role ('user' or 'admin')"),
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = UserRepository(db)
    if page is not None:
        size = page_size or 20
        users, total = repo.get_paginated(page=page, page_size=size, role=role)
        res = [_user_to_response(u) for u in users]
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="Users retrieved successfully")

    users = repo.get_all()
    if role:
        users = [u for u in users if u.role == role]
    res = [_user_to_response(u) for u in users]
    return StandardResponse(success=True, message="Users retrieved successfully", data=res)


@router.post("", response_model=StandardResponse[UserResponse], status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = UserRepository(db)
    existing = repo.get_by_employee_id_or_email(user_in.employeeId)
    if existing:
        raise HTTPException(status_code=400, detail="User with employeeId or email already exists")
    user = repo.create(user_in)
    
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Added user", user.name, "success")

    return StandardResponse(success=True, message="User created", data=_user_to_response(user))

@router.get("/{user_id}", response_model=StandardResponse[UserResponse])
def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return StandardResponse(success=True, message="User retrieved", data=_user_to_response(user))

@router.put("/{user_id}", response_model=StandardResponse[UserResponse])
def update_user(
    user_id: str,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = UserRepository(db)
    updated = repo.update(user_id, user_in)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Updated user details", updated.name, "success")

    return StandardResponse(success=True, message="User updated", data=_user_to_response(updated))

@router.delete("/{user_id}", response_model=StandardResponse[dict])
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = UserRepository(db)
    user = repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_name = user.name
    repo.delete(user_id)
    
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Deleted user", user_name, "warning")

    return StandardResponse(success=True, message="User deleted", data={"id": user_id})
