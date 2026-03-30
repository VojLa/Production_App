from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, MessageResponse, ResendVerificationRequest
from app.services.auth_service import AuthService

router = APIRouter()

@router.post('/register', response_model=MessageResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService(db).register(data)

@router.post('/login', response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService(db).login(data)

@router.get('/verify-email', response_model=MessageResponse)
async def verify_email(token: str = Query(...), db: AsyncSession = Depends(get_db)):
    return await AuthService(db).verify_email(token)

@router.post('/resend-verification', response_model=MessageResponse)
async def resend_verification(data: ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    return await AuthService(db).resend_verification(data.email)
