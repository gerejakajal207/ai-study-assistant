import { useState } from "react";

export default function FlashCard({ card, index, total }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
        Card {index + 1} of {total}
      </p>

      {/* Card */}
      <div
        className="flashcard-scene w-full max-w-xl cursor-pointer"
        style={{ height: "260px" }}
        onClick={() => setFlipped(f => !f)}
      >
        <div className={`flashcard-inner ${flipped ? "flipped" : ""}`}>
          {/* Front */}
          <div
            className="flashcard-front border"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="text-center">
              <span
                className="text-xs font-bold tracking-widest uppercase block mb-3"
                style={{ color: "var(--text-muted)" }}
              >
                Question
              </span>
              <p
                className="font-display text-xl font-semibold leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {card.front}
              </p>
              <p className="text-xs mt-5" style={{ color: "var(--text-muted)" }}>
                Tap to reveal answer
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className="flashcard-back border"
            style={{
              backgroundColor: "var(--accent)",
              borderColor: "var(--accent)",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="text-center">
              <span className="text-xs font-bold tracking-widest uppercase block mb-3 text-white opacity-70">
                Answer
              </span>
              <p className="font-display text-xl font-semibold leading-relaxed text-white">
                {card.back}
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Click the card to flip
      </p>
    </div>
  );
}