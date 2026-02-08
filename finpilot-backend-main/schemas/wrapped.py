from pydantic import BaseModel
from typing import List, Optional, Dict


class CategoryBreakdown(BaseModel):
    category: str
    amount: float
    percentage: float
    icon: str = ""


class WeeklyData(BaseModel):
    week_label: str  # "Week 1", "Week 2", etc.
    income: float
    expenses: float
    savings: float


class BiggestTransaction(BaseModel):
    amount: float
    category: str
    date: str
    description: str


class GoalSummary(BaseModel):
    total_goals: int
    completed: int
    in_progress: int
    total_saved: float
    total_target: float


class WrappedSummaryResponse(BaseModel):
    year: int
    month: int
    month_name: str
    user_name: str

    # Core financials
    total_income: float
    total_expenses: float
    total_savings: float
    savings_rate: float

    # Comparison with previous month
    income_change: float
    expense_change: float
    savings_change: float

    # Transaction stats
    total_transactions: int
    average_daily_spending: float

    # Category insights
    top_categories: List[CategoryBreakdown]
    most_consistent_category: str

    # Notable transactions
    biggest_transaction: Optional[BiggestTransaction]

    # Weekly breakdown within the month
    weekly_data: List[WeeklyData]
    highest_spending_week: str
    best_savings_week: str

    # Goals
    goals_summary: GoalSummary

    # Fun stats
    daily_average_spend: float
    transactions_per_week: float
    top_spending_day_of_week: str
    fun_comparisons: List[str]
    streak_days_under_budget: int
