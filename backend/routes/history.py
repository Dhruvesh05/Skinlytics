from typing import Any, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.dependencies.auth import get_current_user
from backend.models import SkinHistory, User

router = APIRouter()


class SaveHistoryRequest(BaseModel):
    skin_type: str
    sensitivity: str
    concern: str
    result: Any


@router.post("/history/save")
def save_history(
    request: SaveHistoryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    history_item = SkinHistory(
        user_id=current_user.id,
        skin_type=request.skin_type,
        sensitivity=request.sensitivity,
        concern=request.concern,
        result=request.result,
    )

    db.add(history_item)
    db.commit()
    db.refresh(history_item)

    return {
        "success": True,
        "history_id": history_item.id,
        "created_at": history_item.created_at,
    }


@router.get("/history")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items: List[SkinHistory] = (
        db.query(SkinHistory)
        .filter(SkinHistory.user_id == current_user.id)
        .order_by(SkinHistory.created_at.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "skin_type": item.skin_type,
            "sensitivity": item.sensitivity,
            "concern": item.concern,
            "result": item.result,
            "created_at": item.created_at,
        }
        for item in items
    ]
