from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.repositories.user_repository import UserRepository
from app.repositories.email_verification_repository import EmailVerificationRepository
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, MessageResponse
from app.services.email_service import EmailService
from app.utils.security import hash_password, verify_password, create_access_token, create_email_verification_token

class AuthService:
    def __init__(self, db: AsyncSession):
        self.repo = UserRepository(db)
        self.token_repo = EmailVerificationRepository(db)
        self.email_service = EmailService()
    async def register(self, data: RegisterRequest) -> MessageResponse:
        existing = await self.repo.get_by_email(data.email)
        if existing:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Uživatel s tímto emailem již existuje')
        try:
            hashed = hash_password(data.password)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
        user = await self.repo.create(email=data.email, password_hash=hashed, full_name=data.full_name)
        await self._send_verification_email(user.id, user.email, user.full_name)
        return MessageResponse(message='Účet byl vytvořen. Zkontrolujte e-mail a potvrďte registraci.')
    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.repo.get_by_email(data.email)
        try:
            ok = bool(user) and verify_password(data.password, user.password_hash)
        except ValueError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
        if not user or not ok:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Nesprávný email nebo heslo')
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Účet je deaktivován')
        if not user.is_email_verified:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Nejprve ověřte svůj e-mail. Ověřovací zprávu můžete poslat znovu.')
        return TokenResponse(access_token=create_access_token(user.id))
    async def verify_email(self, token:str) -> MessageResponse:
        entity = await self.token_repo.get_valid_by_token(token)
        if entity is None:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Ověřovací odkaz je neplatný nebo vypršel.')
        user = await self.repo.get_by_id(entity.user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Uživatel nenalezen')
        if not user.is_email_verified:
            await self.repo.mark_email_verified(user)
        await self.token_repo.mark_used(entity)
        return MessageResponse(message='E-mail byl úspěšně ověřen. Nyní se můžete přihlásit.')
    async def resend_verification(self, email:str) -> MessageResponse:
        user = await self.repo.get_by_email(email)
        if user and user.is_active and not user.is_email_verified:
            await self._send_verification_email(user.id, user.email, user.full_name)
        return MessageResponse(message='Pokud účet existuje a není ověřený, poslali jsme nový e-mail.')
    async def _send_verification_email(self, user_id:int, email:str, full_name:str|None) -> None:
        token = create_email_verification_token()
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES)
        await self.token_repo.create(user_id=user_id, token=token, expires_at=expires_at)
        url = f"{settings.FRONTEND_URL}/verify-email?token={token}"
        display = full_name or email
        html = f"<html><body><p>Dobrý den, {display},</p><p>děkujeme za registraci do ManuFlow. Pro aktivaci účtu klikněte na odkaz níže:</p><p><a href='{url}'>Ověřit e-mail</a></p><p>Pokud jste registraci neprováděli, tento e-mail ignorujte.</p></body></html>"
        text = (
            f"Dobrý den, {display},\n\n"
            f"děkujeme za registraci do ManuFlow. Pro aktivaci účtu otevřete tento odkaz:\n{url}\n\n"
            f"Pokud jste registraci neprováděli, tento e-mail ignorujte."
        )
        self.email_service.send_email(email, 'ManuFlow – ověření e-mailu', html, text)
