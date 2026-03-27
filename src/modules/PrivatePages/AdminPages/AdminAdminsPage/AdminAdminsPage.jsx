"use client";

// ═══════════════════════════════════════════════════════
// AdminAdminsPage — список администраторов (только просмотр)
// Admin видит всех админов + их продавцов с управлением
// /admins-piruza/admin-panel/admins
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, User, Mail, Calendar, Store } from "lucide-react";
import {
  activateSellerAction,
  extendSellerAction,
  deactivateSellerAction,
  moveToDraftAction,
  deleteSellerAction,
} from "@/app/actions/seller.actions";
import "./AdminAdminsPage.scss";

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
      className="adm-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="adm-modal__box">
        <div className="adm-modal__header">
          <span className="adm-modal__title">
            {isExtend ? "Продлить" : "Активировать"}: {seller.name}
          </span>
          <button className="adm-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        {error && <div className="adm-modal__error">{error}</div>}
        <div className="adm-modal__field">
          <label>Количество месяцев</label>
          <input
            type="number"
            min={1}
            max={24}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>
        <div className="adm-modal__actions">
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

// ─── Строка продавца ───
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
          className="adm-seller__link"
        >
          <div className="adm-seller__name">{seller.name}</div>
          <div className="adm-seller__type">{seller.businessType}</div>
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

// ─── Детальная страница администратора ───
function AdminDetail({ admin, sellers, onBack }) {
  const [activateSeller, setActivateSeller] = useState(null);

  const sellersByStatus = {
    active: sellers.filter((s) => s.status === "active"),
    draft: sellers.filter((s) => s.status === "draft"),
    expired: sellers.filter((s) => s.status === "expired"),
    inactive: sellers.filter((s) => s.status === "inactive"),
  };

  return (
    <div className="adm-detail">
      <div className="adm-detail__nav">
        <button className="adm-detail__back" onClick={onBack}>
          <ArrowLeft size={16} /> Все администраторы
        </button>
      </div>

      {/* Шапка */}
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
        {/* ❌ Нет кнопок редактирования/деактивации */}
      </div>

      {/* Мета */}
      <div className="adm-detail__meta">
        <div className="adm-detail__meta-item">
          <Calendar size={14} />
          <span>Создан: {formatDate(admin.createdAt)}</span>
        </div>
        <div className="adm-detail__meta-item">
          <Store size={14} />
          <span>Продавцов: {sellers.length}</span>
        </div>
        {admin.createdBy && (
          <div className="adm-detail__meta-item">
            <User size={14} />
            <span>Создал: {admin.createdBy?.name || "—"}</span>
          </div>
        )}
      </div>

      {/* Статистика */}
      <div className="adm-detail__stats">
        {Object.entries(sellersByStatus).map(([status, list]) => {
          const s = SELLER_STATUS[status];
          return (
            <div key={status} className={`adm-stat adm-stat--${s.cls}`}>
              <span className="adm-stat__num">{list.length}</span>
              <span className="adm-stat__label">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Продавцы */}
      <div className="adm-detail__sellers">
        <h3 className="adm-detail__section-title">
          Продавцы ({sellers.length})
        </h3>
        {sellers.length === 0 ? (
          <div className="adm-detail__empty">Нет продавцов</div>
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

// ─── Строка таблицы администраторов ───
function AdminRow({ admin, basePath }) {
  const router = useRouter();
  return (
    <tr
      className="adm-row"
      onClick={() => router.push(`${basePath}/${admin._id}`)}
      style={{ cursor: "pointer" }}
    >
      <td>
        <div className="adm-row__wrap">
          <div className="adm-row__avatar">
            {admin.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div>
            <div className="adm-row__name">{admin.name}</div>
            <div className="adm-row__email">{admin.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span
          className={`adm-status adm-status--${admin.isActive ? "active" : "inactive"}`}
        >
          {admin.isActive ? "Активен" : "Неактивен"}
        </span>
      </td>
      <td>{formatDate(admin.createdAt)}</td>
      <td onClick={(e) => e.stopPropagation()}>
        <button
          className="sellers-btn sellers-btn--ghost sellers-btn--sm"
          onClick={() => router.push(`${basePath}/${admin._id}`)}
          title="Подробнее"
        >
          👁
        </button>
      </td>
    </tr>
  );
}

// ─── Главный компонент ───
export default function AdminAdminsPage({ admins, sellersByAdmin = {} }) {
  const basePath = "/admins-piruza/admin-panel/admins";

  return (
    <div className="adm-page">
      <div className="adm-page__head">
        <div>
          <h2 className="adm-page__title">Администраторы</h2>
          <p className="adm-page__subtitle">Всего: {admins.length}</p>
        </div>
        {/* ❌ Нет кнопки создания */}
      </div>

      {admins.length === 0 ? (
        <div className="adm-page__empty">
          <User size={32} />
          <p>Администраторов нет</p>
        </div>
      ) : (
        <div className="adm-page__table-wrap">
          <table className="adm-page__table">
            <thead>
              <tr>
                <th>Администратор</th>
                <th>Статус</th>
                <th>Создан</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <AdminRow key={a._id} admin={a} basePath={basePath} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
