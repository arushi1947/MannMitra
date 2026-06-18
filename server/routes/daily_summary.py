from fastapi import APIRouter, Query
from database.db import db
from datetime import datetime
import os
import google.generativeai as genai

router = APIRouter()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


@router.get("/daily-summary")
async def get_daily_summary(
    email: str = Query(...)
):

    today = str(datetime.utcnow().date())

    # completed reminders
    completed_reminders = list(

        db.reminders.find(
            {
                "userEmail": email,
                "completed": True,
                "completedDate": today
            },
            {
                "_id": 0
            }
        )

    )

    reminder_count = len(
        completed_reminders
    )

    # today's mood
    mood = db.moods.find_one(
        {
            "email": email,
            "date_only": today
        }
    )

    mood_name = (
        mood["mood"]
        if mood
        else "No mood logged"
    )

    # journal written?
    journal = db.journals.find_one(
        {
            "userEmail": email
        }
    )

    journal_written = (
        "Yes"
        if journal
        else "No"
    )

    prompt = f"""
    You are a supportive AI memory assistant.

    Today's information:

    Completed reminders:
    {reminder_count}

    Mood:
    {mood_name}

    Journal written:
    {journal_written}

    Generate ONLY valid JSON.

    Example:

    {{
      "summary":[
        "Completed 7 reminders",
        "Mood mostly calm",
        "Journal written"
      ],

      "tomorrow":[
        "Drink more water",
        "Sleep before 11 PM"
      ]
    }}

    Rules:

    - Exactly 3 summary items
    - Exactly 2 tomorrow suggestions
    - Short sentences
    - Warm tone
    - JSON only
    """

    try:

        response = model.generate_content(
            prompt
        )

        clean_response = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        import json

        result = json.loads(
            clean_response
        )

        return result

    except Exception:

        return {

            "summary": [

                f"Completed {reminder_count} reminders",

                f"Mood was {mood_name}",

                f"Journal written: {journal_written}"

            ],

            "tomorrow": [

                "Drink more water",

                "Sleep before 11 PM"

            ]

        }