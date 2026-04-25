from fastapi import APIRouter, HTTPException, Depends
from schemas import ChatRequest, ChatResponse
import gemini_service
import analytics
from config import get_settings, Settings
import logging

router = APIRouter(prefix="/api/chat", tags=["Chat"])
log = logging.getLogger("votesaathi")

@router.post("", response_model=ChatResponse)
async def chat(body: ChatRequest, settings: Settings = Depends(get_settings)):
    """
    Send a message to the VoteSaathi AI assistant.
    """
    if not settings.has_gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key not configured. Set GEMINI_API_KEY in .env"
        )

    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    ctx = body.context
    history = [{"role": t.role, "content": t.content} for t in body.history]

    log.info(f"Chat request | lang={ctx.language} age={ctx.age} loc={ctx.location}")

    try:
        response_text = await gemini_service.get_ai_response(
            message=message,
            language=ctx.language,
            age=ctx.age,
            location=ctx.location,
            first_time_voter=ctx.first_time_voter,
            chat_history=history,
        )
        # Log to BigQuery for analytics
        await analytics.log_interaction(message, ctx.language, ctx.age, ctx.location)
    except Exception as e:
        log.error(f"Gemini API error: {e}")
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")

    return ChatResponse(response=response_text, language=ctx.language)
