from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
import uuid
from dotenv import load_dotenv
# psycopg2-binary is installed as a dependency for SQLAlchemy PostgreSQL support

load_dotenv()

# Try to get DATABASE_URL first, if not available, construct it from individual variables
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Fetch individual database variables from environment
    USER = os.getenv("user") or os.getenv("DB_USER") or "postgres"
    PASSWORD = os.getenv("password") or os.getenv("DB_PASSWORD")
    HOST = os.getenv("host") or os.getenv("DB_HOST") or "localhost"
    PORT = os.getenv("port") or os.getenv("DB_PORT") or "5432"
    DBNAME = os.getenv("dbname") or os.getenv("DB_NAME") or "postgres"
    
    if not PASSWORD:
        raise ValueError("Database password must be provided via 'password' or 'DB_PASSWORD' environment variable")
    
    # Construct DATABASE_URL from individual components
    DATABASE_URL = f"postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

# Create SQLAlchemy engine
# Note: Supabase transaction pooler doesn't support PREPARE statements
# So we disable prepared statements by setting connect_args
engine = create_engine(
    DATABASE_URL,
    connect_args={
        "options": "-c statement_timeout=30000"  # 30 second timeout
    },
    # Disable connection pooling at SQLAlchemy level since Supabase handles pooling
    pool_pre_ping=True,  # Verify connections before using
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    title = Column(String(500), nullable=False)
    complexity_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    tasks = relationship("Task", back_populates="goal", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    goal_id = Column(UUID(as_uuid=True), ForeignKey("goals.id"), nullable=False)
    title = Column(Text, nullable=False)
    order = Column(Integer, nullable=False)  # Order of the task (1-5)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    goal = relationship("Goal", back_populates="tasks")


def init_db():
    """Create all tables in the database"""
    try:
        # Test connection first
        connection = engine.connect()
        
        # Enable UUID extension if not already enabled
        from sqlalchemy import text
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"))
        connection.commit()
        connection.close()
        print("✅ Database connection successful!")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")
        raise


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

