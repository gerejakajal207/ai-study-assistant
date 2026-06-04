import google.generativeai as genai
from app.core.config import settings
import json
import re
from groq import Groq

client = Groq(api_key=settings.GROQ_API_KEY)

def truncate_text(text: str, max_words: int = 1500) -> str:
    words = text.split()
    if len(words) > max_words:
        return " ".join(words[:max_words]) + "...[truncated]"
    return text

def extract_json(text: str):
    text = re.sub(r"```json|```", "", text).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'[\[{].*[\]}]', text, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass
        raise ValueError(f"Could not parse JSON from response: {text[:200]}")

def call_gemini(prompt: str) -> str:  # keeping name so nothing else breaks
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=8192,
    )
    return response.choices[0].message.content

# ── Topic-based generation ──────────────────────────────────────────────────

def validate_topic(topic: str) -> dict:
    prompt = f"""
    A user wants to study about: "{topic}"

    Analyze this topic and respond ONLY with a JSON object in one of these formats:

    1. If the topic is meaningless, gibberish, or too vague to study (like "123", "asdf", "xyz"):
    {{"status": "invalid", "message": "That doesn't seem like a valid study topic. Could you enter something like 'Photosynthesis', 'World War 2', or 'Python programming'?"}}

    2. If the topic is ambiguous and could belong to multiple very different fields (like "focus", "wave", "force", "cell"):
    {{"status": "ambiguous", "message": "brief friendly message asking to clarify", "options": ["Field 1: specific meaning", "Field 2: specific meaning", "Field 3: specific meaning"]}}

    3. If the topic is clear and specific enough to generate study material:
    {{"status": "valid", "message": ""}}

    Return ONLY the JSON object, no extra text.
    """
    return extract_json(call_gemini(prompt))

def generate_mcqs(topic: str, difficulty: str = "Medium") -> list:
    difficulty_guidance = {
        "Easy": "straightforward, basic recall questions suitable for beginners",
        "Medium": "moderately challenging questions requiring understanding of concepts",
        "Hard": "difficult, application-based questions requiring deep understanding and analysis",
    }
    guidance = difficulty_guidance.get(difficulty, difficulty_guidance["Medium"])

    prompt = f"""
    Generate exactly 10 multiple choice questions about "{topic}".
    Difficulty level: {difficulty} — {guidance}.
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
    return extract_json(call_gemini(prompt))

def generate_flashcards(topic: str, difficulty: str = "Medium") -> list:
    difficulty_guidance = {
        "Easy": "basic definitions and simple concepts",
        "Medium": "concepts, relationships and applications",
        "Hard": "complex analysis, edge cases and deep understanding",
    }
    guidance = difficulty_guidance.get(difficulty, difficulty_guidance["Medium"])

    prompt = f"""
    Generate exactly 10 flashcards about "{topic}".
    Difficulty level: {difficulty} — focus on {guidance}.
    Keep each "back" answer concise — maximum 2 sentences.
    Return ONLY a JSON array with no extra text, in this exact format:
    [
        {{
            "front": "question or concept",
            "back": "brief answer, max 2 sentences"
        }}
    ]
    """
    return extract_json(call_gemini(prompt))

def generate_summary(topic: str) -> str:
    prompt = f"""
    Write a clear, well-structured study summary about "{topic}".
    The summary should:
    - Start with a brief overview (2-3 sentences)
    - Cover the key concepts and important points
    - Use simple, easy-to-understand language
    - Be organized into short paragraphs
    - Be comprehensive enough for exam revision
    - Be approximately 300-400 words

    Return ONLY the summary text. No JSON, no extra formatting, no preamble.
    """
    return call_gemini(prompt).strip()

# ── Notes-based generation ──────────────────────────────────────────────────

def generate_mcqs_from_notes(text: str) -> list:
    text = truncate_text(text)
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
    return extract_json(call_gemini(prompt))

def generate_flashcards_from_notes(text: str) -> list:
    text = truncate_text(text)
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
    return extract_json(call_gemini(prompt))

def generate_summary_from_notes(text: str) -> str:
    text = truncate_text(text)
    prompt = f"""
    Based on the following study notes, write a clear and concise summary.
    The summary should:
    - Capture all the key points from the notes
    - Be organized into short, readable paragraphs
    - Highlight the most important concepts
    - Be easy to review before an exam
    - Be approximately 300-400 words

    Return ONLY the summary text. No JSON, no extra formatting, no preamble.

    Study notes:
    {text}
    """
    return call_gemini(prompt).strip()

# ── Chat ────────────────────────────────────────────────────────────────────

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
    return call_gemini(prompt)

