from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

class UserBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(..., min_length=2, max_length=128)
    employeeId: str = Field(alias="employee_id")
    email: EmailStr
    teamId: Optional[str] = Field(default=None, alias="team_id")
    role: str = Field(default="user")
    status: str = Field(default="active")
    avatarColor: str = Field(default="#7C3AED", alias="avatar_color")

class UserCreate(UserBase):
    password: Optional[str] = Field(default="password123")

class UserUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    employeeId: Optional[str] = Field(default=None, alias="employee_id")
    email: Optional[EmailStr] = None
    teamId: Optional[str] = Field(default=None, alias="team_id")
    role: Optional[str] = None
    status: Optional[str] = None
    avatarColor: Optional[str] = Field(default=None, alias="avatar_color")
    password: Optional[str] = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    name: str
    employeeId: str = Field(alias="employee_id")
    email: str
    teamId: Optional[str] = Field(default="", alias="team_id")
    teamName: Optional[str] = Field(default="", alias="team_name")
    score: int = 0
    rank: int = 0
    status: str = "active"
    role: str = "user"
    activitiesCompleted: int = Field(alias="activities_completed", default=0)
    avatarColor: str = Field(alias="avatar_color", default="#7C3AED")
    joinedDate: str = Field(alias="joined_date", default="")
    lastActive: str = Field(alias="last_active", default="")
