from fastapi import APIRouter, UploadFile, File
from app.services.pdf_parser import extract_text_from_pdf
from app.services.gemini import (
    generate_mcqs_from_notes,
    generate_flashcards_from_notes,
    generate_summary_from_notes,
)
from app.services.rag import store_document, query_document, delete_document
from app.services.gemini import chat_with_context
from pydantic import BaseModel
from typing import List

router = APIRouter()

class Message(BaseModel):
    role: str
    text: str

class ChatRequest(BaseModel):
    doc_id: str
    question: str
    history: List[Message] = []

@router.post("/upload-mcqs")
async def upload_and_generate_mcqs(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    questions = generate_mcqs_from_notes(text)
    return {"questions": questions}

@router.post("/upload-flashcards")
async def upload_and_generate_flashcards(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    cards = generate_flashcards_from_notes(text)
    return {"cards": cards}

@router.post("/upload-summary")
async def upload_and_generate_summary(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    summary = generate_summary_from_notes(text)
    return {"summary": summary}

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    text = extract_text_from_pdf(file.file)
    doc_id = store_document(text)
    return {"doc_id": doc_id}

@router.post("/chat")
async def chat(request: ChatRequest):
    context = query_document(request.doc_id, request.question)
    history = [{"role": m.role, "text": m.text} for m in request.history]
    reply = chat_with_context(request.question, context, history)
    return {"reply": reply}

@router.delete("/document/{doc_id}")
async def remove_document(doc_id: str):
    delete_document(doc_id)
    return {"status": "deleted"}