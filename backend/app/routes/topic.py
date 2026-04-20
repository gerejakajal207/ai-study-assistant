from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini import generate_mcqs, generate_flashcards, generate_summary, validate_topic

router = APIRouter()

class TopicRequest(BaseModel):
    topic: str
    difficulty: str = "Medium"
    confirmed: bool = False

class SummaryRequest(BaseModel):
    topic: str
    confirmed: bool = False

@router.post("/mcqs")
async def get_mcqs(request: TopicRequest):
    if not request.confirmed:
        validation = validate_topic(request.topic)
        if validation["status"] != "valid":
            return {"validation": validation}
    questions = generate_mcqs(request.topic, request.difficulty)
    return {"questions": questions}

@router.post("/flashcards")
async def get_flashcards(request: TopicRequest):
    if not request.confirmed:
        validation = validate_topic(request.topic)
        if validation["status"] != "valid":
            return {"validation": validation}
    cards = generate_flashcards(request.topic, request.difficulty)
    return {"cards": cards}

@router.post("/summary")
async def get_summary(request: SummaryRequest):
    if not request.confirmed:
        validation = validate_topic(request.topic)
        if validation["status"] != "valid":
            return {"validation": validation}
    summary = generate_summary(request.topic)
    return {"summary": summary}