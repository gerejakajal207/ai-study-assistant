import google.generativeai as genai
from app.core.config import settings
import json
import re

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# ── Helper to clean JSON response ───────────────────────────
def extract_json(text: str):
    text = re.sub(r"```json|```", "", text).strip()
    return json.loads(text)

# ── MCQ Generation ───────────────────────────────────────────
def generate_mcqs(topic: str) -> list:
    prompt = f"""
    Generate exactly 10 multiple choice questions about "{topic}".
    Return ONLY a JSON array with no extra text, in this exact format:
    [
        {{
            "question": "question text here",
            "options": {{
                "A": "option a",
                "B": "option b",
                "C": "option c",
                "D": "option d"
            }},
            "answer": "A",
            "explanation": "brief explanation why this is correct"
        }}
    ]
    """
    response = model.generate_content(prompt)
    return extract_json(response.text)

# ── Flashcard Generation ─────────────────────────────────────
def generate_flashcards(topic: str) -> list:
    prompt = f"""
    Generate exactly 10 flashcards about "{topic}".
    Return ONLY a JSON array with no extra text, in this exact format:
    [
        {{
            "front": "question or concept",
            "back": "answer or explanation"
        }}
    ]
    """
    response = model.generate_content(prompt)
    return extract_json(response.text)

# ── MCQ from Notes ───────────────────────────────────────────
def generate_mcqs_from_notes(text: str) -> list:
    prompt = f"""
    Based on the following study notes, generate exactly 10 multiple choice questions.
    Return ONLY a JSON array with no extra text, in this exact format:
    [
        {{
            "question": "question text here",
            "options": {{
                "A": "option a",
                "B": "option b",
                "C": "option c",
                "D": "option d"
            }},
            "answer": "A",
            "explanation": "brief explanation why this is correct"
        }}
    ]

    Study notes:
    {text}
    """
    response = model.generate_content(prompt)
    return extract_json(response.text)

# ── Flashcards from Notes ────────────────────────────────────
def generate_flashcards_from_notes(text: str) -> list:
    prompt = f"""
    Based on the following study notes, generate exactly 10 flashcards.
    Return ONLY a JSON array with no extra text, in this exact format:
    [
        {{
            "front": "question or concept",
            "back": "answer or explanation"
        }}
    ]

    Study notes:
    {text}
    """
    response = model.generate_content(prompt)
    return extract_json(response.text)

# ── Chat with Notes ──────────────────────────────────────────
def chat_with_context(question: str, context: str, history: list) -> str:
    history_text = ""
    for msg in history:
        role = "User" if msg["role"] == "user" else "Assistant"
        history_text += f"{role}: {msg['text']}\n"

    prompt = f"""
    You are a helpful study assistant. Answer the user's question based ONLY on the provided study notes.
    If the answer is not in the notes, say "I couldn't find that in your notes."

    Study notes:
    {context}

    Conversation history:
    {history_text}

    User: {question}
    Assistant:
    """
    response = model.generate_content(prompt)
    return response.text.strip()