from typing import TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin

if TYPE_CHECKING:
    from app.models.user import UserModel
    from app.models.activity import ActivityModel

class ActivityLogModel(Base, TimestampMixin):
    __tablename__ = "activity_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    activity_id: Mapped[str] = mapped_column(String(64), ForeignKey("activities.id", ondelete="CASCADE"), index=True, nullable=False)
    user_name: Mapped[str] = mapped_column(String(128), default="")
    activity_name: Mapped[str] = mapped_column(String(128), default="")
    difficulty: Mapped[str] = mapped_column(String(32), default="Easy")
    score: Mapped[int] = mapped_column(Integer, default=0)
    time_taken: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), default="completed", index=True)
    date: Mapped[str] = mapped_column(String(64), default="")

    user: Mapped["UserModel"] = relationship("UserModel", back_populates="activity_logs")
    activity: Mapped["ActivityModel"] = relationship("ActivityModel", back_populates="activity_logs")


class AdminLogModel(Base, TimestampMixin):
    __tablename__ = "admin_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_name: Mapped[str] = mapped_column(String(128), default="Admin Root")
    action: Mapped[str] = mapped_column(String(256), nullable=False)
    target: Mapped[str] = mapped_column(String(256), default="")
    status: Mapped[str] = mapped_column(String(32), default="success")
    timestamp: Mapped[str] = mapped_column(String(64), default="")
