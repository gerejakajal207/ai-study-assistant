from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.services.gemini import generate_mcqs_from_notes, generate_flashcards_from_notes
from app.services.pdf_parser import extract_text_from_pdf
from app.core.auth import get_current_user
from app.models.user import User
import io

router = APIRouter(prefix="/notes", tags=["notes"])

# ── MCQ from Notes ───────────────────────────────────────────
@router.post("/mcq")
async def get_mcqs_from_notes(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        questions = generate_mcqs_from_notes(text)
        return questions
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate MCQs from notes")

# ── Flashcards from Notes ────────────────────────────────────
@router.post("/flashcards")
async def get_flashcards_from_notes(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        cards = generate_flashcards_from_notes(text)
        return cards
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate flashcards from notes")