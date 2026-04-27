from fastapi import APIRouter, Depends

from backend.dependencies.auth import get_current_user
from backend.models import User

router = APIRouter()


@router.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "created_at": current_user.created_at,
    }
