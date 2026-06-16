from fastapi import APIRouter

from pydantic import BaseModel

from database.db import db

from utils.email import (
    send_contact_notification,
    send_contact_thankyou_email
)

from datetime import datetime


router = APIRouter()

contact_collection = db["contact_messages"]


class ContactMessage(BaseModel):

    name: str
    email: str
    message: str

@router.post("/contact-message")

async def save_message(data: ContactMessage):

    contact_data = {

        "name": data.name,

        "email": data.email,

        "message": data.message,

        "created_at": datetime.utcnow()

    }

    contact_collection.insert_one(contact_data)

    await send_contact_notification(

        name=data.name,

        email=data.email,

        message_text=data.message

    )

    await send_contact_thankyou_email(

        email=data.email,

        name=data.name

    )

    return {

        "success": True,

        "message": "Message sent successfully"

    }