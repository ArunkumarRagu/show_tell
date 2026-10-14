from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserResponse
from app.schemas.common import StandardResponse
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.models.user import UserModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=StandardResponse[TokenResponse])
def login(request: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    result = auth_service.authenticate_user(request.employee_id, request.password)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid employee ID/email or password"
        )
    return StandardResponse(
        success=True,
        message="Login successful",
        data=TokenResponse(**result)
    )

@router.get("/me", response_model=StandardResponse[UserResponse])
def get_me(current_user: UserModel = Depends(get_current_user)):
    user_dict = {
        "id": current_user.id,
        "name": current_user.name,
        "employee_id": current_user.employee_id,
        "email": current_user.email,
        "team_id": current_user.team_id or "",
        "team_name": current_user.team.name if current_user.team else "",
        "score": current_user.score,
        "rank": current_user.rank,
        "status": current_user.status,
        "role": current_user.role,
        "activities_completed": current_user.activities_completed,
        "avatar_color": current_user.avatar_color,
        "joined_date": current_user.joined_date,
        "last_active": current_user.last_active
    }
    return StandardResponse(
        success=True,
        message="Current user profile retrieved",
        data=UserResponse(**user_dict)
    )

@router.post("/logout", response_model=StandardResponse[dict])
def logout():
    return StandardResponse(
        success=True,
        message="Logged out successfully",
        data={}
    )
