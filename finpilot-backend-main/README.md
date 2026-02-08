# FinPilot Backend

FastAPI backend for FinPilot financial management system.

## Features

- User Authentication (Register/Login) with bcrypt password hashing
- Budget Allocation with AI predictions
- Transaction Management
- Savings Goals with investment suggestions
- Firebase Firestore integration

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Setup

### Easy Method (Recommended) 🚀

**Option 1: Use the setup helper (Easiest)**
```bash
python setup_helper.py
```
This will guide you through all setup steps automatically!

**Option 2: Use the start script**

Windows:
```bash
start.bat
```

Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

### Manual Setup

1. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure Firebase:
   - Place your `serviceAccountKey.json` in this directory
   - Ensure Firestore is enabled in your Firebase project

4. Run server:
   ```bash
   python main.py
   ```

## Project Structure

```
finpilot-backend-main/
├── main.py              # FastAPI app entry point
├── config.py            # Configuration settings
├── database.py          # Firebase connection
├── routers/             # API endpoints
│   ├── auth.py          # Authentication routes
│   ├── salary.py        # Salary management
│   ├── dashboard.py     # Dashboard data
│   └── goals.py         # Savings goals
├── schemas/             # Pydantic models
│   ├── auth.py
│   ├── salary.py
│   ├── transaction.py
│   └── goal.py
└── services/            # Business logic
    ├── auth_service.py
    ├── finance_service.py
    ├── goal_service.py
    └── ai_service.py
```

## Environment Variables

Create a `.env` file if needed (currently using config.py):

```
FIREBASE_CREDENTIALS_PATH=serviceAccountKey.json
```

## Collections in Firestore

- `users` - User accounts
- `salaries` - Monthly salary records
- `allocations` - Budget allocations
- `transactions` - Financial transactions
- `savings_goals` - Savings goals

## Security

- Passwords are hashed using bcrypt
- CORS is configured (currently open for development)
- Firebase handles data security and authentication

## Development

- Hot reload enabled with `reload=True` in uvicorn
- CORS allows all origins for development (update for production)
- All routes use proper error handling

## Dependencies

- fastapi - Web framework
- uvicorn - ASGI server
- firebase-admin - Firebase integration
- bcrypt - Password hashing
- pydantic - Data validation
- python-dotenv - Environment variables
