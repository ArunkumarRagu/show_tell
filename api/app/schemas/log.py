from pydantic import BaseModel, Field, ConfigDict

class ActivityLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    userId: str = Field(alias="user_id")
    userName: str = Field(alias="user_name", default="")
    activityId: str = Field(alias="activity_id")
    activityName: str = Field(alias="activity_name", default="")
    difficulty: str = "Easy"
    score: int = 0
    timeTaken: int = Field(alias="time_taken", default=0)
    status: str = "completed"
    date: str = ""

class AdminLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    user: str = Field(alias="user_name", default="Admin Root")
    action: str
    target: str = ""
    timestamp: str = ""
    status: str = "success"
