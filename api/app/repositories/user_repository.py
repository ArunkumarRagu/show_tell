from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, or_, func
from app.models.user import UserModel
from app.models.team import TeamModel
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash
import uuid

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[UserModel]:
        return list(self.db.scalars(select(UserModel).options(joinedload(UserModel.team)).order_by(UserModel.score.desc())).all())

    def get_paginated(
        self,
        page: int = 1,
        page_size: int = 20,
        role: Optional[str] = None
    ) -> Tuple[List[UserModel], int]:
        stmt = select(UserModel)
        if role:
            stmt = stmt.where(UserModel.role == role)
        
        total_count = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        offset = (page - 1) * page_size
        items = list(self.db.scalars(stmt.options(joinedload(UserModel.team)).order_by(UserModel.score.desc()).offset(offset).limit(page_size)).all())
        return items, total_count


    def get_by_id(self, user_id: str) -> Optional[UserModel]:
        return self.db.scalar(select(UserModel).where(UserModel.id == user_id))

    def get_by_employee_id_or_email(self, term: str) -> Optional[UserModel]:
        clean_term = term.strip().lower()
        return self.db.scalar(
            select(UserModel).where(
                or_(
                    UserModel.employee_id.ilike(clean_term),
                    UserModel.email.ilike(clean_term)
                )
            )
        )

    def create(self, user_in: UserCreate) -> UserModel:
        user_id = f"u_{uuid.uuid4().hex[:8]}"
        password = user_in.password or "password123"
        user = UserModel(
            id=user_id,
            name=user_in.name,
            employee_id=user_in.employeeId,
            email=user_in.email,
            password_hash=get_password_hash(password),
            team_id=user_in.teamId if user_in.teamId else None,
            role=user_in.role,
            status=user_in.status,
            avatar_color=user_in.avatarColor,
            score=0,
            rank=0,
            activities_completed=0,
            joined_date="2025-01-01",
            last_active="Just now"
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        self.recalculate_ranks()
        return user

    def update(self, user_id: str, user_in: UserUpdate) -> Optional[UserModel]:
        user = self.get_by_id(user_id)
        if not user:
            return None
        
        update_data = user_in.model_dump(exclude_unset=True)
        if "password" in update_data:
            pwd = update_data.pop("password")
            if pwd and str(pwd).strip():
                update_data["password_hash"] = get_password_hash(pwd)
        
        if "employeeId" in update_data:
            update_data["employee_id"] = update_data.pop("employeeId")
        if "teamId" in update_data:
            update_data["team_id"] = update_data.pop("teamId")
        if "avatarColor" in update_data:
            update_data["avatar_color"] = update_data.pop("avatarColor")

        for field, value in update_data.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user_id: str) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False
        self.db.delete(user)
        self.db.commit()
        self.recalculate_ranks()
        return True

    def recalculate_ranks(self) -> None:
        users = self.db.scalars(select(UserModel).order_by(UserModel.score.desc())).all()
        for idx, u in enumerate(users, start=1):
            u.rank = idx
        self.db.commit()
