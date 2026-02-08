#!/bin/bash

echo ""
echo "========================================"
echo "  FinPilot Backend Starter (Mac/Linux)"
echo "========================================"
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Virtual environment not found!"
    echo "Running setup helper..."
    echo ""
    python3 setup_helper.py
    exit 0
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Start server
echo "Starting backend server..."
echo ""
echo "Backend will run on: http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python main.py
