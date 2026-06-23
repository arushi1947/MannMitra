from fastapi import APIRouter
from database.db import trusted_contacts
from bson import ObjectId
from datetime import datetime

router = APIRouter()

@router.post("/trusted-contact")
async def add_trusted_contact(contact: dict):

    trusted_contacts.insert_one({

        "userEmail":
        contact["userEmail"],

        "name":
        contact["name"],

        "phone":
        contact["phone"],

        "relationship":
        contact.get(
            "relationship",
            ""
        ),

        "createdAt":
        datetime.utcnow()

    })

    return {

        "message":
        "Trusted contact added"

    }

@router.get("/trusted-contact/{email}")
async def get_trusted_contacts(email: str):

    contacts = []

    for contact in trusted_contacts.find(
        {"userEmail": email}
    ):

        contact["_id"] = str(
            contact["_id"]
        )

        contacts.append(contact)

    return contacts

@router.delete(
    "/delete-trusted-contact/{id}"
)
async def delete_trusted_contact(id: str):

    trusted_contacts.delete_one(

        {
            "_id":
            ObjectId(id)
        }

    )

    return {

        "message":
        "Contact deleted"

    }