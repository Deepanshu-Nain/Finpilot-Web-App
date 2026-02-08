# 🚀 Quick Start Checklist

Follow these steps to get FinPilot up and running:

## Backend Setup (5 minutes)

### 🚀 SUPER EASY METHOD (Recommended)

- [ ] **Just run this one command:**
  ```bash
  cd finpilot-backend-main
  python setup_helper.py
  ```
  The setup helper will:
  - Check your Python version
  - Create virtual environment automatically
  - Install all dependencies
  - Guide you through Firebase setup
  - Check if the port is available
  - Offer to start the server for you!

### 🎯 EVEN EASIER - Use Start Scripts

After setup, you can use these scripts to start the backend anytime:

**Windows:**
```bash
cd finpilot-backend-main
start.bat
```

**Mac/Linux:**
```bash
cd finpilot-backend-main
chmod +x start.sh
./start.sh
```

### 📋 Manual Method (if you prefer)

- [ ] **Step 1:** Open terminal in `finpilot-backend-main/` folder
  ```bash
  cd finpilot-backend-main
  ```

- [ ] **Step 2:** Create Python virtual environment
  ```bash
  python -m venv venv
  ```

- [ ] **Step 3:** Activate virtual environment
  - Windows: `venv\Scripts\activate`
  - Mac/Linux: `source venv/bin/activate`

- [ ] **Step 4:** Install dependencies
  ```bash
  pip install -r requirements.txt
  ```

- [ ] **Step 5:** Setup Firebase (REQUIRED)
  1. Go to https://console.firebase.google.com/
  2. Create new project (or use existing)
  3. Enable **Firestore Database**
  4. Go to Project Settings → Service Accounts
  5. Click "Generate new private key"
  6. Save JSON file as `serviceAccountKey.json` in `finpilot-backend-main/`

- [ ] **Step 6:** Start backend server
  ```bash
  python main.py
  ```
  ✅ Backend should run on http://localhost:8000

## Frontend Setup (3 minutes)

- [ ] **Step 1:** Open new terminal in project root folder

- [ ] **Step 2:** Install Node.js dependencies
  ```bash
  npm install
  ```

- [ ] **Step 3:** Verify `.env` file exists
  - File: `.env`
  - Should contain: `VITE_API_URL=http://localhost:8000`
  - Already created for you!

- [ ] **Step 4:** Start frontend development server
  ```bash
  npm run dev
  ```
  ✅ Frontend should run on http://localhost:5173

## Testing the Integration (2 minutes)

- [ ] **Step 1:** Open browser to http://localhost:5173

- [ ] **Step 2:** Create an account
  - Click "Join Now" or "Log In"
  - Fill registration form
  - Submit

- [ ] **Step 3:** Test budget feature
  - Enter monthly salary (e.g., 50000)
  - Click "Predict Smart Budget"
  - See AI-generated budget breakdown

- [ ] **Step 4:** Add a transaction
  - Go to "Management" tab
  - Click "Add Expense"
  - Select category and amount
  - Submit

- [ ] **Step 5:** Create a savings goal
  - Go to "Goals" tab
  - Click "New Goal"
  - Fill goal details
  - See AI investment suggestion (RD/SIP)

## Verification Checklist

Backend is working if:
- [ ] No errors in backend terminal
- [ ] Can visit http://localhost:8000/docs (API documentation)
- [ ] Firestore shows new collections after registration

Frontend is working if:
- [ ] No errors in browser console
- [ ] Can see landing page
- [ ] Login/Register forms load
- [ ] Can access dashboard after login

Integration is working if:
- [ ] Registration creates user in Firebase
- [ ] Login retrieves user data
- [ ] Budget prediction returns categories
- [ ] Transactions save to backend
- [ ] Goals show AI suggestions
- [ ] Page refresh maintains login state

## Common Issues & Solutions

### Backend Won't Start
**Problem:** `ModuleNotFoundError: No module named 'fastapi'`
**Solution:** Make sure virtual environment is activated and run `pip install -r requirements.txt`

### Firebase Error
**Problem:** `Could not load credentials`
**Solution:** Place `serviceAccountKey.json` in `finpilot-backend-main/` directory

### Frontend Can't Connect
**Problem:** API calls failing with connection error
**Solution:** 
1. Verify backend is running on port 8000
2. Check `.env` has `VITE_API_URL=http://localhost:8000`
3. Restart frontend dev server after .env changes

### CORS Error
**Problem:** `Access to fetch blocked by CORS policy`
**Solution:** Backend already configured for CORS. Ensure backend is running.

## You're All Set! 🎉

Both frontend and backend are now communicating properly!

### What You Can Do Now:
- ✅ Register and login users
- ✅ Get AI-powered budget predictions
- ✅ Track expenses by category
- ✅ Create savings goals with investment tips
- ✅ View real-time spending vs budget
- ✅ All data persists in Firebase

### Need Help?
- Check [README.md](./README.md) for detailed documentation
- Read [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for technical details
- Review backend docs at http://localhost:8000/docs

Happy budgeting! 💰
