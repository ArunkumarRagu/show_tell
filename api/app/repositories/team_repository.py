from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models.team import TeamModel
from app.models.user import UserModel
from app.schemas.team import TeamCreate, TeamUpdate
import uuid

class TeamRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[TeamModel]:
        return list(self.db.scalars(select(TeamModel).order_by(TeamModel.score.desc())).all())

    def get_paginated(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> Tuple[List[TeamModel], int]:
        stmt = select(TeamModel)
        total_count = self.db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
        offset = (page - 1) * page_size
        items = list(self.db.scalars(stmt.order_by(TeamModel.score.desc()).offset(offset).limit(page_size)).all())
        return items, total_count


    def get_by_id(self, team_id: str) -> Optional[TeamModel]:
        return self.db.scalar(select(TeamModel).where(TeamModel.id == team_id))

    def get_by_name(self, name: str) -> Optional[TeamModel]:
        return self.db.scalar(select(TeamModel).where(TeamModel.name == name))

    def create(self, team_in: TeamCreate) -> TeamModel:
        team_id = f"t_{uuid.uuid4().hex[:8]}"
        team = TeamModel(
            id=team_id,
            name=team_in.name,
            color=team_in.color,
            description=team_in.description,
            status=team_in.status,
            score=0,
            activities_completed=0,
            rank=0
        )
        self.db.add(team)
        self.db.commit()
        self.db.refresh(team)
        self.recalculate_ranks()
        return team

    def update(self, team_id: str, team_in: TeamUpdate) -> Optional[TeamModel]:
        team = self.get_by_id(team_id)
        if not team:
            return None
        update_data = team_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(team, field, value)
        self.db.commit()
        self.db.refresh(team)
        return team

    def delete(self, team_id: str) -> bool:
        team = self.get_by_id(team_id)
        if not team:
            return False
        # Remove team_id from associated users
        self.db.query(UserModel).filter(UserModel.team_id == team_id).update({"team_id": None})
        self.db.delete(team)
        self.db.commit()
        self.recalculate_ranks()
        return True

    def recalculate_ranks(self) -> None:
        teams = self.db.scalars(select(TeamModel).order_by(TeamModel.score.desc())).all()
        for idx, t in enumerate(teams, start=1):
            t.rank = idx
        self.db.commit()
