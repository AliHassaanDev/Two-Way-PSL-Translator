#!/bin/bash
echo "==================================================="
echo "Setting up SignBridge PK (PSL Translator)"
echo "==================================================="

echo ""
echo "[1/2] Setting up Python Backend..."
cd backend || exit
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
echo "Installing Python dependencies..."
pip install -r requirements.txt
cd ..

echo ""
echo "[2/2] Setting up Frontend (Next.js)..."
cd frontend || exit
echo "Installing Node.js dependencies..."
npm install
cd ..

echo ""
echo "==================================================="
echo "Setup Complete!"
echo "Run './start.sh' to launch the application."
echo "==================================================="
