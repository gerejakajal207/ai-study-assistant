const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Auth ────────────────────────────────────────────────────────────────────

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Login failed");
  localStorage.setItem("token", data.access_token);
  return data;
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Registration failed");
  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Topic Practice ──────────────────────────────────────────────────────────

export async function generateMCQs(
  topic,
  difficulty = "Medium",
  confirmed = false,
) {
  const res = await fetch(`${BASE_URL}/topic/mcqs`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ topic, difficulty, confirmed }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to generate MCQs");
  return data; // return full object, not just data.questions
}
export async function generateFlashcards(
  topic,
  difficulty = "Medium",
  confirmed = false,
) {
  const res = await fetch(`${BASE_URL}/topic/flashcards`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ topic, difficulty, confirmed }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to generate flashcards");
  return data;
}

export async function generateSummary(topic) {
  const res = await fetch(`${BASE_URL}/topic/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ topic }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to generate summary");
  return data.summary;
}

// ── Notes Upload ────────────────────────────────────────────────────────────

export async function generateMCQsFromNotes(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/notes/upload-mcqs`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.detail || "Failed to generate MCQs from notes");
  return data.questions;
}

export async function generateFlashcardsFromNotes(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/notes/upload-flashcards`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.detail || "Failed to generate flashcards from notes");
  return data.cards;
}

export async function generateSummaryFromNotes(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/notes/upload-summary`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.detail || "Failed to generate summary from notes");
  return data.summary;
}

// ── Chat with Notes ─────────────────────────────────────────────────────────

export async function uploadPDF(file) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/notes/upload-pdf`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to upload PDF");
  return data;
}

export async function chatWithNotes(docId, question, history) {
  const res = await fetch(`${BASE_URL}/notes/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ doc_id: docId, question, history }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Failed to get response");
  return data.reply;
}

export async function deleteDocument(docId) {
  await fetch(`${BASE_URL}/notes/document/${docId}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
}

export function getToken() {
  return localStorage.getItem("token");
}
