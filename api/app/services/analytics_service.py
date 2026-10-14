from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.repositories.team_repository import TeamRepository
from app.repositories.activity_repository import ActivityRepository
from app.repositories.log_repository import LogRepository
from app.schemas.analytics import (
    AnalyticsOverview,
    TeamPerformanceItem,
    IndividualPerformanceItem,
    DifficultyBreakdownItem,
    CompletionRateItem,
)

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.team_repo = TeamRepository(db)
        self.activity_repo = ActivityRepository(db)
        self.log_repo = LogRepository(db)

    def get_overview(self) -> AnalyticsOverview:
        users = self.user_repo.get_all()
        teams = self.team_repo.get_all()
        activities = self.activity_repo.get_all()
        logs = self.log_repo.get_all_activity_logs()

        total_users = len(users)
        active_users = len([u for u in users if u.status == "active"])

        total_teams = len(teams)
        total_activities = len(activities)
        active_activities = len([a for a in activities if a.status == "active"])

        total_completions = len(logs)
        avg_completion_rate = round((active_users / max(total_users, 1)) * 100, 1)

        # Team performance
        team_perf = [
            TeamPerformanceItem(name=t.name, score=t.score, color=t.color)
            for t in teams
        ]

        # Individual trend (mock weekly sample data for analytics visualization)
        indiv_perf = [
            IndividualPerformanceItem(week="W1", score=320),
            IndividualPerformanceItem(week="W2", score=480),
            IndividualPerformanceItem(week="W3", score=410),
            IndividualPerformanceItem(week="W4", score=620),
            IndividualPerformanceItem(week="W5", score=580),
            IndividualPerformanceItem(week="W6", score=740),
            IndividualPerformanceItem(week="W7", score=890),
            IndividualPerformanceItem(week="W8", score=max(1240, sum(u.score for u in users[:3]))),
        ]

        # Difficulty breakdown
        diff_stats = {}
        for diff in ["Easy", "Medium", "Hard"]:
            diff_acts = [a for a in activities if a.difficulty == diff]
            diff_logs = [l for l in logs if l.difficulty == diff]
            completed_cnt = len(diff_logs)
            avg_s = int(sum(l.score for l in diff_logs) / max(completed_cnt, 1)) if diff_logs else 0
            diff_stats[diff] = DifficultyBreakdownItem(
                difficulty=diff,
                completed=completed_cnt,
                avgScore=avg_s,
                total=len(diff_acts)
            )

        difficulty_breakdown = list(diff_stats.values())

        completion_rate_data = [
            CompletionRateItem(label="Completed", value=total_completions, color="#10b981"),
            CompletionRateItem(label="Remaining", value=max(0, (active_activities * active_users) - total_completions), color="#e2e8f0"),
        ]

        return AnalyticsOverview(
            totalUsers=total_users,
            activeUsers=active_users,
            totalTeams=total_teams,
            totalActivities=total_activities,
            activeActivities=active_activities,
            totalCompletions=total_completions,
            avgCompletionRate=avg_completion_rate,
            teamPerformance=team_perf,
            individualPerformance=indiv_perf,
            difficultyBreakdown=difficulty_breakdown,
            completionRateData=completion_rate_data,
        )
