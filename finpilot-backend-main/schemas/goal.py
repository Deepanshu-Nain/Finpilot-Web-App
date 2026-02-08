from pydantic import BaseModel
from typing import Optional

class GoalInput(BaseModel):
    user_id: str
    target_amount: float
    duration_months: int

class GoalResponse(BaseModel):
    goal_id: str
    suggestion: str
    monthly_amount: float
    expected_return: float