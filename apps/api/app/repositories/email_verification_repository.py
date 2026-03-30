from datetime import datetime, timezone
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.email_verification_token import EmailVerificationToken

class EmailVerificationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    async def create(self, user_id:int, token:str, expires_at:datetime)->EmailVerificationToken:
        await self.db.execute(delete(EmailVerificationToken).where(EmailVerificationToken.user_id == user_id))
        entity = EmailVerificationToken(user_id=user_id, token=token, expires_at=expires_at)
        self.db.add(entity)
        await self.db.commit()
        await self.db.refresh(entity)
        return entity
    async def get_valid_by_token(self, token:str)->EmailVerificationToken|None:
        result = await self.db.execute(select(EmailVerificationToken).where(EmailVerificationToken.token == token))
        entity = result.scalar_one_or_none()
        if entity is None or entity.used_at is not None:
            return None
        exp = entity.expires_at if entity.expires_at.tzinfo else entity.expires_at.replace(tzinfo=timezone.utc)
        if exp < datetime.now(timezone.utc):
            return None
        return entity
    async def mark_used(self, entity:EmailVerificationToken)->None:
        entity.used_at = datetime.now(timezone.utc)
        await self.db.commit()
