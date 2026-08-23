@echo off
echo ===================================================
echo Setting up SignBridge PK (PSL Translator)
echo ===================================================

echo.
echo [1/2] Setting up Python Backend...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt
cd ..

echo.
echo [2/2] Setting up Frontend (Next.js)...
cd frontend
echo Installing Node.js dependencies...
call npm install
cd ..

echo.
echo ===================================================
echo Setup Complete!
echo Run 'start.bat' to launch the application.
echo ===================================================
pause
