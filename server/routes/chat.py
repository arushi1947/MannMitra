import os, asyncio
from datetime import datetime

import google.generativeai as genai
from fastapi import APIRouter, Query
from pydantic import BaseModel

from database.db import db

router = APIRouter()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    model_name="gemini-2.5-flash",

    generation_config={
        "temperature": 0.7,
        "max_output_tokens": 400
    }
)

class ChatRequest(BaseModel):
    email: str
    message: str

SYSTEM_PROMPT = """
You are MannMitra, an empathetic emotional wellness companion.

Your purpose is to support users experiencing stress-related forgetfulness.

Rules:

- Be warm, supportive and encouraging.
- Never diagnose diseases.
- Never replace therapists or doctors.
- Suggest healthy habits and breathing exercises when appropriate.
- Help users organize thoughts and tasks.
- Keep answers concise and conversational.
- Avoid long paragraphs.
- Focus on emotional wellness and productivity.
"""

@router.post("/chat")
async def chat(data: ChatRequest):

    email = data.email
    user_message = data.message

    existing_chat = db.chat_history.find_one(
        {"email": email}
    )

    messages = []

    if existing_chat:
        messages = existing_chat.get(
            "messages",
            []
        )

    messages = messages[-20:]

    latest_mood = db.moods.find_one(
        {"email": email},
        sort=[("date", -1)]
    )

    current_mood = "Unknown"

    if latest_mood:
        current_mood = latest_mood.get(
            "mood",
            "Unknown"
        )

    recent_journals = list(

        db.journals.find(

            {"userEmail": email},

            {"_id": 0}

        )

        .sort("createdAt", -1)

        .limit(3)

    )

    journal_context = ""

    for journal in recent_journals:

        content = journal.get("content", "")[:300]

        journal_context += (
            f"Title: {journal.get('title')}\n"
            f"Content: {content}\n\n"
        )

    history = []

    crisis_words = [

    "hopeless",
    "worthless",
    "suicide",
    "kill myself",
    "self harm",
    "panic attack",

    "i want to die",
    "no reason to live",
    "ending my life",
    "hurt myself",
    "can't go on",
    "give up"
    ]

    message_lower = user_message.lower()

    if any(

        word in message_lower

        for word in crisis_words

    ):

        return {

            "reply":

            """
    I'm sorry you're going through this.

    You don't have to face it alone.

    Please consider talking to someone you trust or a mental health professional.

    Take slow breaths and remember that support is available.
            """

        }

    breathing_keywords = [

        "stress",

        "anxiety",

        "overwhelmed",

        "panic",

        "can't focus"

    ]

    breathing_tip = ""

    if any(

        word in message_lower

        for word in breathing_keywords

    ):

        breathing_tip = """

    Try the 4-4-4 breathing exercise:

    • Inhale for 4 seconds
    • Hold for 4 seconds
    • Exhale for 4 seconds
    """

    for msg in messages:

        role = (
            "user"
            if msg["role"] == "user"
            else "model"
        )

        history.append(
            {
                "role": role,
                "parts": [msg["content"]]
            }
        )

    try:

        chat_session = model.start_chat(
            history=[
                {
                    "role":"user",
                    "parts":[SYSTEM_PROMPT]
                },
                {
                    "role":"model",
                    "parts":["Understood. I will act as MannMitra."]
                }
            ] + history
        )
        current_context = f"""
        Current Mood:
        {current_mood}

        Recent Journal Entries:

        {journal_context}
        """

        response = chat_session.send_message(

            f"""

            {current_context}

            User Message:

            {user_message}

            """

        )

        await asyncio.sleep(1.5)

        if current_mood == "Happy":

            intro = (
                "It's wonderful to see your positive mood.\n\n"
            )

        elif current_mood == "Sad":

            intro = (
                "I'm here with you and it's okay to have difficult days.\n\n"
            )

        elif current_mood == "Stressed":

            intro = (
                "Stress can make everything feel harder. Let's take things one step at a time.\n\n"
            )

        else:

            intro = ""

        assistant_reply = (

            intro +

            response.text.strip()

        )

        assistant_reply += breathing_tip

    except Exception as e:

        print("Chat Error:", e)

        assistant_reply = (
            "I'm here for you. Take things one step at a time and remember that small progress matters."
        )

    messages.append(
        {
            "role": "user",
            "content": user_message,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

    messages.append(
        {
            "role": "assistant",
            "content": assistant_reply,
            "timestamp": datetime.utcnow().isoformat()
        }
    )

    db.chat_history.update_one(

        {
            "email": email
        },

        {
            "$set": {

                "email": email,

                "messages": messages,

                "updatedAt": datetime.utcnow().isoformat()

            }
        },

        upsert=True

    )

    return {
        "reply": assistant_reply
    }

@router.get("/chat-history")
async def get_chat_history(
    email: str = Query(...)
):

    result = db.chat_history.find_one(

        {"email": email},

        {"_id": 0}

    )

    if not result:

        return {
            "messages": []
        }

    return {
        "messages": result.get(
            "messages",
            []
        )
    }

@router.delete("/chat-history")
async def clear_chat_history(
    email: str = Query(...)
):

    db.chat_history.delete_one(
        {"email": email}
    )

    return {
        "message":
        "Conversation cleared successfully."
    }