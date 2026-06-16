from pydantic import BaseModel

class ContactMessage(BaseModel):
    name: str
    email: str
    message: str