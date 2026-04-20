import { useState, useEffect } from "react";

export default function FlashCard({ card, index, total }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => {
    setFlipped(false);
  }, [card]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Progress bar */}
      <div className="w-full flex items-center gap-3">
        <span
          className="text-xs font-medium shrink-0"
          style={{ color: "var(--text-muted)" }}>
          {index + 1} / {total}
        </span>
        <div
          className="flex-1 h-1 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((index + 1) / total) * 100}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className="flashcard-scene w-full cursor-pointer"
        style={{ height: "280px" }}
        onClick={() => setFlipped((f) => !f)}>
        <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div
            className="flashcard-front border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}>
            <div className="flex flex-col items-center justify-between h-full w-full px-10 py-8">
              {/* Top label */}
              <div className="flex items-center gap-2 self-start">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: "var(--accent)" }}
                />
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "var(--accent)" }}>
                  Question
                </span>
              </div>

              {/* Question text */}
              <p
                className="font-display text-2xl font-semibold leading-snug text-center"
                style={{ color: "var(--text-primary)" }}>
                {card.front}
              </p>

              {/* Bottom hint */}
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--text-muted)" }}>
                <span>flip to reveal</span>
                <span>→</span>
              </div>
            </div>
          </div>

          {/* Back */}
          <div
            className="flashcard-back"
            style={{
              backgroundColor: "var(--accent)",
              boxShadow: "var(--shadow-lg)",
            }}>
            <div className="flex flex-col items-center justify-between h-full w-full px-10 py-8">
              {/* Top label */}
              <div className="flex items-center gap-2 self-start">
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
                <span className="text-xs font-bold tracking-widest uppercase text-white opacity-60">
                  Answer
                </span>
              </div>

              {/* Answer text */}
              <p className="font-display text-2xl font-semibold leading-snug text-center text-white">
                {card.back}
              </p>

              {/* Bottom hint */}
              <div className="flex items-center gap-1.5 text-xs text-white opacity-50">
                <span>← flip back</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
