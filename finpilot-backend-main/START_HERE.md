# 🚀 Quick Start - Backend

## Three Super Easy Ways to Start Backend:

### Method 1: Setup Helper (First Time) ⭐ RECOMMENDED
```bash
cd finpilot-backend-main
python setup_helper.py
```
**What it does:**
- Checks everything automatically
- Creates virtual environment
- Installs dependencies
- Guides you through Firebase setup
- Starts server for you

**When to use:** First time setup or if something breaks

---

### Method 2: Start Scripts (Quick Start) ⚡ FASTEST

**Windows:**
```bash
cd finpilot-backend-main
start.bat
```

**Mac/Linux:**
```bash
cd finpilot-backend-main
chmod +x start.sh    # Only needed once
./start.sh
```

**What it does:**
- Activates virtual environment automatically
- Starts backend server
- Shows you the URLs

**When to use:** After initial setup, every time you want to start backend

---

### Method 3: Manual (Traditional) 📝

```bash
cd finpilot-backend-main
venv\Scripts\activate    # Windows
source venv/bin/activate # Mac/Linux
python main.py
```

**When to use:** If you want full control

---

## If You Get the Firebase Error

If you see: `FileNotFoundError: 'serviceAccountKey.json'`

**Quick Fix:**
1. Go to https://console.firebase.google.com/
2. Select/Create your project
3. Enable **Firestore Database**
4. Go to **Project Settings** ⚙️ → **Service Accounts**
5. Click **"Generate new private key"**
6. Download the JSON file
7. Rename it to **`serviceAccountKey.json`**
8. Put it in the `finpilot-backend-main` folder
9. Run `python setup_helper.py` again

---

## URLs After Starting

- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **Alternative Docs:** http://localhost:8000/redoc

---

## Stop the Server

Press **Ctrl + C** in the terminal

---

## Troubleshooting

**Port 8000 already in use?**
- Another process is using port 8000
- Stop it or change port in `main.py` (line 28)

**Virtual environment not found?**
- Run `python setup_helper.py` to create it

**Import errors?**
- Make sure virtual environment is activated
- Run `pip install -r requirements.txt`

---

## Need More Help?

Check the full docs:
- [README.md](README.md) - Complete documentation
- [QUICK_START.md](../QUICK_START.md) - Setup checklist
- [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) - Technical details
