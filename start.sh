#!/bin/bash
echo "==================================================="
echo "Starting SignBridge PK..."
echo "==================================================="

# Start backend in background
echo "Starting Backend API on port 8000..."
cd backend || exit
source venv/bin/activate
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Start frontend in background
echo "Starting Frontend on port 3000..."
cd frontend || exit
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers are starting up."
echo "The frontend will be available at http://localhost:3000"
echo "Press Ctrl+C to stop both servers."
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
