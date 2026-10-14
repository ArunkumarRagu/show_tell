from sqlalchemy.orm import Session
from app.models.log import ActivityLogModel, AdminLogModel
from app.core.logging import logger

ACTIVITY_LOGS_DATA = [
    {"id": "l1", "user_id": "u1", "user_name": "Alex Carter", "activity_id": "a1", "activity_name": "Code Review Sprint", "difficulty": "Easy", "score": 92, "time_taken": 245, "status": "completed", "date": "2026-08-14 09:30"},
    {"id": "l2", "user_id": "u1", "user_name": "Alex Carter", "activity_id": "a2", "activity_name": "System Design Challenge", "difficulty": "Hard", "score": 210, "time_taken": 540, "status": "completed", "date": "2026-08-11 16:00"},
]

ADMIN_LOGS_DATA = [
    {"id": "al1", "user_name": "Admin Root", "action": "Created activity", "target": "System Design Challenge", "timestamp": "2026-08-14 10:15", "status": "success"},
]

def create_logs(db: Session) -> None:
    logger.info("Creating / updating initial activity and admin audit logs...")
    for log in ACTIVITY_LOGS_DATA:
        existing_log = db.get(ActivityLogModel, log["id"])
        if existing_log:
            for key, value in log.items():
                setattr(existing_log, key, value)
        else:
            db.add(ActivityLogModel(**log))

    for al in ADMIN_LOGS_DATA:
        existing_al = db.get(AdminLogModel, al["id"])
        if existing_al:
            for key, value in al.items():
                setattr(existing_al, key, value)
        else:
            db.add(AdminLogModel(**al))

    db.commit()
    logger.info(f"Successfully seeded {len(ACTIVITY_LOGS_DATA)} activity logs and {len(ADMIN_LOGS_DATA)} admin logs.")

if __name__ == "__main__":
    from app.core.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        create_logs(session)
    finally:
        session.close()
