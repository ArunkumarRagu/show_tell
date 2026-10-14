from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.logging import logger
from app.seed.create_teams import create_teams
from app.seed.create_users import create_users
from app.seed.create_activities import create_activities
from app.seed.create_logs import create_logs
from app.seed.create_settings import create_settings

def run_all_seeds(db: Session) -> None:
    logger.info("Starting complete HAT Converse database seeding pipeline...")
    create_teams(db)
    create_users(db)
    create_activities(db)
    create_logs(db)
    create_settings(db)
    logger.info("🎉 Complete HAT Converse database seeding completed successfully!")

if __name__ == "__main__":
    logger.info("Initializing database schema if needed...")
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        run_all_seeds(session)
    finally:
        session.close()
