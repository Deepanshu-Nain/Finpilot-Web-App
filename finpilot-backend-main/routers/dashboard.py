from fastapi import APIRouter, HTTPException
from typing import List
from schemas.transaction import TransactionInput, DashboardSummaryResponse
from services import finance_service

router = APIRouter(tags=["Dashboard"])

@router.post("/transactions")
def add_transaction(data: TransactionInput):
    try:
        return finance_service.add_transaction(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_summary(user_id: str, month: str):
    """
    Month format: 'YYYY-MM' (e.g., '2026-02')
    """
    try:
        return finance_service.get_dashboard_summary(user_id, month)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/category/{category_name}")
def get_category_details(user_id: str, category_name: str):
    try:
        return finance_service.get_category_transactions(user_id, category_name)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/history")
def get_history(user_id: str):
    try:
        return finance_service.get_full_history(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))