from sqlalchemy.orm import Session
from app.seed.run_all import run_all_seeds

def seed_initial_data(db: Session) -> None:
    run_all_seeds(db)

if __name__ == "__main__":
    from app.core.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        seed_initial_data(session)
    finally:
        session.close()
