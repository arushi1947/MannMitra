from fastapi import APIRouter, HTTPException, Header
from fastapi.encoders import jsonable_encoder
from database.db import db
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from dotenv import load_dotenv
from utils.email import send_reset_email
from utils.email import send_intruder_alert_email
from utils.email import send_master_pin_reset_email
from webauthn import (generate_registration_options, verify_registration_response, generate_authentication_options, verify_authentication_response)
from webauthn.helpers import options_to_json
import base64
import os

load_dotenv()

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None

users = db["users"]
sessions = db["sessions"]
intruders = db["intruders"]

registration_challenges = {}
authentication_challenges = {}

@router.post("/register")
def register(user: dict):

    existing_user = users.find_one({"email": user["email"]})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    hashed_password = pwd_context.hash(user["password"])

    user_data = {

        "name": user["name"],

        "email": user["email"],

        "password": hashed_password,

        "masterPin": "",

        "decoyPin": "",

        "failedPinAttempts": 0,

        "journalLocked": False,

        "faceIdEnabled": False,
        "credentialId": "",
        "publicKey": "",
        "signCount": 0,

        "recoveryCodes": [],

        "createdAt": datetime.utcnow(),

        "googleAuth": False

    }

    users.insert_one(user_data)

    return {"message": "User Registered Successfully"}

@router.post("/login")
def login(user: dict):

    existing_user = users.find_one({"email": user["email"]})

    if not existing_user:
        raise HTTPException(status_code=400, detail="User not found")

    if existing_user.get("googleAuth"):

        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In."
        )

    password_match = pwd_context.verify(
        user["password"],
        existing_user["password"]
    )

    if not password_match:
        raise HTTPException(status_code=400, detail="Incorrect password")

    token_data = {
        "email": existing_user["email"],
        "exp": datetime.utcnow() + timedelta(days=1)
    }

    token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    sessions.insert_one({

        "email": existing_user["email"],

        "browser": user["deviceInfo"]["browser"],

        "os": user["deviceInfo"]["os"],

        "device": user["deviceInfo"]["device"],

        "lastActive": datetime.utcnow(),

        "current": True

    })

    return {
        "token": token,
        "user": {
            "name": existing_user["name"],
            "email": existing_user["email"],
            "createdAt": str(existing_user.get("createdAt", "")),
            "googleAuth": existing_user.get("googleAuth", False)
        }
    }

@router.post("/google-login")
def google_login(user: dict):

    existing_user = users.find_one({
        "email": user["email"]
    })

    if not existing_user:

        new_user = {

            "name": user["name"],

            "email": user["email"],

            "password": "",

            "createdAt": datetime.utcnow(),

            "googleAuth": True

        }

        users.insert_one(new_user)

    token_data = {

        "email": user["email"],

        "exp": datetime.utcnow() + timedelta(days=7)

    }

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    sessions.insert_one({

        "email": user["email"],

        "browser": user["deviceInfo"]["browser"],

        "os": user["deviceInfo"]["os"],

        "device": user["deviceInfo"]["device"],

        "lastActive": datetime.utcnow(),

        "current": True

    })

    return {

        "token": access_token,

        "user": {

            "name": user["name"],

            "email": user["email"],

            "createdAt": str(
                str(existing_user.get("createdAt", ""))
                if existing_user
                else datetime.utcnow()
            ),

            "googleAuth": True

        }

    }

@router.get("/get-devices/{email}")
def get_devices(email: str):

    user_devices = list(
        sessions.find(
            {"email": email}
        )
        .sort("lastActive", -1)
    )

    for device in user_devices:
        device["_id"] = str(device["_id"])

    return user_devices

@router.post("/forgot-password")
async def forgot_password(data: dict):

    email = data["email"]

    user = users.find_one({

        "email": email

    })

    if not user:

        return {

            "message": "If an account exists, a reset link has been sent."

        }

    if user.get("googleAuth"):

        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In."
        )

    token = jwt.encode(

        {

            "email": email,

            "exp": datetime.utcnow()
            + timedelta(minutes=15)

        },

        SECRET_KEY,

        algorithm=ALGORITHM
    )

    reset_link = (

        f"http://localhost:5173/reset-password/{token}"

    )

    await send_reset_email(

        email,
        reset_link

    )

    return {

        "message": "If an account exists, a reset link has been sent."

    }

@router.post("/reset-password")
async def reset_password(data: dict):

    token = data["token"]

    password = data["password"]

    try:

        decoded = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        email = decoded["email"]
        existing_user = users.find_one({
            "email": email
        })

        if existing_user.get("googleAuth"):

            raise HTTPException(
                status_code=400,
                detail="Google accounts cannot reset password."
            )

        hashed_password = pwd_context.hash(
            password
        )

        users.update_one(

            {

                "email": email

            },

            {

                "$set": {

                    "password": hashed_password

                }

            }

        )

        return {

            "message": "Password reset successful"

        }

    except JWTError:

        return {

            "message": "Invalid or expired token"

        }

@router.post("/logout-all-devices")
def logout_all_devices(
    authorization: str = Header(None)
):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Unauthorized"
        )

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload["email"]

    sessions.delete_many({
        "email": email
    })

    return {
        "message": "Logged out from all devices successfully"
    }

@router.post("/set-master-pin")
def set_master_pin(data: dict):

    users.update_one(

        {

            "email": data["email"]

        },

        {

            "$set": {

                "masterPin":

                pwd_context.hash(data["pin"])

            }

        }

    )

    return {

        "message": "Master PIN saved"

    }

@router.post("/set-decoy-pin")
def set_decoy_pin(data: dict):

    users.update_one(

        {

            "email": data["email"]

        },

        {

            "$set": {

                "decoyPin":

                pwd_context.hash(
                    data["pin"]
                )

            }

        }

    )

    return {

        "message": "Decoy PIN saved"

    }

@router.put("/change-decoy-pin")
def change_decoy_pin(data: dict):

    user = users.find_one(
        {
            "email": data["email"]
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not pwd_context.verify(

        data["masterPin"],

        user["masterPin"]

    ):

        raise HTTPException(
            status_code=400,
            detail="Incorrect Master PIN"
        )

    users.update_one(

        {
            "email": data["email"]
        },

        {
            "$set": {

                "decoyPin":
                pwd_context.hash(
                    data["newDecoyPin"]
                )

            }
        }

    )

    return {

        "message":
        "Decoy PIN updated successfully"

    }

@router.delete("/remove-decoy-pin")
def remove_decoy_pin(data: dict):

    user = users.find_one(
        {
            "email": data["email"]
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not pwd_context.verify(

        data["masterPin"],

        user["masterPin"]

    ):

        raise HTTPException(
            status_code=400,
            detail="Incorrect Master PIN"
        )

    users.update_one(

        {
            "email": data["email"]
        },

        {
            "$set": {

                "decoyPin": ""

            }
        }

    )

    return {

        "message":
        "Decoy PIN removed successfully"

    }

@router.get("/decoy-pin-status/{email}")
def decoy_pin_status(email: str):

    user = users.find_one(
        {
            "email": email
        }
    )

    return {

        "hasDecoyPin":

        bool(

            user.get(

                "decoyPin",

                ""

            )

        )

    }

@router.post("/verify-master-pin")
async def verify_master_pin(data: dict):

    user = users.find_one(
        {
            "email": data["email"]
        }
    )

    if not user:

        return {

            "success": False

        }

    if user.get("journalLocked", False):

        return {

            "success": False,

            "locked": True

        }

    if "masterPin" not in user:

        users.update_one(

            {

                "_id": user["_id"]

            },

            {

                "$set": {

                    "masterPin": "",
                    "decoyPin": "",
                    "failedPinAttempts": 0,
                    "journalLocked": False

                }

            }

        )

        user = users.find_one(

            {

                "_id": user["_id"]

            }

        )

    master_pin = user.get(

        "masterPin",

        ""

    )

    decoy_pin = user.get(

        "decoyPin",

        ""

    )

    failed_attempts = user.get(

        "failedPinAttempts",

        0

    )

    if not master_pin:

        return {

            "success": True,

            "decoy": False

        }

    if pwd_context.verify(

        data["pin"],

        master_pin

    ):

        users.update_one(

            {

                "_id": user["_id"]

            },

            {

                "$set": {

                    "failedPinAttempts": 0

                }

            }

        )

        return {

            "success": True,

            "decoy": False

        }

    if (

        decoy_pin

        and

        pwd_context.verify(

            data["pin"],

            decoy_pin

        )

    ):

        return {

            "success": True,

            "decoy": True

        }

    failed_attempts += 1

    users.update_one(

        {

            "_id": user["_id"]

        },

        {

            "$set": {

                "failedPinAttempts": failed_attempts

            }

        }

    )

    if failed_attempts >= 5:

        intruders.insert_one(

            {

                "email": user["email"],

                "device":

                data.get(

                    "device",

                    "Unknown Device"

                ),

                "browser":

                data.get(

                    "browser",

                    "Unknown Browser"

                ),

                "os":

                data.get(

                    "os",

                    "Unknown OS"

                ),

                "timestamp":

                datetime.utcnow()

            }

        )

        await send_intruder_alert_email(

            user["email"],

            data.get(
                "device",
                "Unknown Device"
            ),

            data.get(
                "browser",
                "Unknown Browser"
            ),

            data.get(
                "os",
                "Unknown OS"
            ),

            data.get(
                "image",
                ""
            ),

            data.get(
                "ip",
                "Unknown IP"
            ),

            data.get(
                "location",
                "Unknown Location"
            ),

            str(datetime.utcnow())


        )

        users.update_one(

            {

                "_id": user["_id"]

            },

            {

                "$set": {

                    "failedPinAttempts": 0,

                    "journalLocked": True

                }

            }

        )

    return {

        "success": False,

        "decoy": False,

        "locked": user.get(

            "journalLocked",

            False

        )

    }

@router.post("/forgot-master-pin")
async def forgot_master_pin(data: dict):

    email = data["email"]

    user = users.find_one(
        {
            "email": email
        }
    )

    if not user:

        return {
            "message":
            "If an account exists, a reset link has been sent."
        }

    token = jwt.encode(

        {
            "email": email,

            "type": "master-pin",

            "exp":
            datetime.utcnow()
            + timedelta(minutes=15)
        },

        SECRET_KEY,

        algorithm=ALGORITHM
    )

    reset_link = (

        f"http://localhost:5173/reset-pin/{token}"

    )

    await send_master_pin_reset_email(

        email,

        reset_link

    )

    return {

        "message":

        "Reset link sent"

    }

@router.post("/reset-pin")
def reset_pin(data: dict):

    token = data["token"]

    new_pin = data["pin"]

    try:

        decoded = jwt.decode(

            token,

            SECRET_KEY,

            algorithms=[ALGORITHM]

        )

        if decoded.get("type") != "master-pin":

            raise HTTPException(
                status_code=400,
                detail="Invalid token"
            )

        email = decoded["email"]

        users.update_one(

            {
                "email": email
            },

            {
                "$set": {

                    "masterPin":

                    pwd_context.hash(
                        new_pin
                    ),

                    "failedPinAttempts": 0
                }
            }

        )

        return {

            "message":

            "Master PIN updated successfully"

        }

    except JWTError:

        raise HTTPException(

            status_code=400,

            detail="Invalid or expired token"

        )

@router.put("/change-master-pin")
def change_master_pin(data: dict):

    user = users.find_one(
        {
            "email": data["email"]
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if not pwd_context.verify(

        data["currentPin"],

        user["masterPin"]

    ):

        raise HTTPException(

            status_code=400,

            detail="Current PIN is incorrect"

        )

    users.update_one(

        {

            "email": data["email"]

        },

        {

            "$set": {

                "masterPin":

                pwd_context.hash(

                    data["newPin"]

                )

            }

        }

    )

    return {

        "message":

        "Master PIN updated successfully"

    }

@router.post("/enable-face-id")
def enable_face_id(data: dict):

    users.update_one(

        {

            "email": data["email"]

        },

        {

            "$set": {

                "faceIdEnabled": True

            }

        }

    )

    return {

        "message": "Face ID enabled"

    }

@router.post("/disable-face-id")
def disable_face_id(data: dict):

    users.update_one(

        {

            "email": data["email"]

        },

        {

            "$set": {

                "faceIdEnabled": False

            }

        }

    )

    return {

        "message": "Face ID disabled"

    }

@router.get("/face-id-status/{email}")
def face_id_status(email: str):

    user = users.find_one(

        {

            "email": email

        }

    )

    return {

        "enabled":

        user.get(

            "faceIdEnabled",

            False

        )

    }

@router.post("/generate-registration-options")
def generate_options(data: dict):

    options = generate_registration_options(
        rp_id="localhost",
        rp_name="MannMitra",
        user_id=data["email"].encode(),
        user_name=data["email"]
    )

    registration_challenges[data["email"]] = options.challenge

    return options_to_json(options)

@router.post("/verify-registration")
def verify_registration(data: dict):

    user = users.find_one(
        {"email": data["email"]}
    )

    verification = verify_registration_response(
        credential=data["credential"],
        expected_challenge=registration_challenges[data["email"]],
        expected_origin="http://localhost:5173",
        expected_rp_id="localhost"
    )

    users.update_one(
        {"email": data["email"]},
        {
            "$set": {

                "faceIdEnabled": True,

                "credentialId":
                base64.b64encode(
                    verification.credential_id
                ).decode(),

                "publicKey":
                base64.b64encode(
                    verification.credential_public_key
                ).decode(),

                "signCount":
                verification.sign_count

            }
        }
    )

    return {
        "success": True
    }

@router.post("/generate-auth-options")
def generate_auth_options(data: dict):

    user = users.find_one(
        {
            "email": data["email"]
        }
    )

    options = generate_authentication_options(

        rp_id="localhost",

        allow_credentials=[

            {

                "id":
                base64.b64decode(
                    user["credentialId"]
                ),

                "type":
                "public-key"

            }

        ]

    )

    authentication_challenges[
        data["email"]
    ] = options.challenge

    return jsonable_encoder(

        options,

        custom_encoder={
            bytes: lambda v: base64.urlsafe_b64encode(v)
            .rstrip(b"=")
            .decode()
        }

    )

@router.post("/verify-auth")
def verify_auth(data: dict):

    user = users.find_one(
        {"email": data["email"]}
    )

    verification = verify_authentication_response(

        credential=data["credential"],

        expected_challenge=
        authentication_challenges[data["email"]],

        expected_origin=
        "http://localhost:5173",

        expected_rp_id=
        "localhost",

        credential_public_key=
        base64.b64decode(
            user["publicKey"]
        ),

        credential_current_sign_count=
        user["signCount"]

    )

    users.update_one(

        {"email": data["email"]},

        {

            "$set": {

                "signCount": 0

            }

        }

    )

    return {

        "success": True

    }

@router.post("/face-login")
def face_login(data: dict):

    user = users.find_one(
        {
            "email": data["email"]
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    token_data = {

        "email": user["email"],

        "exp":
        datetime.utcnow()
        + timedelta(days=1)

    }

    token = jwt.encode(

        token_data,

        SECRET_KEY,

        algorithm=ALGORITHM

    )

    return {

        "token": token,

        "user": {

            "name": user["name"],

            "email": user["email"],

            "createdAt": str(
                user.get("createdAt", "")
            ),

            "googleAuth":
            user.get(
                "googleAuth",
                False
            )

        }

    }

@router.post("/unlock-journals")
def unlock_journals(data: dict):

    user = users.find_one({

        "email": data["email"]

    })

    if not user:

        raise HTTPException(

            status_code=404,

            detail="User not found"

        )

    users.update_one(

        {

            "email": data["email"]

        },

        {

            "$set": {

                "journalLocked": False,

                "failedPinAttempts": 0

            }

        }

    )

    return {

        "message": "Journals unlocked"

    }

@router.get("/journal-lock-status/{email}")
def journal_lock_status(email: str):

    user = users.find_one(
        {
            "email": email
        }
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {

        "locked":

        user.get(

            "journalLocked",

            False

        )

    }