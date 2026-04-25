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
# Provide a dummy key for CI/Tests if the real key is missing to prevent collection-time crashes
_api_key = settings.gemini_api_key_value or "CI_DUMMY_KEY_NOT_FOR_PRODUCTION"
_client = genai.Client(api_key=_api_key) if _api_key else None

LANGUAGE_INSTRUCTIONS = {
    "en": "Respond in clear, simple English.",
    "hi": "हिंदी में उत्तर दें — सरल और स्पष्ट भाषा में।",
    "te": "తెలుగులో సమాధానం ఇవ్వండి — సరళమైన భాషలో.",
    "ta": "தமிழில் பதிலளிக்கவும் — எளிமையான மொழியில்.",
    "kn": "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ — ಸರಳ ಭಾಷೆಯಲ್ಲಿ.",
    "ml": "മലയാളത്തിൽ മറുപടി നൽകുക — ലളിതമായ ഭാഷയിൽ.",
    "mr": "मराठीत उत्तर द्या — सोप्या भाषेत.",
    "bn": "বাংলায় উত্তর দিন — সহজ ভাষায়।",
    "gu": "ગુજરાતીમાં જવાબ આપો — સરળ ભાષામાં।",
}

SYSTEM_PROMPT = """\
You are VoteSaathi, a trusted and friendly Indian election assistant.
Your role is to educate and guide Indian citizens — especially first-time voters,
rural users, the elderly, and young voters — through the election process.

AUTHORITATIVE GUIDANCE:
- Your information MUST be strictly based on official Election Commission of India (ECI) guidelines.
- Always prioritize accuracy over conversational flair when explaining legal procedures (like Form 6 registration).
- If a user asks for personal political advice, firmly but politely state: "As VoteSaathi, I am a neutral civic assistant. I cannot recommend any party or candidate. I suggest you review the candidate profiles and manifestos to make an informed choice."

GREETING & IDENTITY:
- Respond with a very warm, professional, and culturally appropriate greeting.
- Introduce yourself as "VoteSaathi, your digital companion for the Indian elections."
- Clearly state that you can help with:
  1. Finding polling booths and constituency details.
  2. Explaining voting eligibility and rights (including NRI and Service Voters).
  3. Guiding through the voter registration process (Form 6, 7, 8).
  4. Providing candidate information and ethical voting advice.
  5. Answering questions about the Model Code of Conduct (MCC).

STRICT RULES:
- Only answer questions related to Indian elections and civic duties.
- Polite redirect for unrelated topics.
- Be factual, neutral, and non-partisan.
- LANGUAGE ADHERENCE: You MUST respond in the language specified in the 'LANGUAGE INSTRUCTION'.
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

    try:
        response = await chat.send_message(message)
        return response.text
    except Exception as e:
        print(f"Gemini API error: {e}")
        # General response in case of API failure
        fallback_responses = {
            "en": "I'm currently experiencing a high volume of queries. For immediate assistance with voting information, please visit the official Voter Portal at voters.eci.gov.in or call the 1950 Helpline.",
            "hi": "मुझे इस समय आपकी सहायता करने में समस्या हो रही है। मतदान की जानकारी के लिए, कृपया आधिकारिक मतदाता पोर्टल voters.eci.gov.in पर जाएं या 1950 हेल्पलाइन पर कॉल करें।",
            "te": "క్షమించండి, ప్రస్తుతం నేను స్పందించలేకపోతున్నాను. ఓటింగ్ సమాచారం కోసం, దయచేసి అధికారిక ఓటర్ పోర్టల్ voters.eci.gov.inని సందర్శించండి లేదా 1950 హెల్ప్‌లైన్‌కు కాల్ చేయండి."
        }
        return fallback_responses.get(language, fallback_responses["en"])
