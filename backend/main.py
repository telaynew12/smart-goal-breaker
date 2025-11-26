from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from dotenv import load_dotenv

from database import get_db, init_db, Goal, Task
from schemas import GoalCreate, GoalResponse, TaskResponse
from ai_service import break_down_goal

load_dotenv()

app = FastAPI(title="Smart Goal Breaker API", version="1.0.0")

# CORS configuration
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:3000,https://smart-goal-breaker-29os.vercel.app")
cors_origins = [origin.strip() for origin in cors_origins_str.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()


@app.get("/")
async def root():
    return {"message": "Smart Goal Breaker API is running!"}


@app.post("/goals", response_model=GoalResponse, status_code=201)
async def create_goal(goal: GoalCreate, db: Session = Depends(get_db)):
    """
    Create a new goal and break it down into 5 actionable tasks using AI
    """
    try:
        # Use AI to break down the goal
        breakdown = break_down_goal(goal.title)
        
        # Create goal in database
        db_goal = Goal(
            title=goal.title,
            complexity_score=breakdown["complexity_score"]
        )
        db.add(db_goal)
        db.flush()  # Flush to get the goal ID
        
        # Create tasks in database
        for index, task_title in enumerate(breakdown["tasks"], start=1):
            db_task = Task(
                goal_id=db_goal.id,
                title=task_title,
                order=index
            )
            db.add(db_task)
        
        db.commit()
        db.refresh(db_goal)
        
        return db_goal
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@app.get("/goals/{goal_id}", response_model=GoalResponse)
async def get_goal(goal_id: str, db: Session = Depends(get_db)):
    """
    Get a goal by ID with its tasks
    """
    try:
        goal_uuid = uuid.UUID(goal_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid goal ID format")
    
    goal = db.query(Goal).filter(Goal.id == goal_uuid).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    return goal


@app.get("/goals", response_model=List[GoalResponse])
async def get_all_goals(db: Session = Depends(get_db)):
    """
    Get all goals with their tasks
    """
    goals = db.query(Goal).order_by(Goal.created_at.desc()).all()
    return goals

