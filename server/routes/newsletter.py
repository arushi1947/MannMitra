from fastapi import APIRouter
from pydantic import BaseModel
from database.db import db
from datetime import datetime
from utils.email import send_welcome_email

router = APIRouter()

newsletter_collection = db["newsletter_subscribers"]


class NewsletterRequest(BaseModel):
    email: str


@router.post("/newsletter")
async def subscribe_newsletter(data: NewsletterRequest):

    existing_user = newsletter_collection.find_one({
        "email": data.email
    })

    if existing_user:

        return {
            "message": "Email already subscribed"
        }

    newsletter_collection.insert_one({
        "email": data.email,
        "subscribed_at": datetime.utcnow()
    })

    await send_welcome_email(data.email)

    return {
        "message": "Subscribed successfully"
    }