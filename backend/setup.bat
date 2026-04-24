@echo off
REM ============================================================
REM  VoteSaathi Backend Setup Script (Windows)
REM  Run this once to create the venv and install dependencies.
REM ============================================================

echo [1/3] Creating Python virtual environment...
python -m venv venv

echo [2/3] Activating venv and installing dependencies...
call .\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt

echo [3/3] Setup complete!
echo.
echo Next steps:
echo   1. Copy .env.example to .env and fill in your API keys
echo   2. Add your Firebase service account JSON as firebase-service-account.json
echo   3. Run: venv\Scripts\activate  ^&^&  python main.py
echo.
