import os
import google.generativeai as genai
from database.db import db
from fastapi import APIRouter, Query
from pydantic import BaseModel
from datetime import datetime, timedelta
import json

router = APIRouter()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


async def generate_ai_insight(
    moods
):

    prompt = f"""
    You are a supportive emotional wellness companion.

    Analyze ONLY the most recent mood entries.

    {moods}

    Provide:

    1. Current emotional state
    2. One encouraging sentence

    Rules:
    - Maximum 25 words
    - Maximum 2 sentences
    - Focus on recent emotions
    - Do not discuss monthly trends
    """

    try:

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        print("Gemini Error:", e)

        return (
            "Your mood history shows valuable self-awareness. "
            "Keep tracking your emotions to discover patterns and "
            "build healthier emotional habits."
        )

async def generate_correlation_insight(moods):

    prompt = f"""
    You are an emotional wellness analyst.

    Analyze these mood entries:

    {moods}

    Detect ONE meaningful emotional pattern.

    Examples:
    - You tend to feel happier on weekends.
    - Your mood improves after consecutive positive days.
    - Lower moods appear after stressful periods.
    - Your emotions have been becoming more stable.

    Rules:
    - Maximum 20 words
    - One sentence only
    - Start directly with the pattern
    - No greetings
    - No bullet points
    - No markdown
    """

    try:

        response = model.generate_content(prompt)

        return response.text.strip()

    except Exception:

        return (
            "Your mood patterns are still developing. "
            "Keep tracking to discover deeper emotional trends."
        )

async def generate_mood_recommendations(moods):

    prompt = f"""
    You are a mental wellness assistant.

    Analyze these mood entries:

    {moods}

    Generate 3 personalized wellness reminders.

    Return ONLY valid JSON.

    Example:

    [
      {{
        "title":"Take A Walk",
        "description":"Spend 15 minutes outside"
      }},
      {{
        "title":"Drink Water",
        "description":"Hydrate yourself"
      }}
    ]

    Rules:
    - Exactly 3 reminders
    - Short titles
    - Practical suggestions
    - No markdown
    - JSON only
    """

    try:

        response = model.generate_content(
            prompt
        )

        recommendations = json.loads(
            response.text
        )

        return recommendations

    except Exception as e:

        print("Recommendation Error:", e)

        return [
            {
                "title": "Take Deep Breaths",
                "description": "Pause and breathe for 5 minutes"
            },
            {
                "title": "Drink Water",
                "description": "Stay hydrated today"
            },
            {
                "title": "Go For A Walk",
                "description": "Spend some time outdoors"
            }
        ]

async def generate_reminder_insights(reminders):

    prompt = f"""
    You are an AI productivity and wellness coach.

    Analyze the user's reminder history.

    Reminders:

    {reminders}

    Generate exactly 3 insights.

    Return ONLY valid JSON.

    Example:

    [
      {{
        "title":"Study Tasks Delayed",
        "description":"You often postpone study-related reminders."
      }},
      {{
        "title":"Strong Morning Productivity",
        "description":"Most completed reminders occur before noon."
      }},
      {{
        "title":"Wellness Opportunity",
        "description":"Adding hydration reminders may improve consistency."
      }}
    ]

    Rules:

    - Personalized
    - Based on reminder behavior
    - Maximum 20 words per description
    - No markdown
    - JSON only
    """

    try:

        response = model.generate_content(prompt)

        return json.loads(
            response.text
        )

    except Exception as e:

        print("Reminder AI Error:", e)

        return [
            {
                "title": "Keep Building Habits",
                "description":
                "Continue completing reminders consistently."
            }
        ]

async def generate_profile_insight(email):

    moods = list(
        db.moods.find(
            {"email": email},
            {"_id":0}
        )
    )

    journals = list(
        db.journals.find(
            {"userEmail": email},
            {"_id":0}
        )
    )

    reminders = list(
        db.reminders.find(
            {"userEmail": email},
            {"_id":0}
        )
    )

    prompt = f"""
    You are an empathetic wellness coach.

    Mood history:

    {moods}

    Journal history:

    {journals}

    Reminder history:

    {reminders}

    Analyze emotional wellbeing and productivity.

    Generate:

    1. Emotional state
    2. Productivity pattern
    3. One encouraging sentence

    Rules:

    - Maximum 40 words.
    - Warm and supportive.
    - Mention emotions and habits.
    - One paragraph only.
    - No markdown.
    """

    try:

        response = model.generate_content(
            prompt
        )

        insight = response.text.strip()

    except Exception as e:

        insight = (
            "You're building healthy emotional awareness and productivity habits. Keep celebrating small wins."
        )

    db.profile_insights.update_one(

        {"email": email},

        {
            "$set": {

                "email": email,

                "insight": insight,

                "updatedAt": datetime.utcnow()

            }
        },

        upsert=True
    )

async def generate_journal_reflection(
    title,
    content,
    category,
    mood
):

    prompt = f"""
    You are an empathetic journal reflection coach.

    Journal Title:
    {title}

    Category:
    {category}

    Mood:
    {mood}

    Journal Content:
    {content}

    Generate:

    1. Main Theme
    2. Highlight Of The Day
    3. Reflection Question
    4. Tiny Step For Tomorrow

    Return ONLY valid JSON.

    Example:

    {{
        "theme":"Growth and Learning",
        "highlight":"Finished connecting Journal CRUD with MongoDB.",
        "question":"What challenge did you overcome today?",
        "tinyStep":"Continue focusing on one feature at a time."
    }}

    Rules:

    - Warm and supportive tone
    - Personalized
    - Reflection question should encourage self-awareness
    - Tiny step should be practical
    - No markdown
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

        return json.loads(clean_response)

    except Exception as e:

        print(
            "Journal Reflection Error:",
            e
        )

        return {

            "theme":
            "Personal Growth",

            "highlight":
            title,

            "question":
            "What part of today are you most proud of?",

            "tinyStep":
            "Take one small step tomorrow instead of trying to do everything."

        }

async def update_reminder_ai_insights(email):

    reminders = list(
        db.reminders.find(
            {"userEmail": email},
            {"_id": 0}
        )
    )

    if not reminders:
        return

    insights = await generate_reminder_insights(
        reminders
    )

    db.reminder_ai_insights.update_one(

        {
            "email": email
        },

        {
            "$set": {

                "email": email,

                "insights": insights,

                "updated_at": datetime.utcnow()

            }
        },

        upsert=True

    )

class JournalReflectionRequest(
    BaseModel
):

    title: str

    content: str

    category: str

    mood: str

@router.get("/ai-insight")
async def get_ai_insight(
    email: str = Query(...)
):

    result = db.ai_insights.find_one(
        {"email": email},
        {"_id": 0}
    )

    if not result:

        return {
            "insight":
            "Start tracking your moods to unlock personalized insights."
        }

    return result

@router.get("/mood-correlation")
async def get_mood_correlation(
    email: str = Query(...)
):

    result = db.ai_insights.find_one(
        {"email": email},
        {"_id": 0}
    )

    if not result:

        return {
            "insight":
            "Keep tracking your moods to uncover emotional patterns."
        }

    return {
        "insight":
        result.get(
            "correlation_insight",
            "Keep tracking your moods to uncover emotional patterns."
        )
    }

@router.get("/mood-recommendations")
async def get_mood_recommendations(
    email: str = Query(...)
):

    result = db.ai_recommendations.find_one(

        {"email": email},

        {"_id": 0}

    )

    if not result:

        return {

            "mood": None,

            "mood_date": None,

            "generated_at": None,

            "recommendations": []

        }

    return result

@router.get("/reminder-insights")
async def get_reminder_insights(email: str):

    result = db.reminder_ai_insights.find_one(
        {"email": email},
        {"_id": 0}
    )

    if not result:

        return {
            "insights": []
        }

    return result

@router.post(
    "/journal-reflection"
)
async def get_journal_reflection(
    data: JournalReflectionRequest
):

    reflection = await generate_journal_reflection(

        data.title,

        data.content,

        data.category,

        data.mood

    )

    return reflection

@router.get("/recent-activity")
async def get_recent_activity(
    email: str = Query(...)
):

    activities = []

    seven_days_ago = (
        datetime.utcnow() -
        timedelta(days=7)
    )

    moods = list(

        db.moods.find({

            "email": email,

            "date": {
                "$gte": seven_days_ago
            }

        })

    )

    for mood in moods:

        activities.append({

            "title":
            f"Logged Mood {mood['emoji']}",

            "time":
            mood["date"],

            "color":
            "yellow"

        })

    journals = list(

        db.journals.find({

            "userEmail": email,

            "createdAt": {
                "$gte": seven_days_ago
            }

        })

    )

    for journal in journals:

        activities.append({

            "title":
            "Wrote Journal Entry",

            "time":
            journal["createdAt"],

            "color":
            "purple"

        })

    reminders = list(

        db.reminders.find({

            "userEmail": email

        })

    )

    for reminder in reminders:

        if reminder.get("completed", False):

            title = (
                f"Completed {reminder['title']}"
            )

            color = "green"

        else:

            title = (
                f"Created {reminder['title']}"
            )

            color = "pink"

        activities.append({

            "title":
            title,

            "time":
            datetime.utcnow(),

            "color":
            color

        })

    activities.sort(

        key=lambda x: x["time"],

        reverse=True

    )

    return activities[:10]

@router.get("/profile-insight")
async def get_profile_insight(
    email: str = Query(...)
):

    result = db.profile_insights.find_one(

        {"email": email},

        {"_id":0}

    )

    if not result:

        return {

            "insight":
            "Start tracking moods and habits to unlock personalized wellness insights."

        }

    return result