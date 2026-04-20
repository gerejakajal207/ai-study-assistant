export default function MCQCard({ question, index, selected, onSelect, submitted }) {
  const isCorrect = selected === question.answer;

  const optionStyle = (key) => {
    if (!submitted) {
      return selected === key
        ? { backgroundColor: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }
        : { backgroundColor: "var(--bg-subtle)", color: "var(--text-primary)", borderColor: "var(--border)" };
    }
    if (key === question.answer) {
      return { backgroundColor: "#dcfce7", color: "#15803d", borderColor: "#86efac" };
    }
    if (key === selected && selected !== question.answer) {
      return { backgroundColor: "#fee2e2", color: "#b91c1c", borderColor: "#fca5a5" };
    }
    return { backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)", borderColor: "var(--border)" };
  };

  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: submitted
          ? isCorrect
            ? "#86efac"
            : "#fca5a5"
          : "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Question */}
      <div className="flex items-start gap-3 mb-5">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 mt-0.5"
          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
        >
          Q{index + 1}
        </span>
        <p className="text-sm font-medium leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-2.5 mb-4">
        {Object.entries(question.options).map(([key, value]) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            disabled={submitted}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-default disabled:hover:scale-100"
            style={optionStyle(key)}
          >
            <span className="font-bold shrink-0 w-5">{key}.</span>
            <span>{value}</span>
            {submitted && key === question.answer && (
              <span className="ml-auto text-base">✓</span>
            )}
            {submitted && key === selected && selected !== question.answer && (
              <span className="ml-auto text-base">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Explanation — shown after submission */}
      {submitted && question.explanation && (
        <div
          className="mt-3 px-4 py-3 rounded-xl text-sm leading-relaxed"
          style={{
            backgroundColor: isCorrect ? "#f0fdf4" : "#fef2f2",
            color: isCorrect ? "#15803d" : "#b91c1c",
            borderLeft: `3px solid ${isCorrect ? "#86efac" : "#fca5a5"}`,
          }}
        >
          <span className="font-semibold mr-1">{isCorrect ? "✓ Correct!" : "✗ Incorrect."}</span>
          {question.explanation}
        </div>
      )}
    </div>
  );
}