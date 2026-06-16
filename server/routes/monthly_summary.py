import os
import google.generativeai as genai

from fastapi import APIRouter
from fastapi import Query

from database.db import db

router = APIRouter()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

@router.post("/generate-monthly-summary")
async def generate_monthly_summary(
    email: str = Query(...),
    month: str = Query(...)
):

    moods = list(
        db.moods.find(
            {
                "email": email,
                "date_only": {
                    "$regex": f"^{month}"
                }
            },
            {
                "_id": 0
            }
        )
    )

    if len(moods) == 0:

        return {
            "summary":
            "No mood data available for this month."
        }

    prompt = f"""
    You are an emotional wellness coach.

    Analyze the user's mood history for this month.

    {moods}

    Generate:

    1. Emotional Pattern
    2. Mood Distribution Observation
    3. Progress Over Time
    4. Area For Growth
    5. Personalized Recommendation

    Maximum 150 words.

    Focus on monthly trends.
    Do not discuss today's mood.
    """

    response = model.generate_content(
        prompt
    )

    summary = response.text

    db.monthly_summaries.update_one(
        {
            "email": email,
            "month": month
        },
        {
            "$set": {
                "summary": summary
            }
        },
        upsert=True
    )

    return {
        "summary": summary
    }

@router.get("/monthly-summary")
async def get_monthly_summary(
    email: str = Query(...),
    month: str = Query(...)
):

    result = db.monthly_summaries.find_one(
        {
            "email": email,
            "month": month
        },
        {
            "_id": 0
        }
    )

    if not result:

        return {
            "summary":
            "No summary generated yet."
        }

    return result