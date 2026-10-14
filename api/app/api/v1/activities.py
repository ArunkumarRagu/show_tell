from typing import List, Optional, Union
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.activity import (
    ActivityCreate,
    ActivityUpdate,
    ActivityResponse,
    ActivitySubmissionRequest,
    ActivitySubmissionResult,
    QuestionResponse,
)
from app.schemas.common import StandardResponse, PaginatedResponse, create_paginated_response
from app.repositories.activity_repository import ActivityRepository
from app.repositories.log_repository import LogRepository
from app.services.submission_service import SubmissionService
from app.api.deps import get_current_user, get_current_admin
from app.models.user import UserModel
from app.models.activity import ActivityModel

router = APIRouter(prefix="/activities", tags=["Activities"])

def _activity_to_response(a: ActivityModel) -> ActivityResponse:
    q_responses = [
        QuestionResponse(
            id=q.id,
            prompt=q.prompt,
            options=q.options,
            correctIndex=q.correct_index
        )
        for q in a.questions
    ]
    return ActivityResponse(
        id=a.id,
        name=a.name,
        description=a.description,
        instructions=a.instructions,
        difficulty=a.difficulty,
        timeLimit=a.time_limit,
        maxScore=a.max_score,
        passingScore=a.passing_score,
        status=a.status,
        category=a.category,
        activityType=a.activity_type,
        completions=a.completions,
        avgScore=a.avg_score,
        questions=q_responses
    )

@router.get("", response_model=Union[PaginatedResponse[ActivityResponse], StandardResponse[List[ActivityResponse]]])
def get_activities(
    page: Optional[int] = Query(None, ge=1, description="Page number for pagination"),
    page_size: Optional[int] = Query(None, ge=1, le=100, description="Page size (max 100)"),
    include_inactive: bool = Query(True, description="Include inactive activities"),
    category: Optional[str] = Query(None, description="Filter by activity category"),
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = ActivityRepository(db)
    if page is not None:
        size = page_size or 20
        activities, total = repo.get_paginated(
            page=page, page_size=size, include_inactive=include_inactive, category=category
        )
        res = [_activity_to_response(a) for a in activities]
        return create_paginated_response(items=res, total_items=total, page=page, page_size=size, message="Activities retrieved successfully")

    activities = repo.get_all(include_inactive=include_inactive)
    if category:
        activities = [a for a in activities if a.category == category]
    res = [_activity_to_response(a) for a in activities]
    return StandardResponse(success=True, message="Activities retrieved successfully", data=res)


@router.post("", response_model=StandardResponse[ActivityResponse], status_code=status.HTTP_201_CREATED)
def create_activity(
    activity_in: ActivityCreate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = ActivityRepository(db)
    activity = repo.create(activity_in)

    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Created activity", activity.name, "success")

    return StandardResponse(success=True, message="Activity created", data=_activity_to_response(activity))

@router.get("/{activity_id}", response_model=StandardResponse[ActivityResponse])
def get_activity_by_id(
    activity_id: str,
    db: Session = Depends(get_db),
    _current_user: UserModel = Depends(get_current_user)
):
    repo = ActivityRepository(db)
    activity = repo.get_by_id(activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return StandardResponse(success=True, message="Activity retrieved", data=_activity_to_response(activity))

@router.put("/{activity_id}", response_model=StandardResponse[ActivityResponse])
def update_activity(
    activity_id: str,
    activity_in: ActivityUpdate,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = ActivityRepository(db)
    updated = repo.update(activity_id, activity_in)
    if not updated:
        raise HTTPException(status_code=404, detail="Activity not found")

    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Edited activity", updated.name, "success")

    return StandardResponse(success=True, message="Activity updated", data=_activity_to_response(updated))

@router.patch("/{activity_id}/toggle-status", response_model=StandardResponse[ActivityResponse])
def toggle_activity_status(
    activity_id: str,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = ActivityRepository(db)
    updated = repo.toggle_status(activity_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Activity not found")

    action_text = f"Toggled status to {updated.status}"
    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, action_text, updated.name, "success")

    return StandardResponse(success=True, message=f"Activity status set to {updated.status}", data=_activity_to_response(updated))

@router.delete("/{activity_id}", response_model=StandardResponse[dict])
def delete_activity(
    activity_id: str,
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    repo = ActivityRepository(db)
    activity = repo.get_by_id(activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    name = activity.name
    repo.delete(activity_id)

    log_repo = LogRepository(db)
    log_repo.create_admin_log(admin.name, "Deleted activity", name, "error")

    return StandardResponse(success=True, message="Activity deleted", data={"id": activity_id})

@router.post("/{activity_id}/submit", response_model=StandardResponse[ActivitySubmissionResult])
def submit_activity(
    activity_id: str,
    submission: ActivitySubmissionRequest,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    service = SubmissionService(db)
    try:
        result = service.submit_activity(
            activity_id=activity_id,
            user_id=current_user.id,
            answers=submission.answers,
            time_taken=submission.timeTaken
        )
        return StandardResponse(success=True, message="Activity submitted successfully", data=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
