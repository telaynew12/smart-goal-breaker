from pydantic import BaseModel
from typing import List
from datetime import datetime
import uuid


class TaskCreate(BaseModel):
    title: str
    order: int


class TaskResponse(BaseModel):
    id: uuid.UUID
    title: str
    order: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class GoalCreate(BaseModel):
    title: str


class GoalResponse(BaseModel):
    id: uuid.UUID
    title: str
    complexity_score: float
    created_at: datetime
    tasks: List[TaskResponse]
    
    class Config:
        from_attributes = True

