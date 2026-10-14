from typing import List, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.log import ActivityLogModel

class ActivityModel(Base, TimestampMixin):
    __tablename__ = "activities"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    instructions: Mapped[str] = mapped_column(Text, default="")
    difficulty: Mapped[str] = mapped_column(String(32), default="Easy", index=True)
    time_limit: Mapped[int] = mapped_column(Integer, default=300)
    max_score: Mapped[int] = mapped_column(Integer, default=100)
    passing_score: Mapped[int] = mapped_column(Integer, default=60)
    status: Mapped[str] = mapped_column(String(32), default="active", index=True)
    category: Mapped[str] = mapped_column(String(64), default="General", index=True)
    activity_type: Mapped[str] = mapped_column(String(32), default="individual")
    completions: Mapped[int] = mapped_column(Integer, default=0)
    avg_score: Mapped[float] = mapped_column(Float, default=0.0)

    questions: Mapped[List["QuestionModel"]] = relationship("QuestionModel", back_populates="activity", cascade="all, delete-orphan")
    activity_logs: Mapped[List["ActivityLogModel"]] = relationship("ActivityLogModel", back_populates="activity", cascade="all, delete-orphan")


class QuestionModel(Base, TimestampMixin):
    __tablename__ = "questions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    activity_id: Mapped[str] = mapped_column(String(64), ForeignKey("activities.id", ondelete="CASCADE"), index=True, nullable=False)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    correct_index: Mapped[int] = mapped_column(Integer, default=0)

    activity: Mapped["ActivityModel"] = relationship("ActivityModel", back_populates="questions")
