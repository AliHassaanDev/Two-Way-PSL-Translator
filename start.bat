@echo off
echo ===================================================
echo Starting SignBridge PK...
echo ===================================================

echo Starting Backend API on port 8000...
start cmd /k "cd backend && call venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Starting Frontend on port 3000...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up.
echo The frontend will be available at http://localhost:3000
echo.
pause
