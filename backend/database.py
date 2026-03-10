from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os

# SQLite — zero-config, file-based. Database is created automatically on startup.
# To use PostgreSQL, set env var: DATABASE_URL=postgresql+psycopg2://user:pass@host/db
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./alloqr.db",
)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
