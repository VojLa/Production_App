from pydantic import BaseModel, EmailStr, field_validator

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str|None = None
    @field_validator('password')
    @classmethod
    def password_min_length(cls, v:str)->str:
        if len(v) < 8:
            raise ValueError('Heslo musí mít alespoň 8 znaků')
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'

class MessageResponse(BaseModel):
    message: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr
