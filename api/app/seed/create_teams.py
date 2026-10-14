from sqlalchemy.orm import Session
from app.models.team import TeamModel
from app.core.logging import logger

TEAMS_DATA = [
    {"id": "t1", "name": "Phoenix", "color": "#954DF9", "score": 4820, "activities_completed": 38, "rank": 1, "status": "active", "description": "Rise from the ashes, every time."},
    {"id": "t2", "name": "Titans", "color": "#4A9DFF", "score": 4350, "activities_completed": 35, "rank": 2, "status": "active", "description": "Strength in every member."},
    {"id": "t3", "name": "Falcon", "color": "#FF6004", "score": 3980, "activities_completed": 31, "rank": 3, "status": "active", "description": "Swift, sharp, and precise."},
    {"id": "t4", "name": "Orion", "color": "#00D084", "score": 3420, "activities_completed": 28, "rank": 4, "status": "active", "description": "Navigating the stars of innovation."},
    {"id": "t5", "name": "Vortex", "color": "#F43F5E", "score": 2950, "activities_completed": 24, "rank": 5, "status": "active", "description": "Spin the challenge, own the result."},
    {"id": "t6", "name": "Nexus", "color": "#9100CF", "score": 2480, "activities_completed": 20, "rank": 6, "status": "active", "description": "Where every connection counts."},
]

def create_teams(db: Session) -> None:
    logger.info("Creating / updating initial teams...")
    for t in TEAMS_DATA:
        existing = db.get(TeamModel, t["id"])
        if existing:
            for key, value in t.items():
                setattr(existing, key, value)
        else:
            db.add(TeamModel(**t))
    db.commit()
    logger.info(f"Successfully seeded {len(TEAMS_DATA)} teams.")

if __name__ == "__main__":
    from app.core.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        create_teams(session)
    finally:
        session.close()
