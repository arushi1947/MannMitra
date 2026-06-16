from fastapi import APIRouter
from database.db import db
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from routes.ai_insight import generate_profile_insight

router = APIRouter()

reminders = db["reminders"]

@router.post("/add-reminder")
async def add_reminder(reminder: dict):
    reminder["notificationRead"] = False

    reminders.insert_one(reminder)

    await update_reminder_ai_insights(
        reminder["userEmail"]
    )

    await generate_profile_insight(
        reminder["userEmail"]
    )

    return {
        "message": "Reminder Added"
    }

@router.get("/get-reminders/{email}")
def get_reminders(email: str):

    user_reminders = list(
        reminders.find({"userEmail": email})
    )

    for reminder in user_reminders:

        reminder["_id"] = str(reminder["_id"])

    return user_reminders

@router.delete("/delete-reminder/{id}")
async def delete_reminder(id: str):

    old_reminder = reminders.find_one(
        {"_id": ObjectId(id)}
    )

    reminders.delete_one({
        "_id": ObjectId(id)
    })

    await update_reminder_ai_insights(
        reminder["userEmail"]
    )

    await generate_profile_insight(
        reminder["userEmail"]
    )

    return {
        "message": "Reminder Deleted"
    }

@router.put("/complete-reminder/{id}")
async def complete_reminder(id: str):

    reminder = reminders.find_one(
        {"_id": ObjectId(id)}
    )

    reminders.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "completed": True,
                "completedDate": str(datetime.utcnow().date())
            }
        }
    )

    await update_reminder_ai_insights(
        reminder["userEmail"]
    )

    await generate_profile_insight(
        reminder["userEmail"]
    )

    return {
        "message": "Reminder Completed"
    }

@router.put("/update-reminder/{id}")
async def update_reminder(id: str, reminder: dict):

    old_reminder = reminders.find_one(
        {"_id": ObjectId(id)}
    )

    reminders.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "title": reminder["title"],
                "description": reminder["description"],
                "date": reminder["date"],
                "time": reminder["time"],
                "priority": reminder["priority"]
            }
        }
    )

    await update_reminder_ai_insights(
        reminder["userEmail"]
    )

    await generate_profile_insight(
        old_reminder["userEmail"]
    )

    return {
        "message": "Reminder updated successfully"
    }

@router.put("/read-notification/{id}")
def read_notification(id: str):

    try:

        db.reminders.update_one(
            {"_id": ObjectId(id)},
            {
                "$set": {
                    "notificationRead": True
                }
            }
        )

        return {"message": "updated"}

    except InvalidId:

        return {
            "message": "Invalid notification id"
        }