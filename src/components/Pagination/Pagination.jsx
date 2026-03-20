"use client";

// ═══════════════════════════════════════════════════════
// Pagination — переиспользуемый компонент пагинации
// src/components/Pagination/Pagination.jsx
// ═══════════════════════════════════════════════════════

import "./Pagination.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ←
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`pagination__btn ${p === currentPage ? "pagination__btn--active" : ""}`}
          onClick={() => onPageChange(p)}
        >
          {p}
        </button>
      ))}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
