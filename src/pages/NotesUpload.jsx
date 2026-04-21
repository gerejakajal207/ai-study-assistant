import { useState, useRef } from "react";
import MCQCard from "../components/MCQCard";
import FlashCard from "../components/Flashcard";
import QuizResult from "../components/QuizResult";
import { generateMCQsFromNotes, generateFlashcardsFromNotes, generateSummaryFromNotes } from "../services/api";

const MODES = ["MCQ", "Flashcard", "Summary"];
const STEPS = { UPLOAD: "upload", LOADING: "loading", RESULTS: "results" };

export default function NotesUpload() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [mode, setMode] = useState("MCQ");
  const [files, setFiles] = useState([]); // ← array now
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [cards, setCards] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [summary, setSummary] = useState("");

  const addFiles = (incoming) => {
    const pdfs = Array.from(incoming).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );
    if (pdfs.length === 0) { setError("Only PDF files are supported."); return; }
    if (pdfs.some((f) => f.size > 10 * 1024 * 1024)) { setError("Each file must be under 10MB."); return; }
    setError("");
    setFiles((prev) => [...prev, ...pdfs].slice(0, 5)); // max 5
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    setStep(STEPS.LOADING);
    setError("");
    try {
      if (mode === "MCQ") {
        const data = await generateMCQsFromNotes(files);
        setQuestions(data);
      } else if (mode === "Flashcard") {
        const data = await generateFlashcardsFromNotes(files);
        setCards(data);
      } else {
        const data = await generateSummaryFromNotes(files);
        setSummary(data);
      }
      setStep(STEPS.RESULTS);
    } catch {
      setError("Something went wrong. Please try again.");
      setStep(STEPS.UPLOAD);
    }
  };

  const handleReset = () => {
    setStep(STEPS.UPLOAD);
    setFiles([]);
    setQuestions([]);
    setCards([]);
    setSummary("");
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
    setCardIndex(0);
    setError("");
  };

  const score = questions.filter((q, i) => answers[i] === q.answer).length;
  const fileLabel = files.length === 0 ? "" : files.length === 1 ? files[0].name : `${files.length} PDFs`;

  // ── Upload Step ──
  if (step === STEPS.UPLOAD) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10 animate-fade-up">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Notes Upload
          </h1>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Upload your PDF notes and generate study material instantly.
          </p>
        </div>

        <div
          className="rounded-2xl border p-8 animate-fade-up-delay-1"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
        >
          {/* Mode Toggle */}
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            What do you want to generate?
          </p>
          <div className="flex gap-1 p-1 rounded-xl mb-8 w-fit" style={{ backgroundColor: "var(--bg-subtle)" }}>
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  mode === m
                    ? { backgroundColor: "var(--accent)", color: "#fff" }
                    : { backgroundColor: "transparent", color: "var(--text-secondary)" }
                }
              >
                {m === "MCQ" ? "📝 MCQ Quiz" : m === "Flashcard" ? "🃏 Flashcards" : "📋 Summary"}
              </button>
            ))}
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => files.length < 5 && fileInputRef.current.click()}
            className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all mb-4"
            style={{
              borderColor: dragging ? "var(--accent)" : files.length > 0 ? "var(--accent)" : "var(--border)",
              backgroundColor: dragging ? "var(--accent-light)" : files.length > 0 ? "var(--accent-light)" : "var(--bg-subtle)",
              cursor: files.length >= 5 ? "not-allowed" : "pointer",
              opacity: files.length >= 5 ? 0.7 : 1,
            }}
          >
            <input
              type="file"
              accept=".pdf"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: "var(--bg-card)" }}>☁️</div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                  {files.length >= 5 ? "Max 5 PDFs reached" : "Drag & drop PDFs here"}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  or click to browse — PDF only, max 10MB each, up to 5 files
                </p>
              </div>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ backgroundColor: "var(--bg-subtle)" }}
                >
                  <span className="text-base shrink-0">📄</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                      {file.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
                    className="text-xs shrink-0 transition-colors"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="mt-1 mb-3 text-sm" style={{ color: "#ef4444" }}>{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={files.length === 0}
            className="w-full mt-2 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Generate {mode === "MCQ" ? "MCQ Quiz" : mode === "Flashcard" ? "Flashcards" : "Summary"} →
          </button>
        </div>
      </main>
    );
  }

  // ── Loading Step ──
  if (step === STEPS.LOADING) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-14 h-14 rounded-full border-4 animate-spin"
          style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} />
        <div className="text-center">
          <p className="font-display text-xl font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
            Analysing your notes...
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Groq AI is reading <strong style={{ color: "var(--text-secondary)" }}>{fileLabel}</strong> and generating your{" "}
            {mode === "MCQ" ? "quiz" : mode === "Flashcard" ? "flashcards" : "summary"}.
          </p>
        </div>
      </main>
    );
  }

  // ── Results Step ──
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10 animate-fade-up">
        <div>
          <h1 className="font-display text-4xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            {mode === "MCQ" ? "Your Quiz" : mode === "Flashcard" ? "Your Flashcards" : "Summary"}
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Generated from <span className="font-medium">{fileLabel}</span>
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 rounded-xl border text-sm font-semibold transition-all hover:scale-105"
          style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-card)" }}
        >
          ← Upload New
        </button>
      </div>

      {/* MCQ Results */}
      {mode === "MCQ" && !showResult && (
        <div className="flex flex-col gap-5">
          {questions.map((q, i) => (
            <MCQCard
              key={i}
              question={q}
              index={i}
              selected={answers[i]}
              onSelect={(opt) => !submitted && setAnswers((a) => ({ ...a, [i]: opt }))}
              submitted={submitted}
            />
          ))}
          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              disabled={Object.keys(answers).length < questions.length}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Submit Quiz ({Object.keys(answers).length}/{questions.length} answered)
            </button>
          ) : (
            <button
              onClick={() => setShowResult(true)}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.01]"
              style={{ backgroundColor: "var(--accent)" }}
            >
              See Results →
            </button>
          )}
        </div>
      )}

      {mode === "MCQ" && showResult && (
        <QuizResult
          score={score}
          total={questions.length}
          onRetry={() => { setAnswers({}); setSubmitted(false); setShowResult(false); }}
          onNewTopic={handleReset}
        />
      )}

      {mode === "Flashcard" && cards.length > 0 && (
        <div className="flex flex-col items-center gap-6">
          <FlashCard card={cards[cardIndex]} index={cardIndex} total={cards.length} />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
              disabled={cardIndex === 0}
              className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105 disabled:opacity-30"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-card)" }}
            >
              ← Prev
            </button>
            <div className="flex gap-1.5">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCardIndex(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: i === cardIndex ? "var(--accent)" : "var(--border)",
                    transform: i === cardIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setCardIndex((i) => Math.min(cards.length - 1, i + 1))}
              disabled={cardIndex === cards.length - 1}
              className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105 disabled:opacity-30"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", backgroundColor: "var(--bg-card)" }}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {mode === "Summary" && summary && (
        <div
          className="rounded-2xl border p-6 animate-fade-up"
          style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}>
              📋
            </span>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Summary</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{fileLabel}</p>
            </div>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
            {summary}
          </div>
        </div>
      )}
    </main>
  );
}