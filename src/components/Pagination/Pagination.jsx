"use client";

import "./Pagination.scss";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPages = () => {
    if (totalPages <= 8) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const delta = 2;

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) pages.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        ←
      </button>

      {getPages().map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="pagination__dots">
            ...
          </span>
        ) : (
          <button
            key={p}
            className={`pagination__btn ${p === currentPage ? "pagination__btn--active" : ""}`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ),
      )}

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
