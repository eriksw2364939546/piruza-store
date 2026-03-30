"use client";

// ═══════════════════════════════════════════════════════
// AdminManagersPage — менеджеры (только просмотр)
// Admin видит всех менеджеров + продавцов каждого
// Управление продавцами через /admin-panel/sellers/[slug]
// ═══════════════════════════════════════════════════════

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Calendar, Store } from "lucide-react";
import {
  activateSellerAction,
  extendSellerAction,
  deactivateSellerAction,
  moveToDraftAction,
  deleteSellerAction,
} from "@/app/actions/seller.actions";
import "./AdminManagersPage.scss";
import Pagination from "@/components/Pagination/Pagination";

// Используем классы mgr-* из ManagersPage.scss через AdminManagersPage.scss

const SELLERS_BASE = "/admins-piruza/admin-panel/sellers";

const SELLER_STATUS = {
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

// ─── Модалка активации/продления ───
function ActivateModal({ seller, mode, onClose }) {
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
      toast.success(isExtend ? "Срок продлён" : "Продавец активирован");
      onClose();
    }
  };

  return (
    <div
      className="amgr-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="amgr-modal__box">
        <div className="amgr-modal__header">
          <span className="amgr-modal__title">
            {isExtend ? "Продлить" : "Активировать"}: {seller.name}
          </span>
          <button className="amgr-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        {error && <div className="amgr-modal__error">{error}</div>}
        <div className="amgr-modal__field">
          <label>Количество месяцев</label>
          <input
            type="number"
            min={1}
            max={24}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>
        <div className="amgr-modal__actions">
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
    </div>
  );
}

// ─── Строка продавца в детальной ───
function SellerRow({ seller, onActivate, onExtend }) {
  const [loading, setLoading] = useState(null);
  const s = SELLER_STATUS[seller.status] || SELLER_STATUS.draft;

  const handleDeactivate = async () => {
    if (!confirm(`Деактивировать "${seller.name}"?`)) return;
    setLoading("deactivate");
    const res = await deactivateSellerAction(seller._id, seller.slug);
    res.success ? toast.success("Деактивирован") : toast.error(res.message);
    setLoading(null);
  };

  const handleDraft = async () => {
    if (!confirm(`Перевести "${seller.name}" в черновик?`)) return;
    setLoading("draft");
    const res = await moveToDraftAction(seller._id, seller.slug);
    res.success
      ? toast.success("Переведён в черновик")
      : toast.error(res.message);
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
    const res = await deleteSellerAction(seller._id, seller.slug);
    if (!res.success) {
      toast.error(res.message);
      setLoading(null);
    }
  };

  return (
    <tr>
      <td>
        <Link
          href={`${SELLERS_BASE}/${seller.slug}`}
          className="amgr-seller__link"
        >
          <div className="amgr-seller__name">{seller.name}</div>
          <div className="amgr-seller__type">{seller.businessType}</div>
        </Link>
      </td>
      <td>{seller.city?.name || "—"}</td>
      <td>
        <span className={`sellers-badge sellers-badge--${s.cls}`}>
          {s.label}
        </span>
      </td>
      <td>
        {seller.activationEndDate ? formatDate(seller.activationEndDate) : "—"}
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
          {["draft", "expired", "inactive"].includes(seller.status) && (
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
          {["active", "expired"].includes(seller.status) && (
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
}

// ─── Детальная страница менеджера ───
function ManagerDetail({ manager, sellers, onBack }) {
  const [activateSeller, setActivateSeller] = useState(null);

  const sellersByStatus = {
    active: sellers.filter((s) => s.status === "active"),
    draft: sellers.filter((s) => s.status === "draft"),
    expired: sellers.filter((s) => s.status === "expired"),
    inactive: sellers.filter((s) => s.status === "inactive"),
  };

  const STATUS_LABELS = {
    active: { label: "Активен", cls: "active" },
    draft: { label: "Черновик", cls: "draft" },
    expired: { label: "Истёк", cls: "expired" },
    inactive: { label: "Отключён", cls: "inactive" },
  };

  return (
    <div className="mgr-detail">
      <div className="mgr-detail__nav">
        <button className="mgr-detail__back" onClick={onBack}>
          <ArrowLeft size={16} /> Все менеджеры
        </button>
      </div>

      {/* Шапка */}
      <div className="mgr-detail__head">
        <div className="mgr-detail__avatar">
          {manager.name?.charAt(0)?.toUpperCase() || "M"}
        </div>
        <div className="mgr-detail__info">
          <h2 className="mgr-detail__name">{manager.name}</h2>
          <div className="mgr-detail__email">
            <Mail size={14} /> {manager.email}
          </div>
          <span
            className={`mgr-status mgr-status--${manager.isActive ? "active" : "inactive"}`}
          >
            {manager.isActive ? "Активен" : "Деактивирован"}
          </span>
        </div>
        {/* ❌ Нет кнопок редактирования/деактивации — admin только смотрит */}
      </div>

      {/* Мета информация — как у овнера */}
      <div className="mgr-detail__meta">
        <div className="mgr-detail__meta-item">
          <Calendar size={14} />
          <span>Создан: {formatDate(manager.createdAt)}</span>
        </div>
        <div className="mgr-detail__meta-item">
          <Store size={14} />
          <span>Продавцов: {sellers.length}</span>
        </div>
        {manager.createdBy && (
          <div className="mgr-detail__meta-item">
            <User size={14} />
            <span>Создал: {manager.createdBy?.name || "—"}</span>
          </div>
        )}
      </div>

      {/* Статистика по статусам — как у овнера */}
      <div className="mgr-detail__stats">
        {Object.entries(sellersByStatus).map(([status, list]) => {
          const s = STATUS_LABELS[status];
          return (
            <div key={status} className={`mgr-stat mgr-stat--${s.cls}`}>
              <span className="mgr-stat__num">{list.length}</span>
              <span className="mgr-stat__label">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Продавцы */}
      <div className="mgr-detail__sellers">
        <h3 className="mgr-detail__section-title">
          Продавцы ({sellers.length})
        </h3>
        {sellers.length === 0 ? (
          <div className="mgr-detail__empty">Нет продавцов</div>
        ) : (
          <div className="mgr-detail__table-wrap">
            <table className="mgr-detail__table">
              <thead>
                <tr>
                  <th>Продавец</th>
                  <th>Город</th>
                  <th>Статус</th>
                  <th>Истекает</th>
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
      </div>

      {activateSeller && (
        <ActivateModal
          seller={activateSeller.seller}
          mode={activateSeller.mode}
          onClose={() => setActivateSeller(null)}
        />
      )}
    </div>
  );
}

// ─── Строка таблицы менеджеров ───
function ManagerRow({ manager, basePath }) {
  const router = useRouter();
  return (
    <tr
      className="amgr-row"
      onClick={() => router.push(`${basePath}/${manager._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>
        <div className="amgr-row__wrap">
          <div className="amgr-row__avatar">
            {manager.name?.charAt(0)?.toUpperCase() || "M"}
          </div>
          <div>
            <div className="amgr-row__name">{manager.name}</div>
            <div className="amgr-row__email">{manager.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span
          className={`mgr-status mgr-status--${manager.isActive ? "active" : "inactive"}`}
        >
          {manager.isActive ? "Активен" : "Неактивен"}
        </span>
      </td>
      <td>{formatDate(manager.createdAt)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <button
          className="sellers-btn sellers-btn--ghost sellers-btn--sm"
          onClick={() => router.push(`${basePath}/${manager._id}`)}
          title="Подробнее"
        >
          👁
        </button>
      </td>
    </tr>
  );
}

// ─── Главный компонент ───
export default function AdminManagersPage({
  managers,
  pagination,
  sellersByManager = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const basePath = "/admins-piruza/admin-panel/managers";

  const [queryInput, setQueryInput] = useState("");
  const timerRef = useRef(null);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const qs = val ? `?query=${encodeURIComponent(val)}` : "";
      router.push(`${pathname}${qs}`, { scroll: false });
    }, 400);
  };

  return (
    <div className="amgr-page">
      <div className="amgr-page__head">
        <div>
          <h2 className="amgr-page__title">Менеджеры</h2>
          <p className="amgr-page__subtitle">
            Всего: {pagination?.total ?? managers.length}
          </p>
        </div>
        <input
          className="mgr-page__search"
          type="text"
          placeholder="Поиск по имени или email..."
          value={queryInput}
          onChange={handleQueryChange}
        />
      </div>

      {managers.length === 0 ? (
        <div className="amgr-page__empty">
          <User size={32} />
          <p>Менеджеров нет</p>
        </div>
      ) : (
        <div className="amgr-page__table-wrap">
          <table className="amgr-page__table">
            <thead>
              <tr>
                <th>Менеджер</th>
                <th>Статус</th>
                <th>Создан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((m) => (
                <ManagerRow key={m._id} manager={m} basePath={basePath} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? pagination?.pages ?? 1}
        onPageChange={(page) => {
          const params = new URLSearchParams();
          if (queryInput) params.set("query", queryInput);
          if (page > 1) params.set("page", page);
          const qs = params.toString();
          router.push(`${pathname}${qs ? "?" + qs : ""}`);
        }}
      />
    </div>
  );
}
