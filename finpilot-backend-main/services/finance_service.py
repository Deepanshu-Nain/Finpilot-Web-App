from google.cloud import firestore
from database import db
from services.ai_service import predict_budget_allocation
from schemas.salary import SalaryInput
from schemas.transaction import TransactionInput

def set_salary_and_allocate(data: SalaryInput):
    # 1. Store Salary Record
    salary_ref = db.collection("salaries").document()
    salary_ref.set({
        "user_id": data.user_id,
        "amount": data.amount,
        "month": data.month,
        "created_at": firestore.SERVER_TIMESTAMP
    })

    # 2. Get AI Prediction
    allocation_map = predict_budget_allocation(data.amount)

    # 3. Store Allocation
    # We query to see if an allocation already exists for this month to update it, 
    # or create a new one. For simplicity, we'll just create new.
    alloc_ref = db.collection("allocations").document()
    alloc_ref.set({
        "user_id": data.user_id,
        "month": data.month,
        "categories": allocation_map
    })

    return {
        "salary": data.amount,
        "predicted_allocation": allocation_map
    }

def add_transaction(data: TransactionInput):
    doc_ref = db.collection("transactions").document()
    txn_data = data.dict()
    doc_ref.set(txn_data)
    return {"id": doc_ref.id, "status": "success"}

def get_dashboard_summary(user_id: str, month_prefix: str):
    """
    month_prefix: "2026-02"
    """
    # 1. Fetch Allocation
    allocs = db.collection("allocations")\
        .where("user_id", "==", user_id)\
        .where("month", "==", month_prefix)\
        .limit(1).stream()
    
    budget_map = {}
    for a in allocs:
        budget_map = a.to_dict().get("categories", {})

    # 2. Fetch Transactions (Client-side filtering for simple hackathon implementation)
    # In production, use composite indexes for date range queries
    txns = db.collection("transactions").where("user_id", "==", user_id).stream()
    
    spent_map = {}
    total_spent = 0
    
    for doc in txns:
        t = doc.to_dict()
        # Check if transaction belongs to this month
        if t.get("date", "").startswith(month_prefix) and t.get("type") == "debit":
            cat = t.get("category", "misc")
            amt = t.get("amount", 0)
            spent_map[cat] = spent_map.get(cat, 0) + amt
            total_spent += amt

    # 3. Build Response
    breakdown = []
    total_budget = sum(budget_map.values())
    
    # Iterate over budget categories
    for cat, alloc_amt in budget_map.items():
        spent = spent_map.get(cat, 0)
        breakdown.append({
            "category": cat,
            "allocated": alloc_amt,
            "spent": spent,
            "remaining": alloc_amt - spent,
            "status": "over_budget" if spent > alloc_amt else "within_budget"
        })
        
    # Handle categories spent but not allocated (unexpected expenses)
    for cat, spent in spent_map.items():
        if cat not in budget_map:
            breakdown.append({
                "category": cat,
                "allocated": 0,
                "spent": spent,
                "remaining": -spent,
                "status": "over_budget"
            })

    return {
        "month": month_prefix,
        "total_budget": total_budget,
        "total_spent": total_spent,
        "remaining_salary": total_budget - total_spent,
        "breakdown": breakdown
    }

def get_category_transactions(user_id: str, category: str):
    txns = db.collection("transactions")\
        .where("user_id", "==", user_id)\
        .where("category", "==", category)\
        .stream()
    
    return [
        {**doc.to_dict(), "id": doc.id} 
        for doc in txns
    ]

def get_full_history(user_id: str):
    txns = db.collection("transactions").where("user_id", "==", user_id).stream()
    # Sort in python for simplicity
    data = [{**doc.to_dict(), "id": doc.id} for doc in txns]
    return sorted(data, key=lambda x: x['date'], reverse=True)