from database import db
from services.ai_service import suggest_investment_plan
from schemas.goal import GoalInput

def create_savings_goal(data: GoalInput):
    # 1. Get AI Suggestion
    suggestion = suggest_investment_plan(data.target_amount, data.duration_months)
    
    # 2. Store Goal
    doc_ref = db.collection("savings_goals").document()
    goal_record = data.dict()
    goal_record.update(suggestion)
    doc_ref.set(goal_record)
    
    return {
        "goal_id": doc_ref.id,
        **suggestion
    }