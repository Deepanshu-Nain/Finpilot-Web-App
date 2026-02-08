from database import db
from services.ai_service import suggest_investment_plan
from schemas.goal import GoalInput

def create_savings_goal(data: GoalInput):
    # 1. Get AI Suggestion
    suggestion = suggest_investment_plan(data.target_amount, data.duration_months)
    
    # 2. Store Goal with all fields
    doc_ref = db.collection("savings_goals").document()
    goal_record = {
        "user_id": data.user_id,
        "target_amount": data.target_amount,
        "duration_months": data.duration_months,
        "name": data.name,
        "icon": data.icon,
        "deadline": data.deadline,
        "current_amount": data.current_amount,
        "color": data.color,
        **suggestion
    }
    doc_ref.set(goal_record)
    
    return {
        "goal_id": doc_ref.id,
        **suggestion
    }


def get_user_goals(user_id: str):
    """Fetch all goals for a user from Firestore."""
    goals_ref = db.collection("savings_goals").where("user_id", "==", user_id)
    docs = goals_ref.stream()
    
    goals = []
    for doc in docs:
        data = doc.to_dict()
        goals.append({
            "goal_id": doc.id,
            "user_id": data.get("user_id", ""),
            "name": data.get("name", "Untitled Goal"),
            "target_amount": data.get("target_amount", 0),
            "current_amount": data.get("current_amount", 0),
            "deadline": data.get("deadline"),
            "icon": data.get("icon", "🎯"),
            "color": data.get("color", "hsl(142, 40%, 45%)"),
            "suggestion": data.get("suggestion", ""),
            "monthly_amount": data.get("monthly_amount", 0),
            "expected_return": data.get("expected_return", 0),
            "duration_months": data.get("duration_months", 12),
        })
    
    return goals


def update_goal_progress(goal_id: str, amount: float):
    """Add amount to a goal's current_amount."""
    doc_ref = db.collection("savings_goals").document(goal_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise ValueError(f"Goal {goal_id} not found")
    
    data = doc.to_dict()
    current = data.get("current_amount", 0)
    target = data.get("target_amount", 0)
    new_amount = min(current + amount, target)
    
    doc_ref.update({"current_amount": new_amount})
    
    return {"goal_id": goal_id, "current_amount": new_amount}


def delete_goal(goal_id: str):
    """Delete a goal from Firestore."""
    doc_ref = db.collection("savings_goals").document(goal_id)
    doc = doc_ref.get()
    
    if not doc.exists:
        raise ValueError(f"Goal {goal_id} not found")
    
    doc_ref.delete()
    return {"status": "success", "message": f"Goal {goal_id} deleted"}