from database import db
from collections import defaultdict
from datetime import datetime, timedelta
import calendar

CATEGORY_ICONS = {
    "rent": "🏠",
    "food": "🍕",
    "transport": "🚗",
    "entertainment": "🎬",
    "misc": "📦",
    "savings": "💰",
    "shopping": "🛍️",
    "health": "💊",
    "utilities": "⚡",
}

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

# Fun comparison templates
FUN_COMPARISONS = [
    ("food", 250, "cups of chai ☕"),
    ("food", 500, "plates of biryani 🍛"),
    ("transport", 30, "auto rides 🛺"),
    ("transport", 150, "Uber rides 🚖"),
    ("entertainment", 200, "movie tickets 🎬"),
    ("entertainment", 500, "Netflix subscriptions 📺"),
    ("shopping", 1000, "new t-shirts 👕"),
    ("rent", 5000, "coworking day passes 💼"),
]


def _get_previous_month_totals(user_id: str, year: int, month: int):
    """Get income/expenses for the previous month for comparison."""
    if month == 1:
        prev_year, prev_month = year - 1, 12
    else:
        prev_year, prev_month = year, month - 1

    prev_prefix = f"{prev_year}-{str(prev_month).zfill(2)}"

    txns_ref = db.collection("transactions").where("user_id", "==", user_id).stream()
    prev_income = 0.0
    prev_expenses = 0.0

    for doc in txns_ref:
        t = doc.to_dict()
        if t.get("date", "").startswith(prev_prefix):
            amount = t.get("amount", 0)
            if t.get("type", "") == "credit":
                prev_income += amount
            elif t.get("type", "") == "debit":
                prev_expenses += amount

    # Also check salary
    salaries_ref = db.collection("salaries").where("user_id", "==", user_id).stream()
    for doc in salaries_ref:
        s = doc.to_dict()
        if s.get("month", "") == prev_prefix:
            sal = s.get("amount", 0)
            if sal > prev_income:
                prev_income = sal

    return prev_income, prev_expenses


def get_wrapped_summary(user_id: str, year: int, month: int):
    """Generate a monthly wrapped summary for a user."""
    month_prefix = f"{year}-{str(month).zfill(2)}"
    days_in_month = calendar.monthrange(year, month)[1]

    # ── 1. Fetch all transactions for the month ──
    txns_ref = db.collection("transactions").where("user_id", "==", user_id).stream()

    all_transactions = []
    for doc in txns_ref:
        t = doc.to_dict()
        t["id"] = doc.id
        if t.get("date", "").startswith(month_prefix):
            all_transactions.append(t)

    # ── 2. Fetch salary for the month ──
    salaries_ref = db.collection("salaries").where("user_id", "==", user_id).stream()
    month_salary = 0
    for doc in salaries_ref:
        s = doc.to_dict()
        if s.get("month", "") == month_prefix:
            month_salary = s.get("amount", 0)

    # ── 3. Fetch goals (active) ──
    goals_ref = db.collection("savings_goals").where("user_id", "==", user_id).stream()
    goals = []
    for doc in goals_ref:
        g = doc.to_dict()
        g["id"] = doc.id
        goals.append(g)

    # ── 4. Fetch user name ──
    users_ref = db.collection("users").where("user_id", "==", user_id).limit(1).stream()
    user_name = "User"
    for doc in users_ref:
        u = doc.to_dict()
        user_name = u.get("name", "User")

    # ── 5. Process transactions ──
    total_income = 0.0
    total_expenses = 0.0
    category_spending = defaultdict(float)
    category_count = defaultdict(int)
    day_of_week_spending = defaultdict(float)
    daily_spending = defaultdict(float)
    biggest_txn = None

    for t in all_transactions:
        amount = t.get("amount", 0)
        txn_type = t.get("type", "")
        category = t.get("category", "misc")
        date_str = t.get("date", "")

        if txn_type == "credit":
            total_income += amount
        elif txn_type == "debit":
            total_expenses += amount
            category_spending[category] += amount
            category_count[category] += 1

            # Day-level tracking
            try:
                dt = datetime.strptime(date_str, "%Y-%m-%d")
                day_of_week_spending[dt.weekday()] += amount
                daily_spending[dt.day] += amount
            except (ValueError, TypeError):
                pass

            # Biggest transaction
            if biggest_txn is None or amount > biggest_txn["amount"]:
                biggest_txn = {
                    "amount": amount,
                    "category": category,
                    "date": date_str,
                    "description": t.get("description", ""),
                }

    # Salary-based income if higher
    if month_salary > total_income:
        total_income = month_salary

    total_savings = total_income - total_expenses
    savings_rate = (total_savings / total_income * 100) if total_income > 0 else 0

    # ── 6. Comparison with previous month ──
    prev_income, prev_expenses = _get_previous_month_totals(user_id, year, month)
    prev_savings = prev_income - prev_expenses

    income_change = ((total_income - prev_income) / prev_income * 100) if prev_income > 0 else 0
    expense_change = ((total_expenses - prev_expenses) / prev_expenses * 100) if prev_expenses > 0 else 0
    savings_change = ((total_savings - prev_savings) / abs(prev_savings) * 100) if prev_savings != 0 else 0

    # ── 7. Build top categories ──
    sorted_cats = sorted(category_spending.items(), key=lambda x: x[1], reverse=True)
    top_categories = []
    for cat, amt in sorted_cats[:5]:
        pct = (amt / total_expenses * 100) if total_expenses > 0 else 0
        top_categories.append({
            "category": cat,
            "amount": round(amt, 2),
            "percentage": round(pct, 1),
            "icon": CATEGORY_ICONS.get(cat, "📊"),
        })

    most_consistent = max(category_count, key=category_count.get) if category_count else "none"

    # ── 8. Weekly breakdown ──
    weekly_data = []
    week_expenses = defaultdict(float)
    week_income_map = defaultdict(float)

    for t in all_transactions:
        date_str = t.get("date", "")
        amount = t.get("amount", 0)
        try:
            dt = datetime.strptime(date_str, "%Y-%m-%d")
            week_num = min((dt.day - 1) // 7, 3)  # 0-3 for weeks 1-4
            if t.get("type", "") == "debit":
                week_expenses[week_num] += amount
            elif t.get("type", "") == "credit":
                week_income_map[week_num] += amount
        except (ValueError, TypeError):
            pass

    for w in range(4):
        label = f"Week {w + 1}"
        inc = round(week_income_map.get(w, 0), 2)
        exp = round(week_expenses.get(w, 0), 2)
        weekly_data.append({
            "week_label": label,
            "income": inc,
            "expenses": exp,
            "savings": round(inc - exp, 2),
        })

    highest_spending_week = f"Week {max(range(4), key=lambda w: week_expenses.get(w, 0)) + 1}" if week_expenses else "Week 1"
    
    week_savings = {w: week_income_map.get(w, 0) - week_expenses.get(w, 0) for w in range(4)}
    best_savings_week = f"Week {max(range(4), key=lambda w: week_savings.get(w, 0)) + 1}"

    # ── 9. Goals summary ──
    total_goals = len(goals)
    completed_goals = 0
    in_progress_goals = 0
    total_saved_goals = 0.0
    total_target_goals = 0.0
    for g in goals:
        target = g.get("target_amount", 0)
        current = g.get("current_amount", 0)
        total_target_goals += target
        total_saved_goals += current
        if current >= target and target > 0:
            completed_goals += 1
        elif current > 0:
            in_progress_goals += 1

    goals_summary = {
        "total_goals": total_goals,
        "completed": completed_goals,
        "in_progress": in_progress_goals,
        "total_saved": round(total_saved_goals, 2),
        "total_target": round(total_target_goals, 2),
    }

    # ── 10. Fun stats ──
    daily_avg = total_expenses / days_in_month if days_in_month > 0 else 0
    num_weeks = 4
    txn_per_week = len(all_transactions) / num_weeks if num_weeks > 0 else 0

    # Top spending day of week
    top_day_idx = max(day_of_week_spending, key=day_of_week_spending.get) if day_of_week_spending else 0
    top_spending_day = DAY_NAMES[top_day_idx] if isinstance(top_day_idx, int) and top_day_idx < 7 else "Monday"

    # Streak: consecutive days spending under daily budget
    daily_budget = total_income / days_in_month if days_in_month > 0 and total_income > 0 else float('inf')
    streak = 0
    max_streak = 0
    for day in range(1, days_in_month + 1):
        if daily_spending.get(day, 0) <= daily_budget:
            streak += 1
            max_streak = max(max_streak, streak)
        else:
            streak = 0

    # Fun comparisons
    fun_comparisons = []
    for comp_cat, unit_price, label in FUN_COMPARISONS:
        if comp_cat in category_spending and category_spending[comp_cat] > 0:
            count = int(category_spending[comp_cat] / unit_price)
            if count > 0:
                fun_comparisons.append(
                    f"You spent the equivalent of {count} {label} on {comp_cat}!"
                )

    if not fun_comparisons:
        if total_expenses > 0:
            chai_count = int(total_expenses / 250)
            fun_comparisons.append(f"Your total spending equals {chai_count} cups of chai ☕")

    month_name = MONTH_NAMES[month - 1] if 1 <= month <= 12 else "Unknown"

    return {
        "year": year,
        "month": month,
        "month_name": month_name,
        "user_name": user_name,
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "total_savings": round(total_savings, 2),
        "savings_rate": round(savings_rate, 1),
        "income_change": round(income_change, 1),
        "expense_change": round(expense_change, 1),
        "savings_change": round(savings_change, 1),
        "total_transactions": len(all_transactions),
        "average_daily_spending": round(daily_avg, 2),
        "top_categories": top_categories,
        "most_consistent_category": most_consistent,
        "biggest_transaction": biggest_txn,
        "weekly_data": weekly_data,
        "highest_spending_week": highest_spending_week,
        "best_savings_week": best_savings_week,
        "goals_summary": goals_summary,
        "daily_average_spend": round(daily_avg, 2),
        "transactions_per_week": round(txn_per_week, 1),
        "top_spending_day_of_week": top_spending_day,
        "fun_comparisons": fun_comparisons,
        "streak_days_under_budget": max_streak,
    }
