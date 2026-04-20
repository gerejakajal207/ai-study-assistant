import { Link } from "react-router-dom";

export default function Home() {
  const features = [
    {
      icon: "🎯",
      title: "Topic Practice",
      description: "Enter any topic and get MCQs or Flashcards instantly.",
      path: "/topic-practice",
      label: "Start Practicing",
      disabled: false,
    },
    {
      icon: "📄",
      title: "Notes Upload",
      description: "Upload your PDF notes and generate quizzes from your own content.",
      path: "/notes-upload",
      label: "Try Now",
      disabled: false,
    },
    {
      icon: "💬",
      title: "Chat with Notes",
      description: "Ask questions and get answers directly from your uploaded notes.",
      path: "/chat",
      label: "Try Now",
      disabled: false,
    },
  ];

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="text-center mb-16 animate-fade-up">
        <div
          className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
          style={{
            backgroundColor: "var(--accent-light)",
            color: "var(--accent)",
          }}
        >
          AI-Powered Learning
        </div>
        <h1
          className="font-display text-5xl md:text-6xl font-bold leading-tight mb-5"
          style={{ color: "var(--text-primary)" }}
        >
          Study smarter,
          <br />
          not harder.
        </h1>
        <p
          className="text-lg max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Generate MCQs, flashcards, and quizzes from any topic or your own
          notes, powered by Gemini AI.
        </p>
        <Link
          to="/topic-practice"
          className="inline-block mt-8 px-8 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Get Started →
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`rounded-2xl p-6 border animate-fade-up-delay-${i + 1}`}
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3
              className="font-display text-xl font-semibold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {f.title}
            </h3>
            <p
              className="text-sm leading-relaxed mb-5"
              style={{ color: "var(--text-secondary)" }}
            >
              {f.description}
            </p>
            <Link
              to={f.path}
              className="text-sm font-semibold transition-colors"
              style={{ color: "var(--accent)" }}
            >
              {f.label} →
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}