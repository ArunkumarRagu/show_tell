from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.activity import ActivityModel, QuestionModel
from app.schemas.activity import ActivityCreate, ActivityUpdate
import uuid

class ActivityRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self, include_inactive: bool = True) -> List[ActivityModel]:
        stmt = select(ActivityModel)
        if not include_inactive:
            stmt = stmt.where(ActivityModel.status == "active")
        return list(self.db.scalars(stmt.order_by(ActivityModel.created_at.desc())).all())

    def get_paginated(
        self,
        page: int = 1,
        page_size: int = 20,
        include_inactive: bool = True,
        category: Optional[str] = None
    ) -> Tuple[List[ActivityModel], int]:
        stmt = select(ActivityModel)
        if not include_inactive:
            stmt = stmt.where(ActivityModel.status == "active")
        if category:
            stmt = stmt.where(ActivityModel.category == category)
        
        total_count = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        offset = (page - 1) * page_size
        items = list(self.db.scalars(stmt.order_by(ActivityModel.created_at.desc()).offset(offset).limit(page_size)).all())
        return items, total_count


    def get_by_id(self, activity_id: str) -> Optional[ActivityModel]:
        return self.db.scalar(select(ActivityModel).where(ActivityModel.id == activity_id))

    def create(self, activity_in: ActivityCreate) -> ActivityModel:
        act_id = f"a_{uuid.uuid4().hex[:8]}"
        activity = ActivityModel(
            id=act_id,
            name=activity_in.name,
            description=activity_in.description,
            instructions=activity_in.instructions,
            difficulty=activity_in.difficulty,
            time_limit=activity_in.timeLimit,
            max_score=activity_in.maxScore,
            passing_score=activity_in.passingScore,
            status=activity_in.status,
            category=activity_in.category,
            activity_type=activity_in.activityType,
            completions=0,
            avg_score=0.0
        )
        self.db.add(activity)
        self.db.commit()

        # Add questions if provided
        for q in activity_in.questions:
            q_id = f"q_{uuid.uuid4().hex[:8]}"
            question = QuestionModel(
                id=q_id,
                activity_id=act_id,
                prompt=q.prompt,
                options=q.options,
                correct_index=q.correctIndex
            )
            self.db.add(question)

        self.db.commit()
        self.db.refresh(activity)
        return activity

    def update(self, activity_id: str, activity_in: ActivityUpdate) -> Optional[ActivityModel]:
        activity = self.get_by_id(activity_id)
        if not activity:
            return None

        data = activity_in.model_dump(exclude_unset=True)
        questions_data = data.pop("questions", None)

        if "timeLimit" in data:
            data["time_limit"] = data.pop("timeLimit")
        if "maxScore" in data:
            data["max_score"] = data.pop("maxScore")
        if "passingScore" in data:
            data["passing_score"] = data.pop("passingScore")
        if "activityType" in data:
            data["activity_type"] = data.pop("activityType")

        for field, value in data.items():
            setattr(activity, field, value)

        if questions_data is not None:
            # Delete existing questions and add new ones
            self.db.query(QuestionModel).filter(QuestionModel.activity_id == activity_id).delete()
            for q in questions_data:
                q_id = f"q_{uuid.uuid4().hex[:8]}"
                q_model = QuestionModel(
                    id=q_id,
                    activity_id=activity_id,
                    prompt=q["prompt"],
                    options=q["options"],
                    correct_index=q.get("correctIndex", q.get("correct_index", 0))
                )
                self.db.add(q_model)

        self.db.commit()
        self.db.refresh(activity)
        return activity

    def delete(self, activity_id: str) -> bool:
        activity = self.get_by_id(activity_id)
        if not activity:
            return False
        self.db.delete(activity)
        self.db.commit()
        return True

    def toggle_status(self, activity_id: str) -> Optional[ActivityModel]:
        activity = self.get_by_id(activity_id)
        if not activity:
            return None
        activity.status = "inactive" if activity.status == "active" else "active"
        self.db.commit()
        self.db.refresh(activity)
        return activity
