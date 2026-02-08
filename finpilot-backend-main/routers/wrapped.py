from fastapi import APIRouter, HTTPException
from schemas.wrapped import WrappedSummaryResponse
from services import wrapped_service
from datetime import datetime

router = APIRouter(tags=["Wrapped"])


@router.get("/wrapped/summary", response_model=WrappedSummaryResponse)
def get_wrapped_summary(user_id: str, year: int = None, month: int = None):
    """
    Get a monthly 'Budget Wrapped' summary for the user.
    Defaults to the current month if year/month not specified.
    """
    now = datetime.now()
    if year is None:
        year = now.year
    if month is None:
        month = now.month

    if month < 1 or month > 12:
        raise HTTPException(status_code=400, detail="Month must be between 1 and 12")

    try:
        return wrapped_service.get_wrapped_summary(user_id, year, month)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
