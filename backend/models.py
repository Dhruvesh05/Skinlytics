from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    history_items = relationship("SkinHistory", back_populates="user", cascade="all, delete-orphan")


class SkinHistory(Base):
    __tablename__ = "skin_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    skin_type = Column(String(100), nullable=False)
    sensitivity = Column(String(100), nullable=False)
    concern = Column(String(255), nullable=False)
    result = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="history_items")
