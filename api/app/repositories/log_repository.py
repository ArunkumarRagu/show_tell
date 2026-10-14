from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.log import ActivityLogModel, AdminLogModel
import uuid
from datetime import datetime

class LogRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_activity_logs_for_user(self, user_id: str) -> List[ActivityLogModel]:
        return list(self.db.scalars(
            select(ActivityLogModel)
            .where(ActivityLogModel.user_id == user_id)
            .order_by(ActivityLogModel.created_at.desc())
        ).all())

    def get_all_activity_logs(self) -> List[ActivityLogModel]:
        return list(self.db.scalars(
            select(ActivityLogModel).order_by(ActivityLogModel.created_at.desc())
        ).all())

    def get_paginated_activity_logs(
        self,
        user_id: Optional[str] = None,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[ActivityLogModel], int]:
        stmt = select(ActivityLogModel)
        if user_id:
            stmt = stmt.where(ActivityLogModel.user_id == user_id)
        
        total_count = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        offset = (page - 1) * page_size
        items = list(self.db.scalars(stmt.order_by(ActivityLogModel.created_at.desc()).offset(offset).limit(page_size)).all())
        return items, total_count

    def create_activity_log(
        self,
        user_id: str,
        user_name: str,
        activity_id: str,
        activity_name: str,
        difficulty: str,
        score: int,
        time_taken: int,
        status: str
    ) -> ActivityLogModel:
        log_id = f"l_{uuid.uuid4().hex[:8]}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        log = ActivityLogModel(
            id=log_id,
            user_id=user_id,
            user_name=user_name,
            activity_id=activity_id,
            activity_name=activity_name,
            difficulty=difficulty,
            score=score,
            time_taken=time_taken,
            status=status,
            date=now_str
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log

    def get_admin_logs(self) -> List[AdminLogModel]:
        return list(self.db.scalars(
            select(AdminLogModel).order_by(AdminLogModel.created_at.desc())
        ).all())

    def get_paginated_admin_logs(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[AdminLogModel], int]:
        stmt = select(AdminLogModel)
        total_count = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        offset = (page - 1) * page_size
        items = list(self.db.scalars(stmt.order_by(AdminLogModel.created_at.desc()).offset(offset).limit(page_size)).all())
        return items, total_count


    def create_admin_log(
        self,
        user_name: str,
        action: str,
        target: str = "",
        status: str = "success"
    ) -> AdminLogModel:
        log_id = f"al_{uuid.uuid4().hex[:8]}"
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M")
        log = AdminLogModel(
            id=log_id,
            user_name=user_name,
            action=action,
            target=target,
            status=status,
            timestamp=now_str
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log
