"""
Analytics service — sends anonymized interaction data to Google BigQuery.
"""
from __future__ import annotations
import logging
from datetime import datetime
from google.cloud import bigquery
from config import get_settings

settings = get_settings()
log = logging.getLogger("votesaathi")

_bq_client = None

def get_bq_client():
    global _bq_client
    if _bq_client is None:
        try:
            _bq_client = bigquery.Client()
        except Exception as e:
            log.warning(f"⚠️ BigQuery client initialization failed: {e}")
    return _bq_client

async def log_interaction(query: str, language: str, age: int | None, location: str | None):
    """
    Log an anonymized chat interaction to BigQuery.
    """
    client = get_bq_client()
    if not client:
        return

    # Simulation for Hackathon purposes — in production, ensure the table exists
    log.info(f"📊 BigQuery Log | {datetime.utcnow().isoformat()} | {language} | {location}")
    
    # Example logic for real insertion:
    # table_id = f"{client.project}.votesaathi_analytics.interactions"
    # rows_to_insert = [{"timestamp": ..., "lang": language, ...}]
    # client.insert_rows_json(table_id, rows_to_insert)
