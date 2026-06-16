from pydantic import BaseModel

class ContactInfo(BaseModel):
    email: str
    response_time: str