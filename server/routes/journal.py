from fastapi import APIRouter
from database.db import db
from bson import ObjectId
from datetime import datetime
from utils.encryption import (encrypt_text, decrypt_text)
from routes.ai_insight import generate_profile_insight

router = APIRouter()

journals = db["journals"]

@router.post("/add-journal")
async def add_journal(journal: dict):

    encrypted_journal = {

        "title":
        encrypt_text(journal["title"]),

        "content":
        encrypt_text(journal["content"]),

        "category":
        encrypt_text(
            journal.get("category", "Personal")
        ),

        "mood":
        encrypt_text(
            journal.get("mood", "")
        ),

        "highlight":
        encrypt_text(
            journal.get("highlight", "")
        ),

        "gratitude": [

            encrypt_text(g)

            for g in journal.get(
                "gratitude",
                []
            )

        ],

        "attachments":
        journal.get(
            "attachments",
            []
        ),

        "futureLetter":
            encrypt_text(
                journal.get(
                    "futureLetter",
                    ""
                )
            ),

            "futureDate":
            encrypt_text(
                journal.get(
                    "futureDate",
                    ""
                )
            ),

        "aiReflection":
        journal.get(
            "aiReflection",
            {}
        ),

        "favorite":
        journal.get(
            "favorite",
            False
        ),

        "isPrivate":
        journal.get(
            "isPrivate",
            False
        ),

        "userEmail":
        journal["userEmail"],

        "createdAt":
        datetime.utcnow(),

        "searchContent":
        (
            journal["title"]
            + " "
            + journal["content"]
        ).lower()
    }

    journals.insert_one(
        encrypted_journal
    )

    await generate_profile_insight(
        journal["userEmail"]
    )

    return {

        "message": "Journal added"

    }

@router.get("/get-journals/{email}")
def get_journals(email: str):

    data = []

    for journal in journals.find(
        {"userEmail": email}
    ).sort("createdAt", -1):

        journal["_id"] = str(
            journal["_id"]
        )

        journal["title"] = decrypt_text(
            journal["title"]
        )

        journal["content"] = decrypt_text(
            journal["content"]
        )

        journal["category"] = decrypt_text(
            journal["category"]
        )

        journal["mood"] = decrypt_text(
            journal["mood"]
        )

        journal["highlight"] = decrypt_text(
            journal.get(
                "highlight",
                ""
            )
        )

        journal["futureLetter"] = decrypt_text(
            journal.get(
                "futureLetter",
                ""
            )
        )

        journal["futureDate"] = decrypt_text(
            journal.get(
                "futureDate",
                ""
            )
        )

        journal["gratitude"] = [

            decrypt_text(g)

            for g in journal.get(
                "gratitude",
                []
            )

        ]

        data.append(journal)

    return data    

@router.delete("/delete-journal/{id}")
async def delete_journal(id: str):

    journal = journals.find_one(
        {"_id": ObjectId(id)}
    )

    if journal:

        journals.delete_one(
            {"_id": ObjectId(id)}
        )

        await generate_profile_insight(
            journal["userEmail"]
        )

    return {
        "message": "Deleted"
    }

@router.put("/update-journal/{id}")
async def update_journal(id: str, journal: dict):

    old_journal = journals.find_one(
        {"_id": ObjectId(id)}
    )

    journals.update_one(

        {

            "_id": ObjectId(id)

        },

        {

            "$set": {

                "title":

                encrypt_text(
                    journal["title"]
                ),

                "content":

                encrypt_text(
                    journal["content"]
                ),

                "category":

                encrypt_text(
                    journal["category"]
                ),

                "mood":

                encrypt_text(
                    journal["mood"]
                ),

                "highlight":

                encrypt_text(

                    journal.get(

                        "highlight",

                        ""

                    )

                ),

                "gratitude": [

                    encrypt_text(g)

                    for g in journal.get(

                        "gratitude",

                        []

                    )

                ],

                "attachments":

                journal.get(

                    "attachments",

                    []

                ),

                "futureLetter":
                encrypt_text(
                    journal.get(
                        "futureLetter",
                        ""
                    )
                ),

                "futureDate":
                encrypt_text(
                    journal.get(
                        "futureDate",
                        ""
                    )
                ),

                "aiReflection":

                journal.get(

                    "aiReflection",

                    {}

                ),

                "isPrivate":

                journal.get(

                    "isPrivate",

                    False

                ),

                "searchContent":

                (

                    journal["title"]

                    + " "

                    + journal["content"]

                ).lower()

            }

        }

    )

    await generate_profile_insight(
        old_journal["userEmail"]
    )

    return {

        "message": "Updated"

    }

@router.put("/toggle-favorite/{id}")
def toggle_favorite(id: str):

    journal = journals.find_one(
        {"_id": ObjectId(id)}
    )

    journals.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "favorite": not journal.get(
                    "favorite",
                    False
                )
            }
        }
    )

    return {"message": "Favorite Updated"}
    