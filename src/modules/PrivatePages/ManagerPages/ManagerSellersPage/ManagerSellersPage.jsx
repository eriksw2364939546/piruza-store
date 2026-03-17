"use client";

// ═══════════════════════════════════════════════════════
// ManagerSellersPage — продавцы менеджера
// ═══════════════════════════════════════════════════════

import {
  useState,
  useActionState,
  useEffect,
  useTransition,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { Store, Plus } from "lucide-react";
import { createRequestAction } from "@/app/actions/request.actions";
import { deleteSellerAction } from "@/app/actions/seller.actions";
import "./ManagerSellersPage.scss";

const SELLERS_BASE = "/admins-piruza/manager/sellers";

const STATUS_LABELS = {
  active: { label: "Активен", cls: "active" },
  draft: { label: "Черновик", cls: "draft" },
  expired: { label: "Истёк", cls: "expired" },
  inactive: { label: "Отключён", cls: "inactive" },
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ─── Модалка создания заявки ───────────────────────────
const INIT = { success: null, message: "" };

function CreateRequestModal({ onClose }) {
  const [state, formAction, pending] = useActionState(
    createRequestAction,
    INIT,
  );

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      onClose();
    }
  }, [state.success]);

  return (
    <div
      className="msellers-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="msellers-modal__box">
        <div className="msellers-modal__header">
          <span className="msellers-modal__title">
            Новая заявка на продавца
          </span>
          <button className="msellers-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="msellers-modal__hint">
          После отправки заявка поступит на рассмотрение. При одобрении вы
          сможете заполнить полный профиль продавца.
        </p>
        <form action={formAction} className="msellers-modal__form">
          {state.success === false && (
            <div className="msellers-modal__error">{state.message}</div>
          )}
          <div className="msellers-modal__field">
            <label>Название продавца *</label>
            <input
              name="name"
              type="text"
              placeholder="Например: Boulangerie Parisienne"
              required
              autoFocus
            />
          </div>
          <div className="msellers-modal__field">
            <label>Тип бизнеса *</label>
            <input
              name="businessType"
              type="text"
              placeholder="Например: Пекарня, Ресторан, Магазин"
              required
            />
          </div>
          <div className="msellers-modal__field">
            <label>Юридические данные *</label>
            <textarea
              name="legalInfo"
              rows={3}
              placeholder="Например: SIRET: 123 456 789 00010"
              required
              minLength={5}
            />
          </div>
          <div className="msellers-modal__actions">
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
              {pending ? "Отправка..." : "📨 Отправить заявку"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Строка продавца ──────────────────────────────────
function SellerRow({ seller }) {
  const s = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;
  const [deleting, startDelete] = useTransition();

  async function handleDelete() {
    if (
      !confirm(`Удалить продавца "${seller.name}"?\n\nЭто действие необратимо.`)
    )
      return;
    startDelete(async () => {
      const res = await deleteSellerAction(seller._id);
      if (!res.success) toast.error(res.message);
    });
  }

  return (
    <tr className="msellers-row">
      <td>
        <div className="msellers-row__wrap">
          {seller.logo ? (
            <img
              src={`${process.env.NEXT_PUBLIC_URL}${seller.logo}`}
              alt={seller.name}
              className="msellers-row__logo"
            />
          ) : (
            <div className="msellers-row__logo-placeholder">
              {seller.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
          )}
          <Link
            href={`${SELLERS_BASE}/${seller.slug}`}
            className="msellers-row__link"
          >
            <div className="msellers-row__name">{seller.name}</div>
            <div className="msellers-row__type">
              {seller.businessType || "—"}
            </div>
          </Link>
        </div>
      </td>
      <td>{seller.city?.name || "—"}</td>
      <td>
        <span className={`sellers-badge sellers-badge--${s.cls}`}>
          {s.label}
        </span>
      </td>
      <td>
        {seller.status === "active" ? (
          <span className="msellers-row__date msellers-row__date--ok">
            до {formatDate(seller.activationEndDate)}
          </span>
        ) : (
          <span className="msellers-row__date msellers-row__date--none">—</span>
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
          {seller.status === "draft" && (
            <Link
              href={`${SELLERS_BASE}/${seller.slug}/edit`}
              className="sellers-btn sellers-btn--sm sellers-btn--ghost"
              title="Редактировать"
            >
              ✏️
            </Link>
          )}
          <button
            className="sellers-btn sellers-btn--sm sellers-btn--danger"
            onClick={handleDelete}
            disabled={deleting}
            title="Удалить"
          >
            {deleting ? "..." : "🗑️"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ─── Главный компонент ────────────────────────────────
export default function ManagerSellersPage({
  sellers = [],
  counts = {},
  cities = [],
  categories = [],
  initialStatus = "",
  initialQuery = "",
  initialCity = "",
  initialCategory = "",
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [catFilter, setCatFilter] = useState(initialCategory);
  const timerRef = useRef(null);

  const pushUrl = useCallback(
    (status, query, city, cat) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (query) params.set("query", query);
      if (city) params.set("city", city);
      if (cat) params.set("category", cat);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`);
    },
    [router, pathname],
  );

  const handleStatusChange = useCallback(
    (status) => {
      const newStatus = statusFilter === status ? "" : status;
      setStatusFilter(newStatus);
      pushUrl(newStatus, queryInput, cityFilter, catFilter);
    },
    [pushUrl, queryInput, statusFilter, cityFilter, catFilter],
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushUrl(statusFilter, val, cityFilter, catFilter);
    }, 400);
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setCityFilter(val);
    pushUrl(statusFilter, queryInput, val, catFilter);
  };

  const handleCatChange = (e) => {
    const val = e.target.value;
    setCatFilter(val);
    pushUrl(statusFilter, queryInput, cityFilter, val);
  };

  const totalCount = counts.all ?? sellers.length;

  return (
    <div className="msellers-page">
      {/* ── Шапка ── */}
      <div className="msellers-page__head">
        <div>
          <h2 className="msellers-page__title">Мои продавцы</h2>
          <p className="msellers-page__subtitle">Всего: {totalCount}</p>
        </div>
        <button
          className="sellers-btn sellers-btn--primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Новая заявка
        </button>
      </div>

      {/* ── Статус-фильтры (кликабельные, через URL) ── */}
      {totalCount > 0 && (
        <div className="msellers-stats">
          <button
            className={`msellers-stat msellers-stat--all ${!statusFilter ? "msellers-stat--selected" : ""}`}
            onClick={() => {
              setStatusFilter("");
              pushUrl("", queryInput);
            }}
          >
            <span className="msellers-stat__num">{totalCount}</span>
            <span className="msellers-stat__label">Все</span>
          </button>
          {Object.entries(STATUS_LABELS).map(([key, val]) => (
            <button
              key={key}
              className={`msellers-stat msellers-stat--${val.cls} ${statusFilter === key ? "msellers-stat--selected" : ""}`}
              onClick={() => handleStatusChange(key)}
            >
              <span className="msellers-stat__num">{counts[key] ?? 0}</span>
              <span className="msellers-stat__label">{val.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── Поиск + фильтры ── */}
      {totalCount > 0 && (
        <div className="msellers-page__filters">
          <input
            type="text"
            placeholder="Поиск по названию или городу..."
            value={queryInput}
            onChange={handleQueryChange}
            className="msellers-page__search-input"
          />
          <div className="msellers-page__selects">
            <select
              className="msellers-page__select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                pushUrl(e.target.value, queryInput, cityFilter, catFilter);
              }}
            >
              <option value="">Все статусы</option>
              <option value="active">Активные</option>
              <option value="draft">Черновики</option>
              <option value="expired">Истёкшие</option>
              <option value="inactive">Отключённые</option>
            </select>
            <select
              className="msellers-page__select"
              value={cityFilter}
              onChange={handleCityChange}
            >
              <option value="">Все города</option>
              {cities.map((c) => (
                <option key={c._id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              className="msellers-page__select"
              value={catFilter}
              onChange={handleCatChange}
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
      )}

      {/* ── Таблица ── */}
      {totalCount === 0 ? (
        <div className="msellers-page__empty">
          <Store size={40} />
          <p>У вас ещё нет продавцов.</p>
          <p className="msellers-page__empty-hint">
            Создайте заявку — после одобрения вы сможете заполнить профиль
            продавца.
          </p>
          <button
            className="sellers-btn sellers-btn--primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Создать заявку
          </button>
        </div>
      ) : sellers.length === 0 ? (
        <div className="msellers-page__empty">
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="msellers-page__table-wrap">
          <table className="msellers-page__table">
            <thead>
              <tr>
                <th>Продавец</th>
                <th>Город</th>
                <th>Статус</th>
                <th>Активен до</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sellers.map((seller) => (
                <SellerRow key={seller._id} seller={seller} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Модалка заявки ── */}
      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
