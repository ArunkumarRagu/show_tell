from sqlalchemy.orm import Session
from app.models.user import UserModel
from app.core.security import get_password_hash
from app.core.logging import logger

def get_users_data():
    default_hash = get_password_hash("password123")
    admin_hash = get_password_hash("admi")
    avatar_colors = ["#954DF9", "#4A9DFF", "#FF6004", "#00D084", "#F43F5E", "#9100CF"]

    return [
        {"id": "admin1", "name": "Admin Root", "employee_id": "ADM001", "email": "admin@hatconverse.co", "password_hash": admin_hash, "team_id": "t1", "score": 0, "rank": 0, "status": "active", "role": "admin", "activities_completed": 0, "avatar_color": "#0f172a", "joined_date": "2025-01-01", "last_active": "2026-08-14 10:30"},
        {"id": "u1", "name": "Alex Carter", "employee_id": "EMP001", "email": "alex.carter@hatconverse.co", "password_hash": default_hash, "team_id": "t1", "score": 1240, "rank": 1, "status": "active", "role": "user", "activities_completed": 12, "avatar_color": avatar_colors[0], "joined_date": "2025-01-15", "last_active": "2026-08-14 09:42"},
        {"id": "u2", "name": "Maya Singh", "employee_id": "EMP002", "email": "maya.singh@hatconverse.co", "password_hash": default_hash, "team_id": "t1", "score": 1180, "rank": 2, "status": "active", "role": "user", "activities_completed": 11, "avatar_color": avatar_colors[1], "joined_date": "2025-01-20", "last_active": "2026-08-14 08:15"},
        {"id": "u3", "name": "Jordan Lee", "employee_id": "EMP003", "email": "jordan.lee@hatconverse.co", "password_hash": default_hash, "team_id": "t1", "score": 1100, "rank": 4, "status": "active", "role": "user", "activities_completed": 10, "avatar_color": avatar_colors[2], "joined_date": "2025-02-01", "last_active": "2026-08-13 17:30"},
        {"id": "u4", "name": "Sam Rivera", "employee_id": "EMP004", "email": "sam.rivera@hatconverse.co", "password_hash": default_hash, "team_id": "t1", "score": 1300, "rank": 3, "status": "active", "role": "user", "activities_completed": 13, "avatar_color": avatar_colors[3], "joined_date": "2025-01-10", "last_active": "2026-08-14 10:05"},
        {"id": "u5", "name": "Riley Chen", "employee_id": "EMP005", "email": "riley.chen@hatconverse.co", "password_hash": default_hash, "team_id": "t2", "score": 1150, "rank": 5, "status": "active", "role": "user", "activities_completed": 11, "avatar_color": avatar_colors[4], "joined_date": "2025-01-18", "last_active": "2026-08-14 09:00"},
        {"id": "u6", "name": "Casey Park", "employee_id": "EMP006", "email": "casey.park@hatconverse.co", "password_hash": default_hash, "team_id": "t2", "score": 1080, "rank": 6, "status": "active", "role": "user", "activities_completed": 10, "avatar_color": avatar_colors[5], "joined_date": "2025-02-05", "last_active": "2026-08-13 16:45"},
    ]

def create_users(db: Session) -> None:
    logger.info("Creating / updating initial users & admins...")
    users_data = get_users_data()
    for u in users_data:
        existing = db.get(UserModel, u["id"])
        if existing:
            for key, value in u.items():
                setattr(existing, key, value)
        else:
            db.add(UserModel(**u))
    db.commit()
    logger.info(f"Successfully seeded {len(users_data)} users and admin accounts.")

if __name__ == "__main__":
    from app.core.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        create_users(session)
    finally:
        session.close()
