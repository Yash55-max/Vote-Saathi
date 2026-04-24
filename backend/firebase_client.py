import os
import firebase_admin
from firebase_admin import credentials, firestore
from config import get_settings

settings = get_settings()

_db = None


def init_firebase():
    """Initialize Firebase Admin SDK (idempotent)."""
    global _db
    if firebase_admin._apps:
        _db = firestore.client()
        return

    sa_path = settings.firebase_service_account_path
    if os.path.exists(sa_path):
        cred = credentials.Certificate(sa_path)
        firebase_admin.initialize_app(cred)
    else:
        # Use Application Default Credentials in Cloud Run / CI
        firebase_admin.initialize_app()

    _db = firestore.client()


def get_db():
    global _db
    if _db is None:
        init_firebase()
    return _db
