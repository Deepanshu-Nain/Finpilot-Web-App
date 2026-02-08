# FinPilot - Integrated Finance Management System

A full-stack financial management application with AI-powered budget predictions and goal tracking.

## 🏗️ Architecture

### Backend (FastAPI + Firebase)
- **Location:** `finpilot-backend-main/`
- **Tech Stack:** Python 3.8+, FastAPI, Firebase Firestore, bcrypt
- **Features:**
  - User authentication (register/login)
  - Budget allocation with AI predictions
  - Transaction tracking
  - Savings goal management with investment suggestions
  - Real-time dashboard data

### Frontend (React + TypeScript)
- **Tech Stack:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Features:**
  - Responsive UI/UX with modern design
  - Protected routes with authentication
  - Real-time budget visualization
  - Transaction management
  - Savings goals tracking

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- Node.js 18 or higher
- Firebase project with Firestore enabled

### Backend Setup - SUPER EASY! ⚡

**Just run this one command:**
```bash
cd finpilot-backend-main
python setup_helper.py
```

The setup helper does everything automatically:
- ✅ Checks Python version
- ✅ Creates virtual environment
- ✅ Installs all dependencies
- ✅ Guides you through Firebase setup
- ✅ Starts the server for you!

**Or use the quick start script:**

Windows:
```bash
cd finpilot-backend-main
start.bat
```

Mac/Linux:
```bash
cd finpilot-backend-main
chmod +x start.sh
./start.sh
```

**Manual method** (if you prefer):

1. **Navigate to backend directory:**
   ```bash
   cd finpilot-backend-main
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Firebase:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Firestore Database
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save the JSON file as `serviceAccountKey.json` in the `finpilot-backend-main/` directory

5. **Run the backend server:**
   ```bash
   python main.py
   ```
   
   Backend will run on: `http://localhost:8000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - The `.env` file is already created with default values
   - Ensure backend URL matches: `VITE_API_URL=http://localhost:8000`

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on: `http://localhost:5173` (or next available port)

## 📱 Usage

1. **Access the application:**
   - Open browser to `http://localhost:5173`

2. **Create an account:**
   - Click "Join Now" or "Log In"
   - Register with email, password, and name
   - You'll be automatically logged in

3. **Set up your budget:**
   - Enter your monthly salary
   - Get AI-powered budget allocation
   - View breakdown by categories

4. **Track expenses:**
   - Add transactions by category
   - See real-time spending vs budget
   - View transaction history

5. **Create savings goals:**
   - Set target amount and deadline
   - Get AI investment suggestions (RD/SIP)
   - Track progress towards goals

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Salary & Budget
- `POST /salary` - Set monthly salary and get budget allocation

### Transactions
- `POST /transactions` - Add transaction
- `GET /dashboard/history?user_id={id}` - Get transaction history
- `GET /dashboard/category/{category}?user_id={id}` - Get category transactions

### Dashboard
- `GET /dashboard/summary?user_id={id}&month={YYYY-MM}` - Get monthly summary

### Goals
- `POST /savings/goal` - Create savings goal with AI suggestion

## 📊 Data Models

### Category Mapping
Frontend categories map to backend as follows:
- Housing → rent
- Food → food
- Transport → transport
- Entertainment → entertainment
- Utilities → misc
- Shopping → misc
- Health → misc
- Savings → savings

## Color Palette

The application uses a beautiful green color scheme:
- **Primary Green**: `#2e4f21` (Dark forest green)
- **Accent Green**: `#a0f1bd` (Mint green)
- **Background**: `#1a1a1a` (Dark charcoal for nav)
- **Light Background**: White and light grays

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication with localStorage
- Protected API routes
- CORS configured for development

## 🎨 UI/UX Features

- Modern gradient design with green color scheme
- Responsive layout for all screen sizes
- Loading states and error handling
- Toast notifications for user feedback
- Smooth animations and transitions
- Chart visualizations (Pie & Bar charts)

## 🐛 Troubleshooting

### Backend Issues

**Firebase Connection Error:**
- Verify `serviceAccountKey.json` is in correct location
- Check Firebase project has Firestore enabled
- Ensure service account has proper permissions

**Port Already in Use:**
```bash
# Change port in main.py
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

### Frontend Issues

**API Connection Error:**
- Verify backend is running on port 8000
- Check `.env` file has correct `VITE_API_URL`
- Ensure CORS is enabled in backend

**Build Errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Build for Production

### Frontend
```bash
npm run build
```
Built files will be in `dist/` directory.

### Backend
Deploy to services like Railway, Render, or Google Cloud Run with proper environment variables.

## 🔄 Future Enhancements

- Real bank account integration
- Multiple currency support
- Advanced AI predictions using ML models
- Budget sharing with family members
- Receipt scanning with OCR
- Recurring transaction automation
- Custom category creation
- Export reports (PDF/Excel)
- Mobile app (React Native)

## Technologies Used

- **Frontend:** React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Recharts
- **Backend:** Python, FastAPI, Firebase Firestore, bcrypt
- **Authentication:** Session-based with localStorage
- **Database:** Firebase Firestore (NoSQL)

## 📝 License

MIT License - Feel free to use this project for learning and development.

## 👥 Contributors

Built for IGDTU Hackathon Project

## 🙏 Acknowledgments

- shadcn/ui for beautiful UI components
- FastAPI for excellent Python web framework
- Firebase for real-time database
- Recharts for data visualization
