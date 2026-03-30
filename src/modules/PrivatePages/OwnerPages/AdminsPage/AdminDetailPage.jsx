"use client";

// ═══════════════════════════════════════════════════════
// AdminDetailPage — детальная страница администратора
// /admins-piruza/owner/admins/[id]
// Фильтрация продавцов по статусу через URL (?status=...)
// ═══════════════════════════════════════════════════════

import {
  useState,
  useTransition,
  useActionState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Mail, Calendar, Store, User } from "lucide-react";

import {
  updateUserAction,
  toggleUserStatusAction,
} from "@/app/actions/admin-auth.actions";
import "./AdminsPage.scss";
import Pagination from "@/components/Pagination/Pagination";

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
          <input type="hidden" name="role" value="admin" />
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

export default function AdminDetailPage({
  manager: initialManager,
  pagination,
  sellers,
  counts,
  statusFilter,
  initialQuery = "",
  basePath,
  sellersBasePath,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [manager, setManager] = useState(initialManager);
  const [showEdit, setShowEdit] = useState(false);
  const [toggling, startToggle] = useTransition();
  const [queryInput, setQueryInput] = useState(initialQuery);
  const timerRef = useRef(null);

  const pushUrl = useCallback(
    (status, query, page = 1) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (query) params.set("query", query);
      if (page > 1) params.set("page", page);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname],
  );

  // Клик на статус-блок → меняет URL → page.js перезагружает данные
  const handleStatusFilter = useCallback(
    (status) => {
      const newStatus = statusFilter === status ? "" : status;
      pushUrl(newStatus, queryInput);
    },
    [pushUrl, statusFilter, queryInput],
  );

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
      if (res.success) {
        toast.success(res.message);
        setManager((prev) => ({ ...prev, isActive: !prev.isActive }));
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="adm-detail">
      {/* ── Навигация ── */}
      <div className="adm-detail__nav">
        <Link href={basePath} className="adm-detail__back">
          <ArrowLeft size={16} /> Все администраторы
        </Link>
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
            className={`adm-status mgr-status--${manager.isActive ? "active" : "inactive"}`}
          >
            {manager.isActive ? "Активен" : "Деактивирован"}
          </span>
        </div>
        <div className="adm-detail__actions">
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
      <div className="adm-detail__meta">
        <div className="adm-detail__meta-item">
          <Calendar size={14} />
          <span>Создан: {formatDate(manager.createdAt)}</span>
        </div>
        <div className="adm-detail__meta-item">
          <Store size={14} />
          <span>Продавцов: {counts.all}</span>
        </div>
        {manager.createdBy && (
          <div className="adm-detail__meta-item">
            <User size={14} />
            <span>Создал: {manager.createdBy.name}</span>
          </div>
        )}
      </div>

      {/* ── Статус-блоки — кликабельные, меняют URL ── */}
      <div className="adm-detail__stats">
        <button
          className={`adm-stat adm-stat--all ${!statusFilter ? "mgr-stat--selected" : ""}`}
          onClick={() => pushUrl("", queryInput)}
        >
          <span className="adm-stat__num">{counts.all}</span>
          <span className="adm-stat__label">Все</span>
        </button>
        {Object.entries(STATUS_LABELS).map(([status, s]) => (
          <button
            key={status}
            className={`adm-stat adm-stat--${s.cls} ${statusFilter === status ? "mgr-stat--selected" : ""}`}
            onClick={() => handleStatusFilter(status)}
          >
            <span className="adm-stat__num">{counts[status] ?? 0}</span>
            <span className="adm-stat__label">{s.label}</span>
          </button>
        ))}
      </div>
      <div className="mgr-page__search-row">
        <input
          className="sellers-filter__input"
          type="text"
          placeholder="Поиск по названию продавца..."
          value={queryInput}
          onChange={(e) => {
            const val = e.target.value;
            setQueryInput(val);
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              pushUrl(statusFilter, val);
            }, 400);
          }}
        />
      </div>

      {/* ── Список продавцов ── */}
      <div className="adm-detail__sellers">
        <h3 className="adm-detail__section-title">
          Продавцы ({pagination?.total ?? sellers.length}
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
                          className="adm-seller__link"
                        >
                          <div className="adm-seller__name">{seller.name}</div>
                          <div className="adm-seller__type">
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
      <div style={{ padding: "0 16px 16px" }}>
        <Pagination
          currentPage={pagination?.page ?? 1}
          totalPages={pagination?.totalPages ?? pagination?.pages ?? 1}
          onPageChange={(page) => pushUrl(statusFilter, queryInput, page)}
        />
      </div>
    </div>
  );
}
