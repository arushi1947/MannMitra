from fastapi import APIRouter
from database.db import db
from datetime import datetime, timedelta

router = APIRouter()

reminders = db["reminders"]
moods = db["moods"]
journals = db["journals"]

@router.get("/get-streak/{email}")
def get_streak(email: str):

    streak = 0

    today = datetime.utcnow().date()

    for i in range(365):

        check_date = today - timedelta(days=i)

        reminder_activity = reminders.find_one({
            "userEmail": email,
            "completed": True,
            "completedDate": str(check_date)
        })

        mood_activity = moods.find_one({
            "userEmail": email,
            "date": str(check_date)
        })

        journal_activity = journals.find_one({
            "userEmail": email,
            "date": str(check_date)
        })

        if (
            reminder_activity or
            mood_activity or
            journal_activity
        ):

            streak += 1

        else:

            break

    return {
        "streak": streak
    }