from pydantic import BaseModel
from typing import Dict

class SalaryInput(BaseModel):
    user_id: str
    amount: float
    # Format: "YYYY-MM" (e.g., "2026-02")
    month: str 

class AllocationResponse(BaseModel):
    salary: float
    predicted_allocation: Dict[str, float]