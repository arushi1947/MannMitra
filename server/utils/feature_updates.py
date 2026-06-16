from fastapi import APIRouter
from database.db import db

router = APIRouter()

@router.get("/feature-announcements")
async def get_feature_announcements():

    announcements = list(

        db.feature_announcements.find(
            {"active": True},
            {"_id": 0}
        )

    )

    return announcements