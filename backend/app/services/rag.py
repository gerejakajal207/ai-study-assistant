import chromadb
from chromadb.utils import embedding_functions
import google.generativeai as genai
from app.core.config import settings
import uuid

genai.configure(api_key=settings.GEMINI_API_KEY)

# ── ChromaDB Setup ───────────────────────────────────────────
client = chromadb.Client()

embedding_fn = embedding_functions.GoogleGenerativeAiEmbeddingFunction(
    api_key=settings.GEMINI_API_KEY
)

# ── Store PDF text in ChromaDB ───────────────────────────────
def store_document(text: str) -> str:
    doc_id = str(uuid.uuid4())
    collection = client.create_collection(
        name=doc_id,
        embedding_function=embedding_fn
    )

    # Split text into chunks
    chunks = chunk_text(text)

    collection.add(
        documents=chunks,
        ids=[f"{doc_id}_{i}" for i in range(len(chunks))]
    )

    return doc_id

# ── Query ChromaDB for relevant chunks ──────────────────────
def query_document(doc_id: str, question: str, n_results: int = 3) -> str:
    try:
        collection = client.get_collection(
            name=doc_id,
            embedding_function=embedding_fn
        )
        results = collection.query(
            query_texts=[question],
            n_results=n_results
        )
        chunks = results["documents"][0]
        return "\n\n".join(chunks)
    except Exception:
        raise ValueError("Document not found. Please upload your PDF again.")

# ── Delete document from ChromaDB ───────────────────────────
def delete_document(doc_id: str):
    try:
        client.delete_collection(name=doc_id)
    except Exception:
        pass

# ── Helper: Split text into chunks ──────────────────────────
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks