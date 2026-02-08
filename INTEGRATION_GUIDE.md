# Integration Guide - Frontend ↔ Backend

This document explains how the frontend and backend have been integrated and what fixes were implemented.

## 🔧 Integration Changes Made

### 1. **API Service Layer** ✅
**Location:** `src/services/api.ts`

Created a comprehensive API service to handle all backend communications:
- Authentication endpoints (register, login)
- Salary and budget allocation
- Transaction management
- Dashboard summary data
- Savings goals creation

**Key Features:**
- Centralized error handling
- Type-safe API calls with TypeScript
- Automatic JSON parsing
- Environment-based backend URL configuration

### 2. **Authentication System** ✅
**Location:** `src/contexts/AuthContext.tsx`

Implemented complete authentication flow:
- User registration with name, email, password
- Login with email/password
- Session persistence using localStorage
- Automatic login state restoration on page reload
- Logout functionality

**Protected Routes:**
- Dashboard requires authentication
- Automatic redirect to login if not authenticated
- Loading state during auth check

### 3. **Login & Register Pages** ✅
**Locations:** 
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`

Beautiful, responsive authentication pages with:
- Form validation
- Error handling and display
- Loading states
- Links between login/register
- Consistent UI with app theme

### 4. **Backend-Integrated Budget Hook** ✅
**Location:** `src/hooks/useBudget.ts`

Complete rewrite to integrate with backend APIs:

#### Category Mapping
Solves the mismatch between frontend and backend category names:

```typescript
Frontend → Backend
Housing → rent
Food → food
Transport → transport
Entertainment → entertainment
Utilities → misc
Shopping → misc
Health → misc
Savings → savings
```

#### Automatic Data Loading
- Loads dashboard data when user logs in
- Fetches budget allocation from backend
- Retrieves transaction history
- Maps backend data to frontend structures

#### Real API Calls
- `predictBudget()` - Calls `/salary` endpoint
- `addTransaction()` - Posts to `/transactions`
- `addGoal()` - Creates goal via `/savings/goal`
- `loadDashboardData()` - Fetches from `/dashboard/summary`

#### Date Formatting
- Consistent date formats for API calls
- Current month: `YYYY-MM` (e.g., "2026-02")
- Transaction dates: `YYYY-MM-DD` (e.g., "2026-02-08")

### 5. **Environment Configuration** ✅
**Files:**
- `.env` - Development environment variables
- `.env.example` - Template for environment setup

```bash
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=FinPilot
```

### 6. **Updated App Routing** ✅
**Location:** `src/App.tsx`

- Added `AuthProvider` wrapper
- Implemented `ProtectedRoute` for dashboard
- Added login and register routes
- Proper route hierarchy

### 7. **Dashboard Enhancements** ✅
**Location:** `src/pages/Dashboard.tsx`

- Displays logged-in user name
- Proper logout functionality
- Uses backend data via useBudget hook
- Loading states during API calls

### 8. **Goals with AI Suggestions** ✅
**Location:** `src/components/dashboard/GoalsSection.tsx`

Enhanced to display AI suggestions from backend:
- Shows investment type (RD/SIP)
- Displays monthly savings amount
- Shows expected returns
- Beautiful UI for AI recommendations

### 9. **Backend Dependencies** ✅
**Location:** `finpilot-backend-main/requirements.txt`

Created comprehensive requirements file:
```
fastapi==0.115.0
uvicorn[standard]==0.32.0
python-dotenv==1.0.1
pydantic[email]==2.9.2
firebase-admin==6.5.0
bcrypt==4.2.0
```

### 10. **Documentation** ✅
**Locations:**
- `README.md` - Main project documentation
- `finpilot-backend-main/README.md` - Backend-specific guide
- `INTEGRATION_GUIDE.md` - This file

## 🔄 Data Flow

### User Registration Flow
```
1. User fills registration form (Login.tsx)
2. Form submits to AuthContext.register()
3. API call to POST /auth/register
4. Backend creates user in Firestore
5. User data stored in localStorage
6. Redirect to dashboard
7. Dashboard loads user's data
```

### Budget Prediction Flow
```
1. User enters salary (SalaryInput.tsx)
2. Calls useBudget.predictBudget()
3. API POST to /salary with user_id, amount, month
4. Backend calls AI service for allocation
5. Backend stores in Firestore collections:
   - salaries
   - allocations
6. Returns predicted_allocation object
7. Frontend maps to category structure
8. UI updates with budget breakdown
```

### Transaction Flow
```
1. User adds expense (AddCashDialog.tsx)
2. Selects category and amount
3. Calls useBudget.addTransaction()
4. Maps category name to backend format
5. API POST to /transactions
6. Backend stores in Firestore
7. Updates local state
8. Updates category spent amount
9. UI reflects new transaction
```

### Goals Creation Flow
```
1. User creates goal (AddGoalDialog.tsx)
2. Provides name, target, deadline
3. Calls useBudget.addGoal()
4. Calculates duration in months
5. API POST to /savings/goal
6. Backend calls AI service for suggestion
7. Returns investment recommendation
8. Displays in GoalsSection with AI tip
```

## 🔍 Key Integration Points

### Authentication State
- **Frontend:** AuthContext tracks logged-in user
- **Backend:** Each API call includes user_id
- **Storage:** localStorage persists session

### Category Names
- **Frontend:** Display-friendly names (Housing, Food)
- **Backend:** Simple lowercase names (rent, food)
- **Mapping:** CATEGORY_MAPPING in useBudget.ts

### Date Formats
- **Month:** YYYY-MM for budget periods
- **Date:** YYYY-MM-DD for transactions
- **Frontend:** JavaScript Date objects
- **Backend:** String formats in Firestore

### Error Handling
- **API Service:** Catches and throws errors
- **useBudget:** Try-catch blocks with toast notifications
- **Components:** Display error states
- **Backend:** HTTPException with proper status codes

## 🚀 Testing the Integration

### 1. Start Backend
```bash
cd finpilot-backend-main
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python main.py
```

### 2. Configure Firebase
- Place `serviceAccountKey.json` in `finpilot-backend-main/`
- Ensure Firestore is enabled

### 3. Start Frontend
```bash
npm install
npm run dev
```

### 4. Test Flow
1. Visit http://localhost:5173
2. Click "Join Now" → Register new account
3. Enter salary → Get budget prediction
4. Add transactions → See real-time updates
5. Create goals → Get AI suggestions
6. Refresh page → Data persists (from backend)
7. Logout → Session cleared

## 📊 Firestore Structure

### Collections Created:
```
users/
  {user_id}/
    - email
    - name
    - password_hash
    - created_at

salaries/
  {id}/
    - user_id
    - amount
    - month
    - created_at

allocations/
  {id}/
    - user_id
    - month
    - categories: {
        food: number,
        rent: number,
        ...
      }

transactions/
  {id}/
    - user_id
    - amount
    - type: 'credit' | 'debit'
    - category
    - date
    - description

savings_goals/
  {id}/
    - user_id
    - target_amount
    - duration_months
    - suggestion
    - monthly_amount
    - expected_return
```

## ⚠️ Important Notes

### Firebase Setup Required
The backend WILL NOT WORK without Firebase configuration:
1. Create Firebase project
2. Enable Firestore
3. Download service account key
4. Place as `serviceAccountKey.json`

### CORS Configuration
Backend currently allows all origins for development.
**For production:** Update CORS in `main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-production-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Environment Variables
Frontend uses `.env` file with Vite prefix:
```bash
VITE_API_URL=http://localhost:8000
```

To change backend URL, update `.env` and restart dev server.

## 🎯 What's Working Now

✅ Complete authentication flow
✅ User registration and login
✅ Session persistence
✅ Protected dashboard routes
✅ AI-powered budget predictions
✅ Transaction tracking with backend storage
✅ Goals with AI investment suggestions
✅ Real-time dashboard data from Firestore
✅ Category mapping between frontend/backend
✅ Error handling and user feedback
✅ Beautiful, responsive UI maintained

## 🔮 Potential Improvements

1. **Token-based Auth** - Replace localStorage with JWT tokens
2. **Refresh Token** - Auto-refresh for long sessions
3. **Real-time Updates** - Firebase real-time listeners
4. **Offline Support** - Cache API responses
5. **Better Error Messages** - More specific error handling
6. **Loading Skeletons** - Replace spinners with skeletons
7. **Transaction Editing** - Allow editing past transactions
8. **Budget Adjustments** - Manual category allocation adjustments
9. **Data Export** - Export transactions as CSV/PDF
10. **Analytics Dashboard** - Spending trends and insights

## 📝 Summary

The frontend and backend are now **fully integrated** and communicate properly. All major features work end-to-end:

- ✅ Authentication
- ✅ Budget Management
- ✅ Transaction Tracking
- ✅ Goals Management
- ✅ AI Suggestions

Both systems are ready for deployment and production use after proper Firebase configuration.
