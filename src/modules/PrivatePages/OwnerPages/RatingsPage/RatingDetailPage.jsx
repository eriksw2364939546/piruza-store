"use client";

// ═══════════════════════════════════════════════════════
// RatingDetailPage — детали рейтинга продавца
// /admins-piruza/owner/ratings/[slug]
// ═══════════════════════════════════════════════════════

import { useCallback, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, Star, Users, Eye, Search } from "lucide-react";
import "./RatingsPage.scss";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Полоса распределения ──────────────────────────────

function DistributionBar({ star, count, total }) {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="rating-dist__row">
      <span className="rating-dist__label">
        <Star size={12} className="rating-dist__star" /> {star}
      </span>
      <div className="rating-dist__bar-wrap">
        <div className="rating-dist__bar" style={{ width: `${percent}%` }} />
      </div>
      <span className="rating-dist__count">{count}</span>
      <span className="rating-dist__percent">{percent}%</span>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────

export default function RatingDetailPage({
  seller,
  stats,
  ratings = [],
  pagination,
  ratingFilter,
  initialQuery = "",
  basePath,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef(null);

  const [queryInput, setQueryInput] = useState(initialQuery);

  const pushUrl = useCallback(
    (rating, query) => {
      const params = new URLSearchParams();
      if (rating) params.set("rating", rating);
      if (query) params.set("query", query);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`);
    },
    [router, pathname],
  );

  const handleRatingFilter = useCallback(
    (value) => {
      const newVal = ratingFilter === String(value) ? "" : String(value);
      pushUrl(newVal, queryInput);
    },
    [pushUrl, ratingFilter, queryInput],
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushUrl(ratingFilter, val);
    }, 400);
  };

  const avg = stats?.averageRating ?? seller.averageRating ?? 0;
  const total = stats?.totalRatings ?? seller.totalRatings ?? 0;
  const dist = stats?.distribution ?? {};

  return (
    <div className="rating-detail">
      {/* ── Навигация ── */}
      <div className="rating-detail__nav">
        <Link href={basePath} className="rating-detail__back">
          <ArrowLeft size={16} /> Все рейтинги
        </Link>
      </div>

      {/* ── Шапка продавца ── */}
      <div className="rating-detail__head">
        <div className="rating-detail__seller-info">
          <h2 className="rating-detail__seller-name">{seller.name}</h2>
          <div className="rating-detail__seller-meta">
            {seller.businessType}
            {seller.city && <span> · {seller.city.name}</span>}
          </div>
        </div>
        <div className="rating-detail__views">
          <Eye size={15} />
          <span>{seller.viewsCount ?? 0} просмотров</span>
        </div>
      </div>

      <div className="rating-detail__body">
        {/* ── Левая колонка: сводка ── */}
        <div className="rating-detail__summary">
          <div className="detail-card">
            <h3 className="detail-card__title">Общий рейтинг</h3>

            <div className="rating-summary">
              <div className="rating-summary__avg">
                <span className="rating-summary__num">
                  {avg ? Number(avg).toFixed(1) : "—"}
                </span>
                <Star size={28} className="rating-summary__star" />
              </div>
              <div className="rating-summary__meta">
                <Users size={14} />
                <span>
                  {total}{" "}
                  {total === 1 ? "оценка" : total < 5 ? "оценки" : "оценок"}
                </span>
              </div>
            </div>

            {/* Распределение по звёздам */}
            {total > 0 && (
              <div className="rating-dist">
                {[5, 4, 3, 2, 1].map((star) => (
                  <DistributionBar
                    key={star}
                    star={star}
                    count={dist[star] ?? 0}
                    total={total}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Правая колонка: список оценок ── */}
        <div className="rating-detail__reviews">
          <div className="detail-card">
            <div className="detail-card__head">
              <h3 className="detail-card__title">
                Оценки ({pagination?.total ?? ratings.length})
              </h3>
              {/* Поиск по клиенту */}
              <div className="rating-search-wrap">
                <Search size={14} className="rating-search-icon" />
                <input
                  className="rating-search"
                  type="text"
                  placeholder="Поиск по имени или email..."
                  value={queryInput}
                  onChange={handleQueryChange}
                />
              </div>
              {/* Фильтр по звёздам */}
              <div className="rating-filter">
                <button
                  className={`rating-filter__btn ${!ratingFilter ? "rating-filter__btn--active" : ""}`}
                  onClick={() => pushUrl("", queryInput)}
                >
                  Все
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    className={`rating-filter__btn ${ratingFilter === String(star) ? "rating-filter__btn--active" : ""}`}
                    onClick={() => handleRatingFilter(star)}
                  >
                    <Star size={11} /> {star}
                  </button>
                ))}
              </div>
            </div>

            {ratings.length === 0 ? (
              <div className="rating-detail__empty">
                {ratingFilter
                  ? `Нет оценок на ${ratingFilter} звёзд`
                  : "Оценок пока нет"}
              </div>
            ) : (
              <div className="rating-reviews">
                {ratings.map((r) => (
                  <div key={r._id} className="rating-review">
                    <div className="rating-review__header">
                      <div className="rating-review__client">
                        <div className="rating-review__avatar">
                          {r.client?.avatar ? (
                            <img src={r.client.avatar} alt={r.client.name} />
                          ) : (
                            <span>
                              {r.client?.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="rating-review__name">
                            {r.client?.name || "Аноним"}
                          </div>
                          <div className="rating-review__date">
                            {formatDate(r.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="rating-review__stars">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i <= r.rating
                                ? "rating-review__star--filled"
                                : "rating-review__star--empty"
                            }
                          />
                        ))}
                        <span className="rating-review__num">{r.rating}</span>
                      </div>
                    </div>
                    {r.comment && (
                      <div className="rating-review__comment">{r.comment}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
