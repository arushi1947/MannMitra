from fastapi import APIRouter, Query
from pydantic import BaseModel
from datetime import datetime
from database.db import db
from routes.ai_insight import generate_ai_insight, generate_correlation_insight, generate_mood_recommendations, generate_profile_insight
from bson import ObjectId

router = APIRouter()

moods_collection = db["moods"]

class MoodRequest(BaseModel):
    email: str
    mood: str
    emoji: str
    score: int
    date: str
    note: str = ""

class MoodUpdate(BaseModel):
    mood: str
    emoji: str
    score: int
    note: str = ""

@router.post("/save-mood")
async def save_mood(data: MoodRequest):

    today = datetime.utcnow().date()

    existing = moods_collection.find_one({

        "email": data.email,
        "date_only": str(today)

    })

    if existing:

        moods_collection.update_one(

            {"_id": existing["_id"]},

            {
                "$set": {
                    "mood": data.mood,
                    "emoji": data.emoji,
                    "score": data.score,
                    "note": data.note,
                    "updated_at": datetime.utcnow()
                }
            }

        )

        all_moods = list(

            moods_collection.find(
                {"email": data.email},
                {"_id": 0}
            )

        )

        recommendations = await generate_mood_recommendations(
            all_moods
        )

        insight = await generate_ai_insight(
            all_moods
        )

        correlation_insight = (
            await generate_correlation_insight(
                all_moods
            )
        )

        db.ai_recommendations.update_one(

            {
                "email": data.email
            },

            {
                "$set": {

                    "email": data.email,

                    "mood": data.mood,

                    "mood_date": str(today),

                    "recommendations": recommendations,

                    "generated_at":
                    datetime.utcnow()

                }
            },

            upsert=True

        )

        db.ai_insights.update_one(

            {
                "email": data.email
            },

            {
                "$set": {

                    "insight": insight,

                    "correlation_insight":
                    correlation_insight,

                    "updated_at":
                    datetime.utcnow()

                }
            },

            upsert=True

        )

        await generate_profile_insight(
            mood["email"]
        )

        return {
            "message": "Mood updated successfully"
        }

    else:

        moods_collection.insert_one({

            "email": data.email,
            "mood": data.mood,
            "emoji": data.emoji,
            "score": data.score,
            "note": data.note,

            "date": datetime.utcnow(),

            "date_only": str(today)

        })

        all_moods = list(

            moods_collection.find(
                {"email": data.email},
                {"_id": 0}
            )

        )

        recommendations = await generate_mood_recommendations(
            all_moods
        )

        insight = await generate_ai_insight(
            all_moods
        )

        correlation_insight = (
            await generate_correlation_insight(
                all_moods
            )
        )

        db.ai_recommendations.update_one(

            {
                "email": data.email
            },

            {
                "$set": {

                    "email": data.email,

                    "mood": data.mood,

                    "mood_date": str(today),

                    "recommendations": recommendations,

                    "generated_at":
                    datetime.utcnow()

                }
            },

            upsert=True

        )

        db.ai_insights.update_one(

            {
                "email": data.email
            },

            {
                "$set": {

                    "insight": insight,

                    "correlation_insight":
                    correlation_insight,

                    "updated_at":
                    datetime.utcnow()

                }
            },

            upsert=True

        )

        await generate_profile_insight(
            data.email
        )

        return {
            "message": "Mood saved successfully"
        }

@router.get("/moods")
async def get_moods(
    email: str = Query(...)
):

    moods = list(
        moods_collection.find(
            {"email": email}
        )
    )

    for mood in moods:

        mood["_id"] = str(
            mood["_id"]
        )

    return moods

@router.get("/mood-stats")
async def mood_stats(email: str):

    moods = list(
        moods_collection.find(
            {"email": email},
            {"_id": 0}
        )
    )

    if not moods:

        return {
            "average_score": 0,
            "entries": 0
        }

    average_score = round(
        sum(m["score"] for m in moods)
        / len(moods),
        2
    )

    return {
        "average_score": average_score,
        "entries": len(moods)
    }

@router.delete("/moods/{mood_id}")
async def delete_mood(mood_id: str):

    mood = db.moods.find_one(
        {"_id": ObjectId(mood_id)}
    )

    if not mood:
        return {
            "message": "Mood not found"
        }

    db.moods.delete_one(
        {"_id": ObjectId(mood_id)}
    )

    all_moods = list(
        db.moods.find(
            {"email": mood["email"]},
            {"_id": 0}
        )
    )

    insight = await generate_ai_insight(
        all_moods
    )

    correlation_insight = (
        await generate_correlation_insight(
            all_moods
        )
    )

    db.ai_insights.update_one(
        {
            "email": mood["email"]
        },
        {
            "$set": {
                "insight": insight,
                "correlation_insight":
                correlation_insight,
                "updated_at":
                datetime.utcnow()
            }
        },
        upsert=True
    )

    await generate_profile_insight(
        mood["email"]
    )

    return {
        "message": "Mood deleted"
    }

@router.put("/moods/{mood_id}")
async def update_mood(
    mood_id: str,
    data: MoodUpdate
):

    mood = db.moods.find_one(
        {
            "_id": ObjectId(mood_id)
        }
    )

    if not mood:

        return {
            "message": "Mood not found"
        }

    db.moods.update_one(

        {
            "_id": ObjectId(mood_id)
        },

        {
            "$set": {

                "mood": data.mood,
                "emoji": data.emoji,
                "score": data.score,
                "note": data.note,
                "updated_at": datetime.utcnow()

            }
        }

    )

    all_moods = list(

        db.moods.find(
            {
                "email": mood["email"]
            },
            {"_id": 0}
        )

    )

    insight = await generate_ai_insight(
        all_moods
    )

    correlation_insight = (
        await generate_correlation_insight(
            all_moods
        )
    )

    db.ai_insights.update_one(

        {
            "email": mood["email"]
        },

        {
            "$set": {

                "insight": insight,

                "correlation_insight":
                correlation_insight,

                "updated_at":
                datetime.utcnow()

            }
        },

        upsert=True

    )

    await generate_profile_insight(
        data.email
    )

    return {
        "message": "Mood updated successfully"
    }

@router.get("/journal-by-date")
async def get_journal_by_date(
    email: str,
    date: str
):

    journals = []

    for journal in db.journals.find({
        "userEmail": email,
        "date_only": date
    }):

        journal["_id"] = str(journal["_id"])

        journals.append({
            "_id": journal["_id"],
            "title": journal.get("title", ""),
            "content": journal.get("content", ""),
            "category": journal.get("category", "Personal"),
            "mood": journal.get("mood", "😊 Happy")
        })

    return journals