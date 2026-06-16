from cryptography.fernet import Fernet, InvalidToken
import os

KEY = os.getenv("ENCRYPTION_KEY")

cipher = Fernet(KEY.encode())


def encrypt_text(text: str):

    if not text:
        return ""

    return cipher.encrypt(
        text.encode()
    ).decode()


def decrypt_text(text: str):

    if not text:
        return ""

    try:

        return cipher.decrypt(
            text.encode()
        ).decode()

    except InvalidToken:

        return text