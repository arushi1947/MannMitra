from fastapi import APIRouter, Header, HTTPException
from database.db import db
from routes.auth import (
    verify_token,
    pwd_context
)
from utils.email import send_otp_email
from fastapi.responses import FileResponse
from datetime import datetime
import bcrypt
from pydantic import BaseModel
import zipfile
import json
import os
import random

router = APIRouter()

email_otps = {}

users = db["users"]

class DeleteAccountRequest(BaseModel):

    email: str

    password: str

@router.put("/change-name")
def change_name(
    data: dict,
    authorization: str = Header(None)
):

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    email = payload["email"]

    users.update_one(
        {"email": email},
        {
            "$set": {
                "name": data["newName"]
            }
        }
    )

    return {
        "message": "Name updated successfully"
    }

@router.put("/change-email")
def change_email(
    data: dict,
    authorization: str = Header(None)
):

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    email = payload["email"]

    user = users.find_one({
        "email": email
    })

    password_correct = pwd_context.verify(
        data["password"],
        user["password"]
    )

    if not password_correct:

        raise HTTPException(
            status_code=400,
            detail="Incorrect password"
        )

    users.update_one(
        {"email": email},
        {
            "$set": {
                "email": data["newEmail"]
            }
        }
    )

    return {
        "message": "Verification email sent"
    }

@router.put("/change-password")
def change_password(
    data: dict,
    authorization: str = Header(None)
):

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    if not payload:

        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    email = payload["email"]

    user = users.find_one({
        "email": email
    })

    password_correct = pwd_context.verify(
        data["currentPassword"],
        user["password"]
    )

    if not password_correct:

        raise HTTPException(
            status_code=400,
            detail="Incorrect current password"
        )

    hashed_password = pwd_context.hash(
        data["newPassword"]
    )

    users.update_one(
        {"email": email},
        {
            "$set": {
                "password": hashed_password
            }
        }
    )

    return {
        "message": "Password updated successfully"
    }

@router.post("/send-email-otp")
async def send_email_otp(data: dict):

    otp = str(random.randint(100000, 999999))

    email_otps[data["newEmail"]] = otp

    await send_otp_email(
        data["newEmail"],
        otp
    )

    return {
        "message": "OTP sent successfully"
    }

@router.put("/verify-email-otp")
def verify_email_otp(
    data: dict,
    authorization: str = Header(None)
):

    saved_otp = email_otps.get(
        data["newEmail"]
    )

    if saved_otp != data["otp"]:

        raise HTTPException(
            status_code=400,
            detail="Invalid OTP"
        )

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    email = payload["email"]

    users.update_one(
        {"email": email},
        {
            "$set": {
                "email": data["newEmail"]
            }
        }
    )

    del email_otps[data["newEmail"]]

    return {
        "message": "Email updated successfully"
    }

settings_collection = db["settings"]

@router.post("/save-settings")
def save_settings(data: dict):

    email = data["email"]

    existing = settings_collection.find_one({
        "email": email
    })

    if existing:

        settings_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "settings": data["settings"]
                }
            }
        )

    else:

        settings_collection.insert_one({
            "email": email,
            "settings": data["settings"]
        })

    return {
        "message": "Settings saved successfully"
    }

@router.get("/get-settings/{email}")
def get_settings(email: str):

    existing = settings_collection.find_one({
        "email": email
    })

    if existing:

        existing["_id"] = str(existing["_id"])

        return existing

    return {
        "settings": {

            "reminderNotifications": True,

            "dailyMoodReminder": True,

            "journalReminder": False,

            "soundEffects": True
        }
    }

reminders_collection = db["reminders"]

moods_collection = db["moods"]

journals_collection = db["journals"]

users_collection = db["users"]

@router.get("/download-user-data/{email}")

def download_user_data(email: str):

    reminders = list(
        reminders_collection.find(
            {"userEmail": email},
            {"_id": 0}
        )
    )

    moods = list(
        moods_collection.find(
            {"email": email},
            {"_id": 0}
        )
    )

    journals = list(
        journals_collection.find(
            {"email": email},
            {"_id": 0}
        )
    )

    profile = users_collection.find_one(
        {"email": email},
        {"_id": 0, "password": 0}
    )

    completed_reminders = len(
        [
            r for r in reminders
            if r.get("completed")
        ]
    )

    total_reminders = len(reminders)

    productivity = (
        round(
            (completed_reminders / total_reminders) * 100
        )
        if total_reminders > 0
        else 0
    )

    analytics = {

        "totalReminders": total_reminders,

        "completedReminders": completed_reminders,

        "pendingReminders":
            total_reminders - completed_reminders,

        "productivity": f"{productivity}%"

    }    

    folder_name = f"{email}_export"

    os.makedirs(folder_name, exist_ok=True)

    files = {

        "reminders.json": reminders,

        "moods.json": moods,

        "journals.json": journals,

        "analytics.json": analytics,

        "profile.json": profile

    }

    for filename, data in files.items():

        with open(

            os.path.join(folder_name, filename),

            "w"

        ) as file:

            json.dump(data, file, indent=4, default=str)

    zip_filename = f"{email}_mannmitra.zip"

    with zipfile.ZipFile(

        zip_filename,

        "w",

        zipfile.ZIP_DEFLATED

    ) as zipf:

        for filename in files.keys():

            zipf.write(

                os.path.join(folder_name, filename),

                arcname=filename

            )

    for filename in files.keys():

        os.remove(
            os.path.join(folder_name, filename)
        )

    os.rmdir(folder_name)

    return FileResponse(

        path=zip_filename,

        filename="mannmitra-data.zip",

        media_type="application/zip"

    )

@router.delete("/delete-account")

def delete_account(data: DeleteAccountRequest):

    user = users_collection.find_one({

        "email": data.email

    })

    if not user:

        return {
            "message": "User not found"
        }

    is_correct_password = bcrypt.checkpw(

        data.password.encode("utf-8"),

        user["password"].encode("utf-8")

    )

    if not is_correct_password:

        return {
            "message": "Incorrect password"
        }

    users_collection.delete_one({

        "email": data.email

    })

    reminders_collection.delete_many({

        "userEmail": data.email

    })

    moods_collection.delete_many({

        "email": data.email

    })

    journals_collection.delete_many({

        "email": data.email

    })

    return {

        "message": "Account deleted successfully"

    }