export default function MCQCard({ question, index, selected, onSelect, submitted }) {
  const options = ["A", "B", "C", "D"];

  const getOptionStyle = (opt) => {
    if (!submitted) {
      return selected === opt
        ? { backgroundColor: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }
        : { backgroundColor: "var(--bg-subtle)", color: "var(--text-primary)", borderColor: "var(--border)" };
    }
    if (opt === question.answer) {
      return { backgroundColor: "#dcfce7", color: "#166534", borderColor: "#86efac" };
    }
    if (selected === opt && opt !== question.answer) {
      return { backgroundColor: "#fee2e2", color: "#991b1b", borderColor: "#fca5a5" };
    }
    return { backgroundColor: "var(--bg-subtle)", color: "var(--text-muted)", borderColor: "var(--border)" };
  };

  return (
    <div
      className="rounded-2xl border p-6 animate-fade-up"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <div className="flex items-start gap-3 mb-5">
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 mt-0.5"
          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
        >
          Q{index + 1}
        </span>
        <p className="font-medium text-base leading-relaxed" style={{ color: "var(--text-primary)" }}>
          {question.question}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt) => (
          <button
            key={opt}
            disabled={submitted}
            onClick={() => onSelect(opt)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-medium transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-default"
            style={getOptionStyle(opt)}
          >
            <span className="font-bold shrink-0">{opt}.</span>
            <span>{question.options[opt]}</span>
          </button>
        ))}
      </div>

      {submitted && question.explanation && (
        <div
          className="mt-4 p-3.5 rounded-xl text-sm leading-relaxed"
          style={{ backgroundColor: "var(--accent-light)", color: "var(--accent)" }}
        >
          💡 {question.explanation}
        </div>
      )}
    </div>
  );
}