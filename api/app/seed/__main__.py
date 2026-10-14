from app.core.database import SessionLocal, engine, Base
from app.seed.run_all import run_all_seeds

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        run_all_seeds(session)
    finally:
        session.close()
