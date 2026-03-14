"use client";

// ═══════════════════════════════════════════════════════
// ManagerDetailPage — детальная страница менеджера
// /admins-piruza/owner/managers/[id]
// Фильтрация продавцов по статусу через URL (?status=...)
// ═══════════════════════════════════════════════════════

import {
  useState,
  useTransition,
  useActionState,
  useEffect,
  useCallback,
} from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Calendar, Store, User } from "lucide-react";

import {
  updateUserAction,
  toggleUserStatusAction,
} from "@/app/actions/admin-auth.actions";
import "./ManagersPage.scss";

const INIT = { success: null, message: "" };

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

// ── Модалка редактирования ────────────────────────────

function EditModal({ manager, onClose, onSuccess }) {
  const [state, formAction, pending] = useActionState(updateUserAction, INIT);

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      if (onSuccess && state.data) onSuccess(state.data);
      onClose();
    }
  }, [state.success]);

  return (
    <div
      className="mgr-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mgr-modal__box">
        <div className="mgr-modal__header">
          <span className="mgr-modal__title">Редактировать менеджера</span>
          <button className="mgr-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <form action={formAction} className="mgr-modal__form">
          <input type="hidden" name="role" value="manager" />
          <input type="hidden" name="id" value={manager._id} />

          {state.success === false && (
            <div className="mgr-modal__error">{state.message}</div>
          )}

          <div className="mgr-modal__field">
            <label>Имя</label>
            <input name="name" type="text" defaultValue={manager.name || ""} />
          </div>
          <div className="mgr-modal__field">
            <label>Email</label>
            <input
              name="email"
              type="email"
              defaultValue={manager.email || ""}
            />
          </div>
          <div className="mgr-modal__field">
            <label>Новый пароль (необязательно)</label>
            <input
              name="password"
              type="password"
              placeholder="Оставьте пустым чтобы не менять"
              minLength={6}
            />
          </div>
          <div className="mgr-modal__field">
            <label>Статус</label>
            <select
              name="isActive"
              defaultValue={String(manager.isActive ?? true)}
            >
              <option value="true">Активен</option>
              <option value="false">Деактивирован</option>
            </select>
          </div>

          <div className="mgr-modal__actions">
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
              {pending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────

export default function ManagerDetailPage({
  manager: initialManager,
  sellers,
  counts,
  statusFilter,
  basePath,
  sellersBasePath,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [manager, setManager] = useState(initialManager);
  const [showEdit, setShowEdit] = useState(false);
  const [toggling, startToggle] = useTransition();

  // Клик на статус-блок → меняет URL → page.js перезагружает данные
  const handleStatusFilter = useCallback(
    (status) => {
      const newStatus = statusFilter === status ? "" : status;
      const qs = newStatus ? `?status=${newStatus}` : "";
      router.push(`${pathname}${qs}`);
    },
    [router, pathname, statusFilter],
  );

  async function handleToggle() {
    const action = manager.isActive ? "деактивировать" : "активировать";
    if (
      !confirm(
        `${action.charAt(0).toUpperCase() + action.slice(1)} менеджера ${manager.name}?`,
      )
    )
      return;
    startToggle(async () => {
      const res = await toggleUserStatusAction(
        manager._id,
        manager.isActive,
        "manager",
      );
      if (res.success) {
        toast.success(res.message);
        setManager((prev) => ({ ...prev, isActive: !prev.isActive }));
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="mgr-detail">
      {/* ── Навигация ── */}
      <div className="mgr-detail__nav">
        <Link href={basePath} className="mgr-detail__back">
          <ArrowLeft size={16} /> Все менеджеры
        </Link>
      </div>

      {/* ── Шапка ── */}
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
        <div className="mgr-detail__actions">
          <button
            className="sellers-btn sellers-btn--ghost"
            onClick={() => setShowEdit(true)}
          >
            ✏️ Редактировать
          </button>
          <button
            className={`sellers-btn ${manager.isActive ? "sellers-btn--warning" : "sellers-btn--success"}`}
            onClick={handleToggle}
            disabled={toggling}
          >
            {toggling
              ? "..."
              : manager.isActive
                ? "🔴 Деактивировать"
                : "🟢 Активировать"}
          </button>
        </div>
      </div>

      {/* ── Мета ── */}
      <div className="mgr-detail__meta">
        <div className="mgr-detail__meta-item">
          <Calendar size={14} />
          <span>Создан: {formatDate(manager.createdAt)}</span>
        </div>
        <div className="mgr-detail__meta-item">
          <Store size={14} />
          <span>Продавцов: {counts.all}</span>
        </div>
        {manager.createdBy && (
          <div className="mgr-detail__meta-item">
            <User size={14} />
            <span>Создал: {manager.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* ── Статус-блоки — кликабельные, меняют URL ── */}
      <div className="mgr-detail__stats">
        <button
          className={`mgr-stat mgr-stat--all ${!statusFilter ? "mgr-stat--selected" : ""}`}
          onClick={() => router.push(pathname)}
        >
          <span className="mgr-stat__num">{counts.all}</span>
          <span className="mgr-stat__label">Все</span>
        </button>
        {Object.entries(STATUS_LABELS).map(([status, s]) => (
          <button
            key={status}
            className={`mgr-stat mgr-stat--${s.cls} ${statusFilter === status ? "mgr-stat--selected" : ""}`}
            onClick={() => handleStatusFilter(status)}
          >
            <span className="mgr-stat__num">{counts[status] ?? 0}</span>
            <span className="mgr-stat__label">{s.label}</span>
          </button>
        ))}
      </div>

      {/* ── Список продавцов ── */}
      <div className="mgr-detail__sellers">
        <h3 className="mgr-detail__section-title">
          Продавцы ({sellers.length}
          {statusFilter ? ` из ${counts.all}` : ""})
        </h3>

        {sellers.length === 0 ? (
          <div className="mgr-detail__empty">
            {statusFilter ? "Нет продавцов с таким статусом" : "Нет продавцов"}
          </div>
        ) : (
          <div className="mgr-detail__table-wrap">
            <table className="mgr-detail__table">
              <thead>
                <tr>
                  <th>Продавец</th>
                  <th>Город</th>
                  <th>Статус</th>
                  <th>Истекает</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => {
                  const s = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;
                  return (
                    <tr key={seller._id}>
                      <td>
                        <Link
                          href={`${sellersBasePath}/${seller.slug}`}
                          className="mgr-seller__link"
                        >
                          <div className="mgr-seller__name">{seller.name}</div>
                          <div className="mgr-seller__type">
                            {seller.businessType}
                          </div>
                        </Link>
                      </td>
                      <td>{seller.city?.name || "—"}</td>
                      <td>
                        <span
                          className={`sellers-badge sellers-badge--${s.cls}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="mgr-seller__date">
                        {seller.activationEndDate
                          ? formatDate(seller.activationEndDate)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Модалка редактирования ── */}
      {showEdit && (
        <EditModal
          manager={manager}
          onClose={() => setShowEdit(false)}
          onSuccess={(updated) =>
            setManager((prev) => ({ ...prev, ...updated }))
          }
        />
      )}
    </div>
  );
}
