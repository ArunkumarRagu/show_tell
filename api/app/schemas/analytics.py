from typing import List, Any
from pydantic import BaseModel

class TeamPerformanceItem(BaseModel):
    name: str
    score: int
    color: str

class IndividualPerformanceItem(BaseModel):
    week: str
    score: int

class DifficultyBreakdownItem(BaseModel):
    difficulty: str
    completed: int
    avgScore: int
    total: int

class CompletionRateItem(BaseModel):
    label: str
    value: int
    color: str

class AnalyticsOverview(BaseModel):
    totalUsers: int
    activeUsers: int
    totalTeams: int
    totalActivities: int
    activeActivities: int
    totalCompletions: int
    avgCompletionRate: float
    teamPerformance: List[TeamPerformanceItem]
    individualPerformance: List[IndividualPerformanceItem]
    difficultyBreakdown: List[DifficultyBreakdownItem]
    completionRateData: List[CompletionRateItem]

class SystemSettingsUpdate(BaseModel):
    competitionName: str = "HAT Show & Tell"
    allowSelfRegistration: bool = False
    maxTeamSize: int = 10
    defaultPassingScore: int = 60
    enableLeaderboard: bool = True
