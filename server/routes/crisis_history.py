from fastapi import APIRouter
from database.db import crisis_alerts

router = APIRouter()

@router.get("/crisis-history/{email}")
async def crisis_history(email: str):

    history = []

    for item in crisis_alerts.find(
        {"userEmail": email}
    ).sort("createdAt", -1):

        item["_id"] = str(item["_id"])

        history.append(item)

    return history