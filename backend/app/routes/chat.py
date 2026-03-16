from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from app.services.gemini import chat_with_context
from app.services.pdf_parser import extract_text_from_pdf
from app.services.rag import store_document, query_document, delete_document
from app.core.auth import get_current_user
from app.models.user import User
import io
import json

router = APIRouter(prefix="/chat", tags=["chat"])

# ── Upload PDF and store in ChromaDB ────────────────────────
@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    try:
        contents = await file.read()
        pdf_file = io.BytesIO(contents)
        text = extract_text_from_pdf(pdf_file)
        doc_id = store_document(text)
        return { "doc_id": doc_id }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to process PDF")

# ── Ask a question ───────────────────────────────────────────
@router.post("/ask")
async def ask_question(
    doc_id: str = Form(...),
    question: str = Form(...),
    history: str = Form(default="[]"),
    current_user: User = Depends(get_current_user)
):
    try:
        parsed_history = json.loads(history)
        context = query_document(doc_id, question)
        answer = chat_with_context(question, context, parsed_history)
        return { "answer": answer }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate answer")

# ── Delete document from ChromaDB ───────────────────────────
@router.delete("/document/{doc_id}")
def remove_document(
    doc_id: str,
    current_user: User = Depends(get_current_user)
):
    delete_document(doc_id)
    return { "message": "Document removed successfully" }