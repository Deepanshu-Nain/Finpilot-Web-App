from fastapi import APIRouter, HTTPException
from schemas.salary import SalaryInput, AllocationResponse
from services import finance_service

router = APIRouter(tags=["Salary"])

@router.post("/salary", response_model=AllocationResponse)
def set_salary(data: SalaryInput):
    try:
        return finance_service.set_salary_and_allocate(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))