"use client";

// ═══════════════════════════════════════════════════════
// AdminsPage — список администраторов + детальная страница
// /admins-piruza/owner/admins
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useTransition } from "react";
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
import "./AdminsPage.scss";

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

function AdminModal({ manager = null, onClose }) {
  const isEdit = !!manager;
  const action = isEdit ? updateUserAction : createUserAction;
  const [state, formAction, pending] = useActionState(action, INIT);

  if (state.success === true) {
    toast.success(state.message);
    onClose();
  }

  return (
    <div
      className="adm-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="adm-modal__box">
        <div className="adm-modal__header">
          <span className="adm-modal__title">
            {isEdit ? "Редактировать администратора" : "Новый администратор"}
          </span>
          <button className="adm-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form action={formAction} className="adm-modal__form">
          {/* role всегда admin на этой странице */}
          <input type="hidden" name="role" value="admin" />
          {isEdit && <input type="hidden" name="id" value={manager._id} />}

          {state.success === false && (
            <div className="adm-modal__error">{state.message}</div>
          )}

          <div className="adm-modal__field">
            <label>Имя *</label>
            <input
              name="name"
              type="text"
              defaultValue={manager?.name || ""}
              placeholder="Имя администратора"
              required={!isEdit}
              autoFocus
            />
          </div>

          <div className="adm-modal__field">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              defaultValue={manager?.email || ""}
              placeholder="email@example.com"
              required={!isEdit}
            />
          </div>

          <div className="adm-modal__field">
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
            <div className="adm-modal__field">
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

          <div className="adm-modal__actions">
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
// ДЕТАЛЬНАЯ СТРАНИЦА администратора
// ════════════════════════════════════════════════════

function AdminDetail({ manager, sellers, onBack, onEdit }) {
  const [toggling, startToggle] = useTransition();

  const sellersByStatus = {
    active: sellers.filter((s) => s.status === "active"),
    draft: sellers.filter((s) => s.status === "draft"),
    expired: sellers.filter((s) => s.status === "expired"),
    inactive: sellers.filter((s) => s.status === "inactive"),
  };

  async function handleToggle() {
    const action = manager.isActive ? "деактивировать" : "активировать";
    if (
      !confirm(
        `${action.charAt(0).toUpperCase() + action.slice(1)} администратора ${manager.name}?`,
      )
    )
      return;
    startToggle(async () => {
      const res = await toggleUserStatusAction(
        manager._id,
        manager.isActive,
        "admin",
      );
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  return (
    <div className="adm-detail">
      {/* ── Навигация ── */}
      <div className="adm-detail__nav">
        <button className="adm-detail__back" onClick={onBack}>
          <ArrowLeft size={16} /> Все администраторы
        </button>
      </div>

      {/* ── Шапка ── */}
      <div className="adm-detail__head">
        <div className="adm-detail__avatar">
          {manager.name?.charAt(0)?.toUpperCase() || "M"}
        </div>
        <div className="adm-detail__info">
          <h2 className="adm-detail__name">{manager.name}</h2>
          <div className="adm-detail__email">
            <Mail size={14} /> {manager.email}
          </div>
          <span
            className={`adm-status adm-status--${manager.isActive ? "active" : "inactive"}`}
          >
            {manager.isActive ? "Активен" : "Деактивирован"}
          </span>
        </div>
        <div className="adm-detail__actions">
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
      <div className="adm-detail__meta">
        <div className="adm-detail__meta-item">
          <Calendar size={14} />
          <span>Создан: {formatDate(manager.createdAt)}</span>
        </div>
        <div className="adm-detail__meta-item">
          <Store size={14} />
          <span>Продавцов: {sellers.length}</span>
        </div>
        {manager.createdBy && (
          <div className="adm-detail__meta-item">
            <User size={14} />
            <span>Создал: {manager.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* ── Статистика продавцов ── */}
      <div className="adm-detail__stats">
        {Object.entries(sellersByStatus).map(([status, list]) => {
          const s = STATUS_LABELS[status];
          return (
            <div key={status} className={`adm-stat adm-stat--${s.cls}`}>
              <span className="adm-stat__num">{list.length}</span>
              <span className="adm-stat__label">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* ── Список продавцов ── */}
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
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => {
                  const s = STATUS_LABELS[seller.status] || STATUS_LABELS.draft;
                  return (
                    <tr key={seller._id}>
                      <td>
                        <div className="adm-seller__name">{seller.name}</div>
                        <div className="adm-seller__type">
                          {seller.businessType}
                        </div>
                      </td>
                      <td>{seller.city?.name || "—"}</td>
                      <td>
                        <span
                          className={`sellers-badge sellers-badge--${s.cls}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="adm-seller__date">
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

function AdminRow({ manager, onView, onEdit, onDelete }) {
  const [deleting, startDelete] = useTransition();

  async function handleDelete() {
    if (
      !confirm(
        `Удалить администратора "${manager.name}"?\n\nЭто действие необратимо.`,
      )
    )
      return;
    startDelete(async () => {
      const res = await deleteUserAction(manager._id, "admin");
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  return (
    <tr
      className={`adm-row ${deleting ? "adm-row--loading" : ""}`}
      onClick={() => onView(manager)}
      style={{ cursor: "pointer" }}
    >
      {/* Имя */}
      <td>
        <div className="adm-row__wrap">
          <div className="adm-row__avatar">
            {manager.name?.charAt(0)?.toUpperCase() || "M"}
          </div>
          <div>
            <div className="adm-row__name">{manager.name}</div>
            <div className="adm-row__email">{manager.email}</div>
          </div>
        </div>
      </td>

      {/* Статус */}
      <td onClick={(e) => e.stopPropagation()}>
        <span
          className={`adm-status adm-status--${manager.isActive ? "active" : "inactive"}`}
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
            onClick={() => onView(manager)}
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

export default function AdminsPage({ admins, sellersByAdmin = {} }) {
  const [showCreate, setShowCreate] = useState(false);
  const [editManager, setEditManager] = useState(null);
  const [activeManager, setActiveManager] = useState(null); // детальная

  // При клике "назад" из детальной — сбрасываем
  function handleBack() {
    setActiveManager(null);
  }

  // Детальная страница
  if (activeManager) {
    const sellers = Array.isArray(sellersByAdmin[activeManager._id])
      ? sellersByAdmin[activeManager._id]
      : [];
    return (
      <>
        <AdminDetail
          manager={activeManager}
          sellers={sellers}
          onBack={handleBack}
          onEdit={(m) => {
            setEditManager(m);
          }}
        />
        {editManager && (
          <AdminModal
            manager={editManager}
            onClose={() => setEditManager(null)}
          />
        )}
      </>
    );
  }

  // Список
  return (
    <div className="adm-page">
      {/* ── Шапка ── */}
      <div className="adm-page__head">
        <div>
          <h2 className="adm-page__title">Администраторы</h2>
          <p className="adm-page__subtitle">Всего: {admins.length}</p>
        </div>
        <button
          className="sellers-btn sellers-btn--primary"
          onClick={() => setShowCreate(true)}
        >
          + Добавить администратора
        </button>
      </div>

      {/* ── Таблица ── */}
      {admins.length === 0 ? (
        <div className="adm-page__empty">
          <User size={32} />
          <p>Администраторов нет. Создайте первого!</p>
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
              {admins.map((m) => (
                <AdminRow
                  key={m._id}
                  manager={m}
                  onView={setActiveManager}
                  onEdit={setEditManager}
                  onDelete={() => {}}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Модалка создания ── */}
      {showCreate && <AdminModal onClose={() => setShowCreate(false)} />}

      {/* ── Модалка редактирования ── */}
      {editManager && (
        <AdminModal
          manager={editManager}
          onClose={() => setEditManager(null)}
        />
      )}
    </div>
  );
}
