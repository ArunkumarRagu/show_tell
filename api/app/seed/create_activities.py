from sqlalchemy.orm import Session
from app.models.activity import ActivityModel, QuestionModel
from app.core.logging import logger

ACTIVITIES_DATA = [
    {
        "id": "a1", "name": "Code Review Sprint", "description": "Review pull requests, identify bugs, and suggest optimizations under time pressure.",
        "instructions": "You will be shown 3 code snippets. For each, identify the bug and select the correct fix.",
        "difficulty": "Easy", "time_limit": 300, "max_score": 100, "passing_score": 60, "status": "active", "category": "Engineering", "activity_type": "individual", "completions": 142, "avg_score": 78.0,
        "questions": [
            {"id": "q1_1", "prompt": "What is the output of: `console.log(typeof null)`?", "options": ['"null"', '"object"', '"undefined"', '"boolean"'], "correct_index": 1},
            {"id": "q1_2", "prompt": "Which method removes the last element of an array?", "options": ['shift()', 'pop()', 'remove()', 'delete()'], "correct_index": 1},
            {"id": "q1_3", "prompt": "What does `===` check that `==` does not?", "options": ['Value only', 'Type only', 'Both type and value', 'Reference'], "correct_index": 2},
        ]
    },
    {
        "id": "a2", "name": "System Design Challenge", "description": "Design a scalable URL shortener architecture with latency constraints.",
        "instructions": "Answer 3 multiple-choice questions about high-scale system trade-offs.",
        "difficulty": "Hard", "time_limit": 600, "max_score": 300, "passing_score": 180, "status": "active", "category": "Architecture", "activity_type": "group", "completions": 64, "avg_score": 195.0,
        "questions": [
            {"id": "q2_1", "prompt": "For a URL shortener at 100M requests/day, which database is most appropriate for the redirect path?", "options": ['PostgreSQL with indexes', 'Redis/Memcached cache layer', 'MongoDB', 'SQLite'], "correct_index": 1},
            {"id": "q2_2", "prompt": "What is the primary trade-off of using base62 encoding for short URLs?", "options": ['Longer URLs', 'Collision risk increases', 'No trade-off', 'Slower lookups'], "correct_index": 1},
            {"id": "q2_3", "prompt": "Which approach best handles hot URLs under viral load?", "options": ['Database replication', 'Edge caching with TTL', 'Client-side caching only', 'Sharding by hash'], "correct_index": 1},
        ]
    },
]

def create_activities(db: Session) -> None:
    logger.info("Creating / updating initial activities & questions...")
    for act in ACTIVITIES_DATA:
        act_dict = dict(act)
        q_list = act_dict.pop("questions", [])
        act_id = act_dict["id"]

        existing_act = db.get(ActivityModel, act_id)
        if existing_act:
            for key, value in act_dict.items():
                setattr(existing_act, key, value)
        else:
            db.add(ActivityModel(**act_dict))
        db.flush()

        for q in q_list:
            q_id = q["id"]
            existing_q = db.get(QuestionModel, q_id)
            if existing_q:
                for key, value in q.items():
                    setattr(existing_q, key, value)
            else:
                db.add(QuestionModel(activity_id=act_id, **q))
    db.commit()
    logger.info(f"Successfully seeded {len(ACTIVITIES_DATA)} activities and their questions.")

if __name__ == "__main__":
    from app.core.database import SessionLocal, engine, Base
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    try:
        create_activities(session)
    finally:
        session.close()
