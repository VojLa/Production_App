from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str|None
    is_active: bool
    is_email_verified: bool
    email_verified_at: datetime|None
    created_at: datetime
    class Config:
        from_attributes = True
