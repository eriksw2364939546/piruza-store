"use client";

// ═══════════════════════════════════════════════════════
// AdminAdminDetailPage — детальная страница администратора
// /admins-piruza/admin-panel/admins/[id]
// Admin только просматривает — нет редактирования/деактивации
// ═══════════════════════════════════════════════════════

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Calendar, Store, User } from "lucide-react";
import {
  activateSellerAction,
  extendSellerAction,
  deactivateSellerAction,
  moveToDraftAction,
  deleteSellerAction,
} from "@/app/actions/seller.actions";
import "./AdminAdminsPage.scss";

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

// ── Модалка активации/продления ──────────────────────

function ActivateModal({ seller, mode, onClose }) {
  const [months, setMonths] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isExtend = mode === "extend";

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const res = isExtend
      ? await extendSellerAction(seller._id, months)
      : await activateSellerAction(seller._id, months);
    if (!res.success) {
      setError(res.message);
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

// ── Строка продавца ───────────────────────────────────

function SellerRow({ seller, sellersBasePath, onActivate, onExtend }) {
  const [loading, setLoading] = useState(null);
  const s = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;

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
          href={`${sellersBasePath}/${seller.slug}`}
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
            href={`${sellersBasePath}/${seller.slug}`}
            className="sellers-btn sellers-btn--sm sellers-btn--ghost"
            title="Просмотр"
          >
            👁
          </Link>
          <Link
            href={`${sellersBasePath}/${seller.slug}/edit`}
            className="sellers-btn sellers-btn--sm sellers-btn--ghost"
            title="Редактировать"
          >
            ✏️
          </Link>
          {["draft", "expired", "inactive"].includes(seller.status) && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--success"
              onClick={() => onActivate(seller)}
            >
              🟢
            </button>
          )}
          {seller.status === "active" && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--info"
              onClick={() => onExtend(seller)}
            >
              ⏱️
            </button>
          )}
          {["active", "expired"].includes(seller.status) && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--warning"
              onClick={handleDeactivate}
              disabled={loading === "deactivate"}
            >
              {loading === "deactivate" ? "..." : "🔴"}
            </button>
          )}
          {seller.status !== "draft" && (
            <button
              className="sellers-btn sellers-btn--sm sellers-btn--ghost"
              onClick={handleDraft}
              disabled={loading === "draft"}
            >
              {loading === "draft" ? "..." : "📝"}
            </button>
          )}
          <button
            className="sellers-btn sellers-btn--sm sellers-btn--danger"
            onClick={handleDelete}
            disabled={loading === "delete"}
          >
            {loading === "delete" ? "..." : "🗑️"}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Главный компонент ─────────────────────────────────

export default function AdminAdminDetailPage({
  admin,
  sellers,
  counts,
  statusFilter,
  basePath,
  sellersBasePath,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [activateSeller, setActivateSeller] = useState(null);

  const handleStatusFilter = useCallback(
    (status) => {
      const newStatus = statusFilter === status ? "" : status;
      const qs = newStatus ? `?status=${newStatus}` : "";
      router.push(`${pathname}${qs}`);
    },
    [router, pathname, statusFilter],
  );

  return (
    <div className="adm-detail">
      {/* ── Навигация ── */}
      <div className="adm-detail__nav">
        <Link href={basePath} className="adm-detail__back">
          <ArrowLeft size={16} /> Все администраторы
        </Link>
      </div>

      {/* ── Шапка — без кнопок управления ── */}
      <div className="adm-detail__head">
        <div className="adm-detail__avatar">
          {admin.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div className="adm-detail__info">
          <h2 className="adm-detail__name">{admin.name}</h2>
          <div className="adm-detail__email">
            <Mail size={14} /> {admin.email}
          </div>
          <span
            className={`adm-status adm-status--${admin.isActive ? "active" : "inactive"}`}
          >
            {admin.isActive ? "Активен" : "Деактивирован"}
          </span>
        </div>
        {/* ❌ Нет кнопок — admin только просматривает других админов */}
      </div>

      {/* ── Мета ── */}
      <div className="adm-detail__meta">
        <div className="adm-detail__meta-item">
          <Calendar size={14} />
          <span>Создан: {formatDate(admin.createdAt)}</span>
        </div>
        <div className="adm-detail__meta-item">
          <Store size={14} />
          <span>Продавцов: {counts.all}</span>
        </div>
        {admin.createdBy && (
          <div className="adm-detail__meta-item">
            <User size={14} />
            <span>Создал: {admin.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* ── Статус-блоки — кликабельные, меняют URL ── */}
      <div className="adm-detail__stats">
        <button
          className={`adm-stat adm-stat--all ${!statusFilter ? "adm-stat--selected" : ""}`}
          onClick={() => router.push(pathname)}
        >
          <span className="adm-stat__num">{counts.all}</span>
          <span className="adm-stat__label">Все</span>
        </button>
        {Object.entries(STATUS_LABELS).map(([status, s]) => (
          <button
            key={status}
            className={`adm-stat adm-stat--${s.cls} ${statusFilter === status ? "adm-stat--selected" : ""}`}
            onClick={() => handleStatusFilter(status)}
          >
            <span className="adm-stat__num">{counts[status] ?? 0}</span>
            <span className="adm-stat__label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Список продавцов ── */}
      <div className="adm-detail__sellers">
        <h3 className="adm-detail__section-title">
          Продавцы ({sellers.length}
          {statusFilter ? ` из ${counts.all}` : ""})
        </h3>

        {sellers.length === 0 ? (
          <div className="adm-detail__empty">
            {statusFilter ? "Нет продавцов с таким статусом" : "Нет продавцов"}
          </div>
        ) : (
          <div className="adm-detail__table-wrap">
            <table className="adm-detail__table">
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
                    sellersBasePath={sellersBasePath}
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
