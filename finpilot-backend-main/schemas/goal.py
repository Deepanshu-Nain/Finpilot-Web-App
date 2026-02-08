from pydantic import BaseModel
from typing import Optional

class GoalInput(BaseModel):
    user_id: str
    target_amount: float
    duration_months: int
    name: str = "Untitled Goal"
    icon: str = "🎯"
    deadline: Optional[str] = None  # ISO date string e.g. "2026-12-31"
    current_amount: float = 0.0
    color: str = "hsl(142, 40%, 45%)"

class GoalResponse(BaseModel):
    goal_id: str
    suggestion: str
    monthly_amount: float
    expected_return: float

class GoalFullResponse(BaseModel):
    goal_id: str
    user_id: str
    name: str
    target_amount: float
    current_amount: float
    deadline: Optional[str] = None
    icon: str
    color: str
    suggestion: str
    monthly_amount: float
    expected_return: float
    duration_months: int

class GoalUpdateInput(BaseModel):
    amount: float  # Amount to add to current_amount

class GoalDeleteResponse(BaseModel):
    status: str
    message: str