# Mocks external AI services
import random

def predict_budget_allocation(salary: float) -> dict:
    """
    Mock AI: Returns a standard percentage breakdown.
    """
    return {
        "food": round(salary * 0.20, 2),
        "rent": round(salary * 0.30, 2),
        "transport": round(salary * 0.10, 2),
        "entertainment": round(salary * 0.10, 2),
        "savings": round(salary * 0.20, 2),
        "misc": round(salary * 0.10, 2)
    }

def suggest_investment_plan(target: float, months: int) -> dict:
    """
    Mock AI: Suggests an investment vehicle (RD/SIP) based on duration.
    """
    monthly_needed = target / months
    
    # Simple logic to vary the suggestion
    if months < 12:
        plan = "Recurring Deposit (RD)"
        rate = 1.06 # 6%
    else:
        plan = "SIP (Index Fund)"
        rate = 1.12 # 12%

    return {
        "suggestion": plan,
        "monthly_amount": round(monthly_needed, 2),
        "expected_return": round(target * rate, 2)
    }