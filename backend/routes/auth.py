from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import User
from backend.services.auth_service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter()


class SignupRequest(BaseModel):
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    email = request.email.strip().lower()
    if not email or "@" not in email:
        raise HTTPException(status_code=422, detail="A valid email is required")
    if len(request.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists")

    new_user = User(
        email=email,
        password_hash=hash_password(request.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "email": new_user.email,
        "created_at": new_user.created_at,
    }


@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    email = request.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=expires_delta,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }
