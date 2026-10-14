from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

class TeamBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=128)
    color: str = Field(default="#7C3AED")
    description: str = Field(default="")
    status: str = Field(default="active")

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class TeamResponse(TeamBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    score: int = 0
    activitiesCompleted: int = Field(alias="activities_completed", default=0)
    rank: int = 0
