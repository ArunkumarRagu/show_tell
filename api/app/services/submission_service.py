from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.repositories.activity_repository import ActivityRepository
from app.repositories.user_repository import UserRepository
from app.repositories.team_repository import TeamRepository
from app.repositories.log_repository import LogRepository
from app.schemas.activity import ActivitySubmissionResult
from app.core.logging import logger

class SubmissionService:
    def __init__(self, db: Session):
        self.db = db
        self.activity_repo = ActivityRepository(db)
        self.user_repo = UserRepository(db)
        self.team_repo = TeamRepository(db)
        self.log_repo = LogRepository(db)

    def submit_activity(
        self,
        activity_id: str,
        user_id: str,
        answers: List[int],
        time_taken: int
    ) -> ActivitySubmissionResult:
        activity = self.activity_repo.get_by_id(activity_id)
        if not activity:
            raise ValueError("Activity not found")

        user = self.user_repo.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        questions = activity.questions
        total_questions = len(questions)
        correct_questions = 0

        for i, q in enumerate(questions):
            if i < len(answers) and answers[i] == q.correct_index:
                correct_questions += 1

        # Calculate score based on accuracy
        if total_questions > 0:
            score = int((correct_questions / total_questions) * activity.max_score)
        else:
            score = activity.max_score

        status = "completed" if score >= activity.passing_score else "failed"

        # 1. Create activity log
        log = self.log_repo.create_activity_log(
            user_id=user.id,
            user_name=user.name,
            activity_id=activity.id,
            activity_name=activity.name,
            difficulty=activity.difficulty,
            score=score,
            time_taken=time_taken,
            status=status
        )

        # 2. Update user score & activities_completed
        user.score += score
        user.activities_completed += 1
        self.db.commit()
        self.user_repo.recalculate_ranks()

        # 3. Update team score & activities_completed if user belongs to a team
        if user.team_id:
            team = self.team_repo.get_by_id(user.team_id)
            if team:
                team.score += score
                team.activities_completed += 1
                self.db.commit()
                self.team_repo.recalculate_ranks()

        # 4. Update activity statistics
        activity.completions += 1
        # Recalculate average score
        all_logs = [l for l in activity.activity_logs]
        if all_logs:
            avg = sum(l.score for l in all_logs) / len(all_logs)
            activity.avg_score = round(avg, 1)
        self.db.commit()

        logger.info(f"User {user.employee_id} completed activity '{activity.name}' with score {score}/{activity.max_score} ({status})")

        return ActivitySubmissionResult(
            logId=log.id,
            score=score,
            maxScore=activity.max_score,
            passingScore=activity.passing_score,
            status=status,
            timeTaken=time_taken,
            totalQuestions=total_questions,
            correctQuestions=correct_questions
        )
