from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.services.gemini import generate_mcqs, generate_flashcards
from app.core.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/topic", tags=["topic"])

class TopicRequest(BaseModel):
    topic: str

# ── MCQ ─────────────────────────────────────────────────────
@router.post("/mcq")
def get_mcqs(
    request: TopicRequest,
    current_user: User = Depends(get_current_user)
):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    try:
        questions = generate_mcqs(request.topic)
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate MCQs")

# ── Flashcards ───────────────────────────────────────────────
@router.post("/flashcards")
def get_flashcards(
    request: TopicRequest,
    current_user: User = Depends(get_current_user)
):
    if not request.topic.strip():
        raise HTTPException(status_code=400, detail="Topic cannot be empty")
    
    try:
        cards = generate_flashcards(request.topic)
        return cards
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate flashcards")