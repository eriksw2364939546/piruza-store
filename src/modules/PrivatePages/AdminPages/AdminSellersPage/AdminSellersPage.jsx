"use client";

// ═══════════════════════════════════════════════════════
// AdminSellersPage — список продавцов для Admin
// Отличия от Owner: нет кнопки "Удалить"
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  activateSellerAction,
  extendSellerAction,
  deactivateSellerAction,
  moveToDraftAction,
  deleteSellerAction,
} from "@/app/actions/seller.actions";
import "./AdminSellersPage.scss";
import Pagination from "@/components/Pagination/Pagination";

const SELLERS_BASE = "/admins-piruza/admin-panel/sellers";

const STATUS_LABELS = {
  active: { label: "Активен", cls: "active" },
  draft: { label: "Черновик", cls: "draft" },
  expired: { label: "Истёк", cls: "expired" },
  inactive: { label: "Отключён", cls: "inactive" },
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
};

// ─── Модальное окно ───
const Modal = ({ title, onClose, children }) => (
  <div className="sellers-modal__overlay" onClick={onClose}>
    <div className="sellers-modal__box" onClick={(e) => e.stopPropagation()}>
      <div className="sellers-modal__header">
        <h2 className="sellers-modal__title">{title}</h2>
        <button className="sellers-modal__close" onClick={onClose}>
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Модалка активации/продления ───
const ActivateModal = ({ seller, mode, onClose }) => {
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isExtend = mode === "extend";

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const result = isExtend
      ? await extendSellerAction(seller._id, months)
      : await activateSellerAction(seller._id, months);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    } else {
      onClose();
    }
  };

  return (
    <div className="sellers-modal__form">
      <p className="sellers-modal__subtitle">
        {isExtend ? "Продлить" : "Активировать"}: <strong>{seller.name}</strong>
      </p>
      {error && <div className="sellers-modal__error">{error}</div>}
      <div className="sellers-modal__field">
        <label>Количество месяцев</label>
        <input
          type="number"
          min={1}
          max={24}
          value={months}
          onChange={(e) => setMonths(Number(e.target.value))}
        />
      </div>
      <div className="sellers-modal__actions">
        <button className="sellers-btn sellers-btn--ghost" onClick={onClose}>
          Отмена
        </button>
        <button
          className="sellers-btn sellers-btn--primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Обработка..." : isExtend ? "Продлить" : "Активировать"}
        </button>
      </div>
    </div>
  );
};

// ─── Строка таблицы ───
const SellerRow = ({ seller, onActivate, onExtend }) => {
  const [loading, setLoading] = useState(null);
  const statusInfo = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;

  const handleDeactivate = async () => {
    if (!confirm(`Деактивировать "${seller.name}"?`)) return;
    setLoading("deactivate");
    const result = await deactivateSellerAction(seller._id, seller.slug);
    if (!result.success) alert(result.message);
    setLoading(null);
  };

  const handleDraft = async () => {
    if (!confirm(`Перевести "${seller.name}" в черновик?`)) return;
    setLoading("draft");
    const result = await moveToDraftAction(seller._id, seller.slug);
    if (!result.success) alert(result.message);
    setLoading(null);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Удалить "${seller.name}"?\n\nБудут удалены все товары, категории и изображения.`,
      )
    )
      return;
    setLoading("delete");
    const result = await deleteSellerAction(seller._id, seller.slug);
    if (!result.success) {
      alert(result.message);
      setLoading(null);
    }
  };

  return (
    <tr>
      <td>
        <Link
          href={`${SELLERS_BASE}/${seller.slug}`}
          className="sellers-row__link"
        >
          <div className="sellers-row__name">{seller.name}</div>
          <div className="sellers-row__meta">{seller.businessType}</div>
        </Link>
      </td>
      <td>{seller.city?.name || "—"}</td>
      <td>{seller.createdBy?.name || "—"}</td>
      <td>
        <span className={`sellers-badge sellers-badge--${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
      </td>
      <td>
        {seller.activationEndDate ? (
          <span
            className={
              new Date(seller.activationEndDate) < new Date()
                ? "sellers-row__date--expired"
                : ""
            }
          >
            до {formatDate(seller.activationEndDate)}
          </span>
        ) : (
          <span className="sellers-row__date--none">—</span>
        )}
      </td>
      <td>
        <div className="sellers-actions">
          <Link
            href={`${SELLERS_BASE}/${seller.slug}`}
            className="sellers-btn sellers-btn--sm sellers-btn--ghost"
            title="Просмотр"
          >
            👁
          </Link>
          <Link
            href={`${SELLERS_BASE}/${seller.slug}/edit`}
            className="sellers-btn sellers-btn--sm sellers-btn--ghost"
            title="Редактировать"
          >
            ✏️
          </Link>
          {(seller.status === "draft" ||
            seller.status === "expired" ||
            seller.status === "inactive") && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--success"
              onClick={() => onActivate(seller)}
              title="Активировать"
            >
              🟢
            </button>
          )}
          {seller.status === "active" && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--info"
              onClick={() => onExtend(seller)}
              title="Продлить"
            >
              ⏱️
            </button>
          )}
          {(seller.status === "active" || seller.status === "expired") && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--warning"
              onClick={handleDeactivate}
              disabled={loading === "deactivate"}
              title="Деактивировать"
            >
              {loading === "deactivate" ? "..." : "🔴"}
            </button>
          )}
          {seller.status !== "draft" && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--ghost"
              onClick={handleDraft}
              disabled={loading === "draft"}
              title="В черновик"
            >
              {loading === "draft" ? "..." : "📝"}
            </button>
          )}
          <button
            className="sellers-btn sellers-btn--sm sellers-btn--danger"
            onClick={handleDelete}
            disabled={loading === "delete"}
            title="Удалить"
          >
            {loading === "delete" ? "..." : "🗑️"}
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Фильтры ───
const Filters = ({ filters, onChange, cities, categories }) => {
  const [queryInput, setQueryInput] = useState(filters.query);
  const timerRef = useRef(null);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange({ ...filters, query: val });
    }, 400);
  };

  return (
    <div className="sellers-page__filters">
      <input
        className="sellers-filter__input"
        type="text"
        placeholder="Поиск по названию..."
        value={queryInput}
        onChange={handleQueryChange}
      />
      <select
        className="sellers-filter__select"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
      >
        <option value="">Все статусы</option>
        <option value="active">Активные</option>
        <option value="draft">Черновики</option>
        <option value="expired">Истёкшие</option>
        <option value="inactive">Отключённые</option>
      </select>
      <select
        className="sellers-filter__select"
        value={filters.city}
        onChange={(e) => onChange({ ...filters, city: e.target.value })}
      >
        <option value="">Все города</option>
        {cities.map((city) => (
          <option key={city._id} value={city.slug}>
            {city.name}
          </option>
        ))}
      </select>
      <select
        className="sellers-filter__select"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
      >
        <option value="">Все категории</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      {/* ── Кнопка "Мои продавцы" ── */}
      <button
        className={`sellers-filter__mine ${filters.mine ? "sellers-filter__mine--active" : ""}`}
        onClick={() =>
          onChange({ ...filters, mine: filters.mine ? "" : "true" })
        }
      >
        {filters.mine ? "★ Мои" : "☆ Мои"}
      </button>
    </div>
  );
};

// ─── Главный компонент ───
const AdminSellersPage = ({
  sellers,
  pagination,
  cities = [],
  categories = [],
  initialFilters = {},
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [activateSeller, setActivateSeller] = useState(null);
  const [filters, setFilters] = useState({
    query: initialFilters.query || "",
    status: initialFilters.status || "",
    city: initialFilters.city || "",
    category: initialFilters.category || "",
    mine: initialFilters.mine || "",
  });

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (newFilters.query) params.set("query", newFilters.query);
      if (newFilters.status) params.set("status", newFilters.status);
      if (newFilters.city) params.set("city", newFilters.city);
      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.mine) params.set("mine", newFilters.mine);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
    },
    [router, pathname],
  );

  return (
    <div className="sellers-page">
      <div className="sellers-page__head">
        <div>
          <h2 className="sellers-page__title">Продавцы</h2>
          <p className="sellers-page__subtitle">
            Всего: {pagination?.total ?? sellers.length}
          </p>
        </div>
        <Link
          href={`${SELLERS_BASE}/create`}
          className="sellers-btn sellers-btn--primary"
        >
          + Добавить продавца
        </Link>
      </div>

      <Filters
        filters={filters}
        onChange={handleFilterChange}
        cities={cities}
        categories={categories}
      />

      {sellers.length === 0 ? (
        <div className="sellers-page__empty">Продавцов не найдено</div>
      ) : (
        <div className="sellers-page__table-wrap">
          <table className="sellers-page__table">
            <thead>
              <tr>
                <th>Продавец</th>
                <th>Город</th>
                <th>Менеджер</th>
                <th>Статус</th>
                <th>Срок</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <SellerRow
                  key={seller._id}
                  seller={seller}
                  onActivate={(s) =>
                    setActivateSeller({ seller: s, mode: "activate" })
                  }
                  onExtend={(s) =>
                    setActivateSeller({ seller: s, mode: "extend" })
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? 1}
        onPageChange={(page) => {
          const params = new URLSearchParams();
          if (filters.query) params.set("query", filters.query);
          if (filters.status) params.set("status", filters.status);
          if (filters.city) params.set("city", filters.city);
          if (filters.category) params.set("category", filters.category);
          if (filters.mine) params.set("mine", filters.mine);
          if (page > 1) params.set("page", page);
          const qs = params.toString();
          router.push(`${pathname}${qs ? "?" + qs : ""}`);
        }}
      />

      {activateSeller && (
        <Modal
          title={activateSeller.mode === "extend" ? "Продлить" : "Активировать"}
          onClose={() => setActivateSeller(null)}
        >
          <ActivateModal
            seller={activateSeller.seller}
            mode={activateSeller.mode}
            onClose={() => setActivateSeller(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminSellersPage;
