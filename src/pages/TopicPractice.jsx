import { useState } from "react";
import MCQCard from "../components/MCQCard";
import FlashCard from "../components/Flashcard";
import QuizResult from "../components/QuizResult";
import { generateMCQs, generateFlashcards } from "../services/api";

const MODES = ["MCQ", "Flashcard"];

export default function TopicPractice() {
  const [topic, setTopic] = useState("");
  const [mode, setMode] = useState("MCQ");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState(null);

  // MCQ state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Flashcard state
  const [cards, setCards] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);

  const isReady = topic.trim().length > 2;

  const handleGenerate = async (confirmed = false) => {
    if (!isReady) return;
    setLoading(true);
    setError("");
    setValidation(null);
    setQuestions([]);
    setCards([]);
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
    setCardIndex(0);

    try {
      if (mode === "MCQ") {
        const data = await generateMCQs(topic, "Medium", confirmed);
        if (data.validation) {
          setValidation(data.validation);
        } else {
          setQuestions(data.questions);
        }
      } else {
        const data = await generateFlashcards(topic, "Medium", confirmed);
        if (data.validation) {
          setValidation(data.validation);
        } else {
          setCards(data.cards);
        }
      }
    } catch (err) {
      console.log(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
  };

  const handleNewTopic = () => {
    setTopic("");
    setQuestions([]);
    setCards([]);
    setAnswers({});
    setSubmitted(false);
    setShowResult(false);
    setCardIndex(0);
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10 animate-fade-up">
        <h1
          className="font-display text-4xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}>
          Topic Practice
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          Enter any topic and choose your study mode.
        </p>
      </div>

      {/* Input Section */}
      {!showResult && (
        <div
          className="rounded-2xl border p-6 mb-8 animate-fade-up-delay-1"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
            boxShadow: "var(--shadow)",
          }}>
          {/* Mode Toggle */}
          <div
            className="flex gap-1 p-1 rounded-xl mb-5 w-fit"
            style={{ backgroundColor: "var(--bg-subtle)" }}>
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={
                  mode === m
                    ? { backgroundColor: "var(--accent)", color: "#fff" }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--text-secondary)",
                      }
                }>
                {m === "MCQ" ? "📝 MCQ" : "🃏 Flashcard"}
              </button>
            ))}
          </div>

          {/* Topic Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. Photosynthesis, French Revolution, Binary Trees..."
              className="flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
            <button
              onClick={() => handleGenerate()}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              disabled={!isReady || loading}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              style={{ backgroundColor: "var(--accent)" }}>
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
        </div>
      )}

      {/* Validation UI */}
      {validation && !loading && (
        <div
          className="rounded-2xl border p-6 mb-6 animate-fade-up"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor:
              validation.status === "invalid" ? "#fca5a5" : "var(--border)",
            boxShadow: "var(--shadow)",
          }}>
          <p
            className="text-sm font-medium mb-4"
            style={{ color: "var(--text-primary)" }}>
            {validation.message}
          </p>

          {/* Ambiguous — show options to pick from */}
          {validation.status === "ambiguous" && validation.options && (
            <div className="flex flex-col gap-2">
              {validation.options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    const specificTopic =
                      option.split(":")[1]?.trim() || option;
                    setTopic(specificTopic);
                    setValidation(null);
                    handleGenerate(true);
                  }}
                  className="px-4 py-2.5 rounded-xl border text-sm font-medium text-left transition-all hover:scale-[1.01]"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-subtle)",
                    color: "var(--text-primary)",
                  }}>
                  {option}
                </button>
              ))}
              <button
                onClick={() => setValidation(null)}
                className="text-xs mt-1 font-medium"
                style={{ color: "var(--text-muted)" }}>
                Cancel
              </button>
            </div>
          )}

          {/* Invalid — just dismiss */}
          {validation.status === "invalid" && (
            <button
              onClick={() => setValidation(null)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--accent)" }}>
              Try a different topic
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-16 animate-fade-up">
          <div
            className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "var(--border)",
              borderTopColor: "var(--accent)",
            }}
          />
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Generating {mode === "MCQ" ? "questions" : "flashcards"} for{" "}
            <strong style={{ color: "var(--text-primary)" }}>{topic}</strong>...
          </p>
        </div>
      )}

      {/* MCQ Results */}
      {!loading && questions.length > 0 && !showResult && (
        <div className="flex flex-col gap-5">
          {questions.map((q, i) => (
            <MCQCard
              key={i}
              question={q}
              index={i}
              selected={answers[i]}
              onSelect={(opt) =>
                !submitted && setAnswers((a) => ({ ...a, [i]: opt }))
              }
              submitted={submitted}
            />
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--accent)" }}>
              Submit Quiz ({Object.keys(answers).length}/{questions.length}{" "}
              answered)
            </button>
          )}

          {submitted && (
            <button
              onClick={() => setShowResult(true)}
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.01]"
              style={{ backgroundColor: "var(--accent)" }}>
              See Results →
            </button>
          )}
        </div>
      )}

      {/* Flashcard Results */}
      {!loading && cards.length > 0 && (
        <div className="flex flex-col items-center gap-6">
          <FlashCard
            card={cards[cardIndex]}
            index={cardIndex}
            total={cards.length}
          />

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
              disabled={cardIndex === 0}
              className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-card)",
              }}>
              ← Prev
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCardIndex(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      i === cardIndex ? "var(--accent)" : "var(--border)",
                    transform: i === cardIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setCardIndex((i) => Math.min(cards.length - 1, i + 1))
              }
              disabled={cardIndex === cards.length - 1}
              className="px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-secondary)",
                backgroundColor: "var(--bg-card)",
              }}>
              Next →
            </button>
          </div>

          <button
            onClick={handleNewTopic}
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--text-muted)" }}>
            Try a different topic
          </button>
        </div>
      )}

      {/* Quiz Result */}
      {showResult && (
        <QuizResult
          score={score}
          total={questions.length}
          onRetry={handleRetry}
          onNewTopic={handleNewTopic}
        />
      )}
    </main>
  );
}
