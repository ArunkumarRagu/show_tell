from sqlalchemy.orm import Session
from app.models.settings import SystemSettingsModel
from app.core.logging import logger

SETTINGS_DATA = {
    "competitionName": "HAT Converse",
    "allowSelfRegistration": False,
    "maxTeamSize": 10,
    "defaultPassingScore": 60,
    "enableLeaderboard": True
}

def create_settings(db: Session) -> None:
    logger.info("Creating / updating system settings...")
    existing_settings = db.get(SystemSettingsModel, "global")
    if existing_settings:
        existing_settings.value = SETTINGS_DATA
    else:
        db.add(SystemSettingsModel(key="global", value=SETTINGS_DATA))
    db.commit()
    logger.info("Successfully seeded global system settings.")

if __name__ == "__main__":
    from app.core.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        create_settings(session)
    finally:
        session.close()
