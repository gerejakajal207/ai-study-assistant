from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
from app.routes import auth, topic, notes, chat

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Study Assistant API")

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(topic.router)
app.include_router(notes.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return { "message": "AI Study Assistant API is running" }