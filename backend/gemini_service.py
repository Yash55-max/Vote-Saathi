"""
Gemini AI service — builds context-aware prompts and calls the Gemini API.
Uses the new `google-genai` SDK (Python 3.14 compatible).
"""
from __future__ import annotations

from google import genai
from google.genai import types
from config import get_settings

settings = get_settings()

# One-time SDK configuration — new SDK uses a Client object
_client = genai.Client(api_key=settings.gemini_api_key)

LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in clear, simple English.",
    "hi": "हिंदी में उत्तर दें — सरल और स्पष्ट भाषा में।",
    "te": "తెలుగులో సమాధానం ఇవ్వండి — సరళమైన భాషలో.",
}

SYSTEM_PROMPT = """\
You are VoteSaathi, a trusted and friendly Indian election assistant.
Your role is to educate and guide Indian citizens — especially first-time voters,
rural users, the elderly, and young voters — through the election process.

STRICT RULES:
- Only answer questions related to Indian elections, voting, voter registration,
  constituencies, candidates, election commission, democratic processes, and civic duties.
- If asked about anything unrelated, politely redirect the user to election topics.
- Be factual, neutral, and non-partisan. Do NOT express political opinions or
  favour any party or candidate.
- Keep answers concise, clear, and step-by-step where appropriate.
- Use bullet points for multi-step processes.
- If you are unsure, say so honestly and suggest the user visit eci.gov.in.
"""


def build_user_context(age: int | None, location: str | None,
                        language: str, first_time_voter: bool | None) -> str:
    parts = []
    if age:
        parts.append(f"Age: {age}")
    if location:
        parts.append(f"Location: {location}")
    if first_time_voter is not None:
        parts.append(f"First-time voter: {'Yes' if first_time_voter else 'No'}")
    return "\n".join(parts) if parts else "No profile information provided."


async def get_ai_response(
    message: str,
    language: str = "en",
    age: int | None = None,
    location: str | None = None,
    first_time_voter: bool | None = None,
    chat_history: list[dict] | None = None,
) -> str:
    """
    Call Gemini with full user context injected into the system prompt.
    Returns the AI response as a string.
    """
    lang_instruction = LANGUAGE_INSTRUCTIONS.get(language, LANGUAGE_INSTRUCTIONS["en"])
    user_context     = build_user_context(age, location, language, first_time_voter)

    full_system = (
        f"{SYSTEM_PROMPT}\n\n"
        f"USER CONTEXT:\n{user_context}\n\n"
        f"LANGUAGE INSTRUCTION: {lang_instruction}"
    )

    # Build chat history in new SDK format
    history: list[types.Content] = []
    if chat_history:
        for turn in chat_history[-10:]:   # last 10 turns for context window
            role = "user" if turn["role"] == "user" else "model"
            history.append(
                types.Content(role=role, parts=[types.Part(text=turn["content"])])
            )

    # Create a chat session with the new SDK
    chat = _client.aio.chats.create(
        model="gemini-1.5-flash",
        config=types.GenerateContentConfig(
            system_instruction=full_system,
            temperature=0.7,
            top_p=0.9,
            max_output_tokens=1024,
            safety_settings=[
                types.SafetySetting(category="HARM_CATEGORY_HARASSMENT",        threshold="BLOCK_MEDIUM_AND_ABOVE"),
                types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH",       threshold="BLOCK_MEDIUM_AND_ABOVE"),
                types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="BLOCK_MEDIUM_AND_ABOVE"),
                types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="BLOCK_MEDIUM_AND_ABOVE"),
            ],
        ),
        history=history,
    )

    response = await chat.send_message(message)
    return response.text
