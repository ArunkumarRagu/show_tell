from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.team import TeamModel
    from app.models.log import ActivityLogModel

class UserModel(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), nullable=False)
    team_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("teams.id", ondelete="SET NULL"), nullable=True, index=True)
    score: Mapped[int] = mapped_column(Integer, default=0, index=True)
    rank: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), default="active", index=True)
    role: Mapped[str] = mapped_column(String(32), default="user", index=True)
    activities_completed: Mapped[int] = mapped_column(Integer, default=0)
    avatar_color: Mapped[str] = mapped_column(String(32), default="#7C3AED")
    joined_date: Mapped[str] = mapped_column(String(64), default="")
    last_active: Mapped[str] = mapped_column(String(64), default="")

    team: Mapped[Optional["TeamModel"]] = relationship("TeamModel", back_populates="users")
    activity_logs: Mapped[List["ActivityLogModel"]] = relationship("ActivityLogModel", back_populates="user", cascade="all, delete-orphan")
