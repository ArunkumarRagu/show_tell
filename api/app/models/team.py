from typing import List, TYPE_CHECKING
from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import UserModel

class TeamModel(Base, TimestampMixin):
    __tablename__ = "teams"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    color: Mapped[str] = mapped_column(String(32), default="#7C3AED")
    score: Mapped[int] = mapped_column(Integer, default=0, index=True)
    activities_completed: Mapped[int] = mapped_column(Integer, default=0)
    rank: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), default="active", index=True)
    description: Mapped[str] = mapped_column(Text, default="")

    users: Mapped[List["UserModel"]] = relationship("UserModel", back_populates="team")
