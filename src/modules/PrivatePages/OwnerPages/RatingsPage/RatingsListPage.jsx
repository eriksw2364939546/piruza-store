"use client";

// ═══════════════════════════════════════════════════════
// RatingsListPage — список продавцов с рейтингами
// /admins-piruza/owner/ratings
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Star, Search } from "lucide-react";
import "./RatingsPage.scss";
import Pagination from "@/components/Pagination/Pagination";

const STATUS_LABELS = {
  active: { label: "Активен", cls: "active" },
  draft: { label: "Черновик", cls: "draft" },
  expired: { label: "Истёк", cls: "expired" },
  inactive: { label: "Отключён", cls: "inactive" },
};

function StarDisplay({ value }) {
  if (!value) return <span className="rating-list__no-rating">—</span>;
  return (
    <span className="rating-list__stars">
      <Star size={13} className="rating-list__star" />
      <span className="rating-list__value">{Number(value).toFixed(1)}</span>
    </span>
  );
}

export default function RatingsListPage({
  sellers = [],
  pagination,
  cities = [],
  categories = [],
  initialFilters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef(null);

  const [filters, setFilters] = useState({
    query: initialFilters.query || "",
    status: initialFilters.status || "",
    city: initialFilters.city || "",
    category: initialFilters.category || "",
  });
  const [queryInput, setQueryInput] = useState(initialFilters.query || "");

  const pushUrl = useCallback(
    (newFilters, page = 1) => {
      const params = new URLSearchParams();
      if (newFilters.query) params.set("query", newFilters.query);
      if (newFilters.status) params.set("status", newFilters.status);
      if (newFilters.city) params.set("city", newFilters.city);
      if (newFilters.category) params.set("category", newFilters.category);
      if (page > 1) params.set("page", page);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    pushUrl(newFilters);
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleChange("query", val);
    }, 400);
  };

  return (
    <div className="rating-list">
      {/* ── Шапка ── */}
      <div className="rating-list__head">
        <div>
          <h2 className="rating-list__title">Рейтинги</h2>
          <p className="rating-list__subtitle">
            Всего: {pagination?.total ?? sellers.length}
          </p>
        </div>
      </div>

      {/* ── Фильтры ── */}
      <div className="rating-list__filters">
        <div className="rating-list__search-wrap">
          <Search size={15} className="rating-list__search-icon" />
          <input
            className="rating-list__search"
            type="text"
            placeholder="Поиск по названию или городу..."
            value={queryInput}
            onChange={handleQueryChange}
          />
        </div>
        <div className="rating-list__selects">
          <select
            className="rating-list__select"
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="active">Активные</option>
            <option value="draft">Черновики</option>
            <option value="expired">Истёкшие</option>
            <option value="inactive">Отключённые</option>
          </select>
          <select
            className="rating-list__select"
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
          >
            <option value="">Все города</option>
            {cities.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className="rating-list__select"
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="">Все категории</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Таблица ── */}
      {sellers.length === 0 ? (
        <div className="rating-list__empty">Продавцов не найдено</div>
      ) : (
        <div className="rating-list__table-wrap">
          <table className="rating-list__table">
            <thead>
              <tr>
                <th>Продавец</th>
                <th>Город</th>
                <th>Статус</th>
                <th>Рейтинг</th>
                <th>Оценок</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => {
                const s = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;
                return (
                  <tr key={seller._id}>
                    <td>
                      <Link
                        href={`/admins-piruza/owner/ratings/${seller.slug}`}
                        className="rating-list__seller-link"
                      >
                        <div className="rating-list__seller-name">
                          {seller.name}
                        </div>
                        <div className="rating-list__seller-type">
                          {seller.businessType}
                        </div>
                      </Link>
                    </td>
                    <td>{seller.city?.name || "—"}</td>
                    <td>
                      <span className={`sellers-badge sellers-badge--${s.cls}`}>
                        {s.label}
                      </span>
                    </td>
                    <td>
                      <StarDisplay value={seller.averageRating} />
                    </td>
                    <td className="rating-list__count">
                      {seller.totalRatings || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={(page) => pushUrl(filters, page)}
      />
    </div>
  );
}
