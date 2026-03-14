"use client";

// ═══════════════════════════════════════════════════════
// SellersPage — клиентский компонент
// Owner: все продавцы + CRUD + управление статусами
// ═══════════════════════════════════════════════════════

import {
  useState,
  useActionState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  createSellerAction,
  activateSellerAction,
  extendSellerAction,
  deactivateSellerAction,
  moveToDraftAction,
  deleteSellerAction,
} from "@/app/actions/seller.actions";
import "./SellersPage.scss";

const SELLERS_BASE = "/admins-piruza/owner/sellers";

const initialState = { success: false, message: "" };

const STATUS_LABELS = {
  active: { label: "Активен", cls: "active" },
  draft: { label: "Черновик", cls: "draft" },
  expired: { label: "Истёк", cls: "expired" },
  inactive: { label: "Отключён", cls: "inactive" },
};

// ─── Форматирование даты ───
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU");
};

// ─── Модальное окно ───
const Modal = ({ title, onClose, children, wide = false }) => (
  <div className="sellers-modal__overlay" onClick={onClose}>
    <div
      className={`sellers-modal__box ${wide ? "sellers-modal__box--wide" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
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

// ─── Форма создания/редактирования ───
const SellerForm = ({
  seller = null,
  cities = [],
  categories = [],
  onClose,
}) => {
  const action = seller ? updateSellerAction : createSellerAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.success) onClose();

  // Текущие глобальные категории продавца
  const currentCatIds = seller?.globalCategories?.map((c) => c._id || c) || [];
  const [selectedCats, setSelectedCats] = useState(currentCatIds);

  const toggleCat = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <form action={formAction} className="sellers-modal__form">
      {seller && <input type="hidden" name="id" value={seller._id} />}

      {state.message && !state.success && (
        <div className="sellers-modal__error">{state.message}</div>
      )}

      <div className="sellers-modal__grid">
        {/* Название */}
        <div className="sellers-modal__field sellers-modal__field--full">
          <label>Название *</label>
          <input
            name="name"
            type="text"
            defaultValue={seller?.name}
            required
            autoFocus
          />
        </div>

        {/* Тип бизнеса */}
        <div className="sellers-modal__field">
          <label>Тип бизнеса *</label>
          <input
            name="businessType"
            type="text"
            defaultValue={seller?.businessType}
            placeholder="pâtisserie"
            required
          />
        </div>

        {/* Email */}
        <div className="sellers-modal__field">
          <label>Email *</label>
          <input
            name="email"
            type="email"
            defaultValue={seller?.email}
            required
          />
        </div>

        {/* Телефон */}
        <div className="sellers-modal__field">
          <label>Телефон *</label>
          <input
            name="phone"
            type="text"
            defaultValue={seller?.phone}
            required
          />
        </div>

        {/* WhatsApp */}
        <div className="sellers-modal__field">
          <label>WhatsApp *</label>
          <input
            name="whatsapp"
            type="text"
            defaultValue={seller?.whatsapp}
            required
          />
        </div>

        {/* Адрес */}
        <div className="sellers-modal__field sellers-modal__field--full">
          <label>Адрес *</label>
          <input
            name="address"
            type="text"
            defaultValue={seller?.address}
            required
          />
        </div>

        {/* Описание */}
        <div className="sellers-modal__field sellers-modal__field--full">
          <label>Описание *</label>
          <textarea
            name="description"
            rows={3}
            defaultValue={seller?.description}
            required
          />
        </div>

        {/* Юр. информация */}
        <div className="sellers-modal__field sellers-modal__field--full">
          <label>Юр. информация</label>
          <input
            name="legalInfo"
            type="text"
            defaultValue={seller?.legalInfo}
          />
        </div>

        {/* Город */}
        <div className="sellers-modal__field">
          <label>Город *</label>
          <select
            name="city"
            defaultValue={seller?.city?._id || seller?.city || ""}
            required
          >
            <option value="">— Выберите город —</option>
            {cities.map((city) => (
              <option key={city._id} value={city._id}>
                {city.name} {!city.isActive ? "(неактивен)" : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Глобальные категории */}
        <div className="sellers-modal__field sellers-modal__field--full">
          <label>Глобальные категории</label>
          <div className="sellers-modal__cats">
            {categories.map((cat) => (
              <label key={cat._id} className="sellers-modal__cat-item">
                <input
                  type="checkbox"
                  name="globalCategories"
                  value={cat._id}
                  checked={selectedCats.includes(cat._id)}
                  onChange={() => toggleCat(cat._id)}
                />
                <span>
                  {cat.name} {!cat.isActive ? "(неактивна)" : ""}
                </span>
              </label>
            ))}
            {categories.length === 0 && (
              <p className="sellers-modal__no-cats">Нет доступных категорий</p>
            )}
          </div>
        </div>
      </div>

      <div className="sellers-modal__actions">
        <button
          type="button"
          className="sellers-btn sellers-btn--ghost"
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="sellers-btn sellers-btn--primary"
          disabled={pending}
        >
          {pending ? "Сохранение..." : seller ? "Сохранить" : "Создать"}
        </button>
      </div>
    </form>
  );
};

// ─── Модалка активации/продления ───
const ActivateModal = ({ seller, mode, onClose }) => {
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isExtend = mode === "extend";
  const title = isExtend ? "Продлить продавца" : "Активировать продавца";

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
          {loading ? "Обработка..." : title}
        </button>
      </div>
    </div>
  );
};

// ─── Строка таблицы ───
const SellerRow = ({ seller, onActivate, onExtend }) => {
  const [loading, setLoading] = useState(null); // 'deactivate' | 'draft' | 'delete'

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
    const result = await deleteSellerAction(seller._id);
    if (!result.success) {
      alert(result.message);
      setLoading(null);
    }
  };

  return (
    <tr>
      {/* Название — кликабельно, ведёт на детали */}
      <td>
        <Link
          href={`${SELLERS_BASE}/${seller.slug}`}
          className="sellers-row__link"
        >
          <div className="sellers-row__name">{seller.name}</div>
          <div className="sellers-row__meta">{seller.businessType}</div>
        </Link>
      </td>

      {/* Город */}
      <td>{seller.city?.name || "—"}</td>

      {/* Менеджер */}
      <td>{seller.createdBy?.name || "—"}</td>

      {/* Статус */}
      <td>
        <span className={`sellers-badge sellers-badge--${statusInfo.cls}`}>
          {statusInfo.label}
        </span>
      </td>

      {/* Срок */}
      <td>
        <div className="sellers-row__dates">
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
        </div>
      </td>

      {/* Действия */}
      <td>
        <div className="sellers-actions">
          {/* Детали */}
          <Link
            href={`${SELLERS_BASE}/${seller.slug}`}
            className="sellers-btn sellers-btn--sm sellers-btn--ghost"
            title="Просмотр"
          >
            👁
          </Link>

          {/* Редактировать */}
          <Link
            href={`${SELLERS_BASE}/${seller.slug}/edit`}
            className="sellers-btn sellers-btn--sm sellers-btn--ghost"
            title="Редактировать"
          >
            ✏️
          </Link>

          {/* Активировать (если draft или expired или inactive) */}
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

          {/* Продлить (если active) */}
          {seller.status === "active" && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--info"
              onClick={() => onExtend(seller)}
              title="Продлить"
            >
              ⏱️
            </button>
          )}

          {/* Деактивировать (если active или expired) */}
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

          {/* В черновик (если active или inactive или expired) */}
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

          {/* Удалить */}
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
    </div>
  );
};

// ─── Главный компонент ───
const SellersPage = ({
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
  });

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      const params = new URLSearchParams();
      if (newFilters.query) params.set("query", newFilters.query);
      if (newFilters.status) params.set("status", newFilters.status);
      if (newFilters.city) params.set("city", newFilters.city);
      if (newFilters.category) params.set("category", newFilters.category);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`);
    },
    [router, pathname],
  );

  return (
    <div className="sellers-page">
      {/* ── Шапка ── */}
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

      {/* ── Фильтры ── */}
      <Filters
        filters={filters}
        onChange={handleFilterChange}
        cities={cities}
        categories={categories}
      />

      {/* ── Таблица ── */}
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

      {/* ── Модалка активации/продления ── */}
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

export default SellersPage;
