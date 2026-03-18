"use client";

// ═══════════════════════════════════════════════════════
// StarRating — переиспользуемый компонент отображения звёзд
// src/components/StarRating/StarRating.jsx
// ═══════════════════════════════════════════════════════

import "./StarRating.scss";

export default function StarRating({ value, max = 5, size = 16 }) {
  return (
    <div className="star-rating" style={{ "--star-size": `${size}px` }}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`star-rating__star ${i < Math.round(value) ? "star-rating__star--filled" : "star-rating__star--empty"}`}
        >
          ★
        </span>
      ))}
      {value > 0 && (
        <span className="star-rating__value">{Number(value).toFixed(1)}</span>
      )}
    </div>
  );
}
