from fastapi import APIRouter, HTTPException, Query
from schemas.goal import GoalInput, GoalResponse, GoalFullResponse, GoalUpdateInput, GoalDeleteResponse
from services import goal_service
from typing import List

router = APIRouter(tags=["Goals"])

@router.post("/savings/goal", response_model=GoalResponse)
def create_goal(data: GoalInput):
    try:
        return goal_service.create_savings_goal(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/savings/goals", response_model=List[GoalFullResponse])
def get_goals(user_id: str = Query(..., description="User ID to fetch goals for")):
    try:
        return goal_service.get_user_goals(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/savings/goal/{goal_id}")
def update_goal(goal_id: str, data: GoalUpdateInput):
    try:
        return goal_service.update_goal_progress(goal_id, data.amount)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/savings/goal/{goal_id}", response_model=GoalDeleteResponse)
def delete_goal(goal_id: str):
    try:
        return goal_service.delete_goal(goal_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))