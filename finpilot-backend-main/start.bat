@echo off
echo.
echo ========================================
echo   FinPilot Backend Starter (Windows)
echo ========================================
echo.

REM Check if venv exists
if not exist "venv\" (
    echo Virtual environment not found!
    echo Running setup helper...
    echo.
    python setup_helper.py
    goto :end
)

REM Activate virtual environment and start server
echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Starting backend server...
echo.
echo Backend will run on: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python main.py

:end
pause
