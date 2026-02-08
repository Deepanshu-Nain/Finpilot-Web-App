from pydantic import BaseModel
from typing import Optional, List

class TransactionInput(BaseModel):
    user_id: str
    amount: float
    type: str       # "credit" or "debit"
    category: str   # e.g., "food", "rent", "salary"
    date: str       # Format: "YYYY-MM-DD"
    description: Optional[str] = None

class TransactionResponse(BaseModel):
    id: str
    amount: float
    type: str
    category: str
    date: str
    description: str

class CategorySummary(BaseModel):
    category: str
    allocated: float
    spent: float
    remaining: float
    status: str  # "over_budget" or "within_budget"

class DashboardSummaryResponse(BaseModel):
    month: str
    total_budget: float
    total_spent: float
    remaining_salary: float
    breakdown: List[CategorySummary]