import chromadb
from app.core.config import settings
import uuid

client = chromadb.Client()

def store_document(text: str) -> str:
    doc_id = str(uuid.uuid4())
    collection = client.create_collection(name=doc_id)
    chunks = chunk_text(text)
    collection.add(
        documents=chunks,
        ids=[f"{doc_id}_{i}" for i in range(len(chunks))]
    )
    return doc_id

def query_document(doc_id: str, question: str, n_results: int = 3) -> str:
    try:
        collection = client.get_collection(name=doc_id)
        results = collection.query(
            query_texts=[question],
            n_results=n_results
        )
        chunks = results["documents"][0]
        return "\n\n".join(chunks)
    except Exception:
        raise ValueError("Document not found. Please upload your PDF again.")

def delete_document(doc_id: str):
    try:
        client.delete_collection(name=doc_id)
    except Exception:
        pass

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks