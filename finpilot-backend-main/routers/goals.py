from fastapi import APIRouter, HTTPException
from schemas.goal import GoalInput, GoalResponse
from services import goal_service

router = APIRouter(tags=["Goals"])

@router.post("/savings/goal", response_model=GoalResponse)
def create_goal(data: GoalInput):
    try:
        return goal_service.create_savings_goal(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))