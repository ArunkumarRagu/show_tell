from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class QuestionBase(BaseModel):
    prompt: str
    options: List[str]
    correctIndex: int = Field(alias="correct_index")

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    prompt: str
    options: List[str]
    correctIndex: int = Field(alias="correct_index")

class ActivityBase(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(..., min_length=2, max_length=128)
    description: str = Field(default="")
    instructions: str = Field(default="")
    difficulty: str = Field(default="Easy")
    timeLimit: int = Field(alias="time_limit", default=300)
    maxScore: int = Field(alias="max_score", default=100)
    passingScore: int = Field(alias="passing_score", default=60)
    status: str = Field(default="active")
    category: str = Field(default="Engineering")
    activityType: str = Field(alias="activity_type", default="individual")

class ActivityCreate(ActivityBase):
    questions: List[QuestionCreate] = Field(default_factory=list)

class ActivityUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    description: Optional[str] = None
    instructions: Optional[str] = None
    difficulty: Optional[str] = None
    timeLimit: Optional[int] = Field(default=None, alias="time_limit")
    maxScore: Optional[int] = Field(default=None, alias="max_score")
    passingScore: Optional[int] = Field(default=None, alias="passing_score")
    status: Optional[str] = None
    category: Optional[str] = None
    activityType: Optional[str] = Field(default=None, alias="activity_type")
    questions: Optional[List[QuestionCreate]] = None

class ActivityResponse(ActivityBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    completions: int = 0
    avgScore: float = Field(alias="avg_score", default=0.0)
    questions: List[QuestionResponse] = Field(default_factory=list)

class ActivitySubmissionRequest(BaseModel):
    answers: List[int] = Field(..., description="Selected option index for each question")
    timeTaken: int = Field(..., description="Time taken in seconds")

class ActivitySubmissionResult(BaseModel):
    logId: str
    score: int
    maxScore: int
    passingScore: int
    status: str  # completed, failed
    timeTaken: int
    totalQuestions: int
    correctQuestions: int
