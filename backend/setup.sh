#!/usr/bin/env bash
# ============================================================
#  VoteSaathi Backend Setup Script (macOS / Linux)
# ============================================================
set -e

echo "[1/3] Creating Python virtual environment..."
python3 -m venv venv

echo "[2/3] Activating venv and installing dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "[3/3] Setup complete!"
echo ""
echo "Next steps:"
echo "  1. cp .env.example .env  && fill in your API keys"
echo "  2. Add firebase-service-account.json"
echo "  3. source venv/bin/activate && python main.py"
