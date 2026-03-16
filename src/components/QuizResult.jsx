export default function QuizResult({ score, total, onRetry, onNewTopic }) {
  const percent = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percent >= 80) return { text: "Excellent work! 🎉", color: "#166534" };
    if (percent >= 60) return { text: "Good effort! 👍", color: "#92400e" };
    return { text: "Keep practicing! 💪", color: "#991b1b" };
  };

  const msg = getMessage();

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;

  return (
    <div
      className="rounded-2xl border p-10 text-center max-w-sm mx-auto animate-fade-up"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      {/* Circle Progress */}
      <div className="flex justify-center mb-6">
        <svg width="140" height="140" className="-rotate-90">
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="10"
          />
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute mt-10 flex flex-col items-center justify-center" style={{ marginTop: "42px" }}>
          <span className="font-display text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            {percent}%
          </span>
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {score}/{total}
          </span>
        </div>
      </div>

      <p className="font-display text-2xl font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
        Quiz Complete
      </p>
      <p className="text-sm font-medium mb-8" style={{ color: msg.color }}>
        {msg.text}
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={onRetry}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 active:scale-95"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Try Again
        </button>
        <button
          onClick={onNewTopic}
          className="w-full py-3 rounded-xl font-semibold border transition-all hover:scale-105 active:scale-95"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
            backgroundColor: "var(--bg-subtle)",
          }}
        >
          New Topic
        </button>
      </div>
    </div>
  );
}