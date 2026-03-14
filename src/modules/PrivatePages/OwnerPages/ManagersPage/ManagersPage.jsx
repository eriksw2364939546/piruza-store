"use client";

// ═══════════════════════════════════════════════════════
// ManagersPage — список менеджеров + детальная страница
// /admins-piruza/owner/managers
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Store,
} from "lucide-react";

import {
  createUserAction,
  updateUserAction,
  deleteUserAction,
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

// ════════════════════════════════════════════════════
// МОДАЛКА создания / редактирования
// ════════════════════════════════════════════════════

function ManagerModal({ manager = null, onClose, onSuccess }) {
  const isEdit = !!manager;
  const action = isEdit ? updateUserAction : createUserAction;
  const [state, formAction, pending] = useActionState(action, INIT);

  if (state.success === true) {
    toast.success(state.message);
    if (onSuccess && state.data) onSuccess(state.data);
    onClose();
  }

  return (
    <div
      className="mgr-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mgr-modal__box">
        <div className="mgr-modal__header">
          <span className="mgr-modal__title">
            {isEdit ? "Редактировать менеджера" : "Новый менеджер"}
          </span>
          <button className="mgr-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form action={formAction} className="mgr-modal__form">
          {/* role всегда manager на этой странице */}
          <input type="hidden" name="role" value="manager" />
          {isEdit && <input type="hidden" name="id" value={manager._id} />}

          {state.success === false && (
            <div className="mgr-modal__error">{state.message}</div>
          )}

          <div className="mgr-modal__field">
            <label>Имя *</label>
            <input
              name="name"
              type="text"
              defaultValue={manager?.name || ""}
              placeholder="Имя менеджера"
              required={!isEdit}
              autoFocus
            />
          </div>

          <div className="mgr-modal__field">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              defaultValue={manager?.email || ""}
              placeholder="email@example.com"
              required={!isEdit}
            />
          </div>

          <div className="mgr-modal__field">
            <label>
              {isEdit ? "Новый пароль (необязательно)" : "Пароль *"}
            </label>
            <input
              name="password"
              type="password"
              placeholder={
                isEdit
                  ? "Оставьте пустым чтобы не менять"
                  : "Минимум 6 символов"
              }
              required={!isEdit}
              minLength={6}
            />
          </div>

          {/* При редактировании — переключатель статуса */}
          {isEdit && (
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
          )}

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
              {pending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════
// ДЕТАЛЬНАЯ СТРАНИЦА менеджера
// ════════════════════════════════════════════════════

function ManagerDetail({ manager, sellers, onBack, onEdit, onToggle }) {
  const [toggling, startToggle] = useTransition();
  const [sellerStatusFilter, setSellerStatusFilter] = useState("all");

  const sellersByStatus = {
    active: sellers.filter((s) => s.status === "active"),
    draft: sellers.filter((s) => s.status === "draft"),
    expired: sellers.filter((s) => s.status === "expired"),
    inactive: sellers.filter((s) => s.status === "inactive"),
  };

  const filteredSellers =
    sellerStatusFilter === "all"
      ? sellers
      : sellers.filter((s) => s.status === sellerStatusFilter);

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
        // Обновляем activeManager в родителе — меняем isActive
        onToggle({ ...manager, isActive: !manager.isActive });
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="mgr-detail">
      {/* ── Навигация ── */}
      <div className="mgr-detail__nav">
        <button className="mgr-detail__back" onClick={onBack}>
          <ArrowLeft size={16} /> Все менеджеры
        </button>
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
            onClick={() => onEdit(manager)}
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

      {/* ── Мета информация ── */}
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
            <span>Создал: {manager.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* ── Статистика продавцов ── */}
      <div className="mgr-detail__stats">
        {/* Кнопка "Все" */}
        <button
          className={`mgr-stat mgr-stat--all ${sellerStatusFilter === "all" ? "mgr-stat--selected" : ""}`}
          onClick={() => setSellerStatusFilter("all")}
        >
          <span className="mgr-stat__num">{sellers.length}</span>
          <span className="mgr-stat__label">Все</span>
        </button>
        {Object.entries(sellersByStatus).map(([status, list]) => {
          const s = STATUS_LABELS[status];
          return (
            <button
              key={status}
              className={`mgr-stat mgr-stat--${s.cls} ${sellerStatusFilter === status ? "mgr-stat--selected" : ""}`}
              onClick={() =>
                setSellerStatusFilter(
                  sellerStatusFilter === status ? "all" : status,
                )
              }
            >
              <span className="mgr-stat__num">{list.length}</span>
              <span className="mgr-stat__label">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Список продавцов ── */}
      <div className="mgr-detail__sellers">
        <h3 className="mgr-detail__section-title">
          Продавцы ({filteredSellers.length}
          {sellerStatusFilter !== "all" ? ` из ${sellers.length}` : ""})
        </h3>

        {sellers.length === 0 ? (
          <div className="mgr-detail__empty">Нет продавцов</div>
        ) : filteredSellers.length === 0 ? (
          <div className="mgr-detail__empty">
            Нет продавцов с таким статусом
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
                {filteredSellers.map((seller) => {
                  const s = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;
                  return (
                    <tr key={seller._id}>
                      <td>
                        <Link
                          href={`/admins-piruza/owner/sellers/${seller.slug}`}
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
    </div>
  );
}

// ════════════════════════════════════════════════════
// СТРОКА ТАБЛИЦЫ
// ════════════════════════════════════════════════════

function ManagerRow({ manager, onEdit, basePath }) {
  const router = useRouter();
  const [deleting, startDelete] = useTransition();

  async function handleDelete() {
    if (
      !confirm(
        `Удалить менеджера "${manager.name}"?\n\nЭто действие необратимо.`,
      )
    )
      return;
    startDelete(async () => {
      const res = await deleteUserAction(manager._id, "manager");
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  return (
    <tr
      className={`mgr-row ${deleting ? "mgr-row--loading" : ""}`}
      onClick={() => router.push(`${basePath}/${manager._id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* Имя */}
      <td>
        <div className="mgr-row__wrap">
          <div className="mgr-row__avatar">
            {manager.name?.charAt(0)?.toUpperCase() || "M"}
          </div>
          <div>
            <div className="mgr-row__name">{manager.name}</div>
            <div className="mgr-row__email">{manager.email}</div>
          </div>
        </div>
      </td>

      {/* Статус */}
      <td onClick={(e) => e.stopPropagation()}>
        <span
          className={`mgr-status mgr-status--${manager.isActive ? "active" : "inactive"}`}
        >
          {manager.isActive ? "Активен" : "Неактивен"}
        </span>
      </td>

      {/* Создан */}
      <td>{formatDate(manager.createdAt)}</td>

      {/* Действия */}
      <td onClick={(e) => e.stopPropagation()}>
        <div className="sellers-actions">
          <button
            className="sellers-btn sellers-btn--ghost sellers-btn--sm"
            onClick={() => router.push(`${basePath}/${manager._id}`)}
            title="Подробнее"
          >
            👁
          </button>
          <button
            className="sellers-btn sellers-btn--ghost sellers-btn--sm"
            onClick={() => onEdit(manager)}
            title="Редактировать"
          >
            ✏️
          </button>
          <button
            className="sellers-btn sellers-btn--danger sellers-btn--sm"
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

// ════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ════════════════════════════════════════════════════

export default function ManagersPage({
  managers,
  sellersByManager = {},
  initialStatus = "",
  counts = {},
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [showCreate, setShowCreate] = useState(false);
  const [editManager, setEditManager] = useState(null);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const basePath = "/admins-piruza/owner/managers";

  const handleStatusChange = useCallback(
    (status) => {
      setStatusFilter(status);
      const qs = status ? `?status=${status}` : "";
      router.push(`${pathname}${qs}`);
    },
    [router, pathname],
  );

  // Список
  return (
    <div className="mgr-page">
      {/* ── Шапка ── */}
      <div className="mgr-page__head">
        <div>
          <h2 className="mgr-page__title">Менеджеры</h2>
          <p className="mgr-page__subtitle">Всего: {managers.length}</p>
        </div>
        <button
          className="sellers-btn sellers-btn--primary"
          onClick={() => setShowCreate(true)}
        >
          + Добавить менеджера
        </button>
      </div>

      {/* ── Фильтры статуса ── */}
      <div className="mgr-page__filters">
        <button
          className={`mgr-filter ${statusFilter === "" ? "mgr-filter--active" : ""}`}
          onClick={() => handleStatusChange("")}
        >
          Все{" "}
          <span className="mgr-filter__count">
            {counts.all ?? managers.length}
          </span>
        </button>
        <button
          className={`mgr-filter mgr-filter--active-status ${statusFilter === "active" ? "mgr-filter--active" : ""}`}
          onClick={() => handleStatusChange("active")}
        >
          Активные{" "}
          <span className="mgr-filter__count">
            {counts.active ?? managers.filter((m) => m.isActive).length}
          </span>
        </button>
        <button
          className={`mgr-filter mgr-filter--inactive-status ${statusFilter === "inactive" ? "mgr-filter--active" : ""}`}
          onClick={() => handleStatusChange("inactive")}
        >
          Неактивные{" "}
          <span className="mgr-filter__count">
            {counts.inactive ?? managers.filter((m) => !m.isActive).length}
          </span>
        </button>
      </div>

      {/* ── Таблица ── */}
      {managers.length === 0 ? (
        <div className="mgr-page__empty">
          <User size={32} />
          <p>Менеджеров нет. Создайте первого!</p>
        </div>
      ) : (
        <div className="mgr-page__table-wrap">
          <table className="mgr-page__table">
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
                <ManagerRow
                  key={m._id}
                  manager={m}
                  onEdit={setEditManager}
                  basePath={basePath}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Модалка создания ── */}
      {showCreate && <ManagerModal onClose={() => setShowCreate(false)} />}

      {/* ── Модалка редактирования ── */}
      {editManager && (
        <ManagerModal
          manager={editManager}
          onClose={() => setEditManager(null)}
        />
      )}
    </div>
  );
}
