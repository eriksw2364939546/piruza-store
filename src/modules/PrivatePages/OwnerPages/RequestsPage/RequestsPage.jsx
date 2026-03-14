"use client";

// ═══════════════════════════════════════════════════════
// RequestsPage — заявки от Manager'ов
// /admins-piruza/owner/requests
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useTransition, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import {
  approveRequestAction,
  rejectRequestAction,
} from "@/app/actions/request.actions";
import "./RequestsPage.scss";

// ── Утилиты ──────────────────────────────────────────

const STATUS_MAP = {
  pending: { label: "Ожидает", cls: "pending" },
  approved: { label: "Одобрена", cls: "approved" },
  rejected: { label: "Отклонена", cls: "rejected" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return <span className={`req-badge req-badge--${s.cls}`}>{s.label}</span>;
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Модалка отклонения ────────────────────────────────

const REJECT_INIT = { success: null, message: "" };

function RejectModal({ request, onClose }) {
  const [state, formAction, pending] = useActionState(
    rejectRequestAction,
    REJECT_INIT,
  );

  if (state.success === true) {
    toast.success(state.message);
    onClose();
  }

  return (
    <div
      className="req-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="req-modal__box">
        <div className="req-modal__header">
          <span className="req-modal__title">Отклонить заявку</span>
          <button className="req-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form action={formAction} className="req-modal__form">
          <input type="hidden" name="id" value={request._id} />

          <p className="req-modal__subtitle">
            Заявка от <strong>{request.requestedBy?.name || "—"}</strong>
            {request.businessName && (
              <>
                {" "}
                на создание <strong>«{request.businessName}»</strong>
              </>
            )}
          </p>

          {state.success === false && (
            <div className="req-modal__error">{state.message}</div>
          )}

          <div className="req-modal__field">
            <label>Причина отклонения *</label>
            <textarea
              name="rejectionReason"
              rows={4}
              placeholder="Объясните причину отклонения заявки..."
              required
              autoFocus
            />
          </div>

          <div className="req-modal__actions">
            <button
              type="button"
              className="sellers-btn sellers-btn--ghost"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="sellers-btn sellers-btn--danger"
              disabled={pending}
            >
              {pending ? "Отправка..." : "Отклонить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Детальное модальное окно заявки ──────────────────

function RequestDetailModal({ request, onClose, onApprove, onReject }) {
  return (
    <div
      className="req-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="req-modal__box req-modal__box--wide">
        <div className="req-modal__header">
          <span className="req-modal__title">Детали заявки</span>
          <button className="req-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="req-detail">
          {/* Статус + кнопки */}
          <div className="req-detail__status-row">
            <StatusBadge status={request.status} />
            {request.status === "pending" && (
              <div className="sellers-actions">
                <button
                  className="sellers-btn sellers-btn--success sellers-btn--sm"
                  onClick={() => {
                    onApprove(request._id);
                    onClose();
                  }}
                >
                  <CheckCircle size={14} /> Одобрить
                </button>
                <button
                  className="sellers-btn sellers-btn--danger sellers-btn--sm"
                  onClick={() => {
                    onReject(request);
                    onClose();
                  }}
                >
                  <XCircle size={14} /> Отклонить
                </button>
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="req-detail__grid">
            <div className="req-detail__field">
              <span className="req-detail__label">
                <User size={13} /> Менеджер
              </span>
              <span className="req-detail__value">
                {request.requestedBy?.name || "—"}
              </span>
              <span className="req-detail__sub">
                {request.requestedBy?.email || ""}
              </span>
            </div>

            {request.businessName && (
              <div className="req-detail__field">
                <span className="req-detail__label">
                  <FileText size={13} /> Название бизнеса
                </span>
                <span className="req-detail__value">
                  {request.businessName}
                </span>
              </div>
            )}

            {request.businessType && (
              <div className="req-detail__field">
                <span className="req-detail__label">Тип бизнеса</span>
                <span className="req-detail__value">
                  {request.businessType}
                </span>
              </div>
            )}

            <div className="req-detail__field">
              <span className="req-detail__label">
                <Calendar size={13} /> Создана
              </span>
              <span className="req-detail__value">
                {formatDate(request.createdAt)}
              </span>
            </div>

            {request.reviewedAt && (
              <div className="req-detail__field">
                <span className="req-detail__label">Рассмотрена</span>
                <span className="req-detail__value">
                  {formatDate(request.reviewedAt)}
                </span>
              </div>
            )}

            {request.reviewedBy && (
              <div className="req-detail__field">
                <span className="req-detail__label">Рассмотрел</span>
                <span className="req-detail__value">
                  {request.reviewedBy?.name || "—"}
                </span>
              </div>
            )}
          </div>

          {/* Описание / комментарий */}
          {request.description && (
            <div className="req-detail__text-block">
              <span className="req-detail__label">Описание</span>
              <p className="req-detail__text">{request.description}</p>
            </div>
          )}

          {/* Юридическая информация */}
          {request.legalInfo && (
            <div className="req-detail__text-block">
              <span className="req-detail__label">Юридическая информация</span>
              <p className="req-detail__text req-detail__text--mono">
                {request.legalInfo}
              </p>
            </div>
          )}

          {/* Причина отклонения */}
          {request.rejectionReason && (
            <div className="req-detail__text-block req-detail__text-block--danger">
              <span className="req-detail__label">Причина отклонения</span>
              <p className="req-detail__text">{request.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Строка таблицы ────────────────────────────────────

function RequestRow({ request, onView, onApprove, onReject }) {
  const [approving, startApprove] = useTransition();

  function handleApprove() {
    if (!confirm(`Одобрить заявку от ${request.requestedBy?.name}?`)) return;
    startApprove(async () => {
      const res = await approveRequestAction(request._id);
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  return (
    <tr className={approving ? "req-row req-row--loading" : "req-row"}>
      {/* Менеджер */}
      <td>
        <div className="req-row__name">{request.requestedBy?.name || "—"}</div>
        <div className="req-row__meta">{request.requestedBy?.email || ""}</div>
      </td>

      {/* Бизнес */}
      <td>
        <div className="req-row__business">{request.businessName || "—"}</div>
        {request.businessType && (
          <div className="req-row__meta">{request.businessType}</div>
        )}
      </td>

      {/* Статус */}
      <td>
        <StatusBadge status={request.status} />
      </td>

      {/* Дата */}
      <td className="req-row__date">{formatDate(request.createdAt)}</td>

      {/* Рассмотрел */}
      <td className="req-row__reviewer">
        {request.reviewedBy?.name || <span className="req-row__none">—</span>}
      </td>

      {/* Действия */}
      <td>
        <div className="sellers-actions">
          <button
            className="sellers-btn sellers-btn--ghost sellers-btn--sm"
            onClick={() => onView(request)}
            title="Подробнее"
          >
            👁
          </button>

          {request.status === "pending" && (
            <>
              <button
                className="sellers-btn sellers-btn--success sellers-btn--sm"
                onClick={handleApprove}
                disabled={approving}
                title="Одобрить"
              >
                {approving ? "..." : <CheckCircle size={13} />}
              </button>
              <button
                className="sellers-btn sellers-btn--danger sellers-btn--sm"
                onClick={() => onReject(request)}
                title="Отклонить"
              >
                <XCircle size={13} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

// ══════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ══════════════════════════════════════════════════════

export default function RequestsPage({
  requests,
  pagination,
  initialStatus = "",
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [viewRequest, setViewRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);

  const handleStatusChange = useCallback(
    (status) => {
      setStatusFilter(status);
      const qs = status ? `?status=${status}` : "";
      router.push(`${pathname}${qs}`);
    },
    [router, pathname],
  );

  async function handleApprove(id) {
    const res = await approveRequestAction(id);
    res.success ? toast.success(res.message) : toast.error(res.message);
  }

  const counts = {
    all: pagination?.total ?? requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="req-page">
      {/* ── Шапка ── */}
      <div className="req-page__head">
        <div>
          <h2 className="req-page__title">Заявки</h2>
          <p className="req-page__subtitle">
            Всего: {pagination?.total ?? requests.length}
          </p>
        </div>
      </div>

      {/* ── Счётчики по статусам ── */}
      <div className="req-page__stats">
        <button
          className={`req-stat ${statusFilter === "" ? "req-stat--active" : ""}`}
          onClick={() => handleStatusChange("")}
        >
          <span className="req-stat__num">{counts.all}</span>
          <span className="req-stat__label">Все</span>
        </button>
        <button
          className={`req-stat req-stat--pending ${statusFilter === "pending" ? "req-stat--active" : ""}`}
          onClick={() => handleStatusChange("pending")}
        >
          <Clock size={15} />
          <span className="req-stat__num">{counts.pending}</span>
          <span className="req-stat__label">Ожидают</span>
        </button>
        <button
          className={`req-stat req-stat--approved ${statusFilter === "approved" ? "req-stat--active" : ""}`}
          onClick={() => handleStatusChange("approved")}
        >
          <CheckCircle size={15} />
          <span className="req-stat__num">{counts.approved}</span>
          <span className="req-stat__label">Одобрены</span>
        </button>
        <button
          className={`req-stat req-stat--rejected ${statusFilter === "rejected" ? "req-stat--active" : ""}`}
          onClick={() => handleStatusChange("rejected")}
        >
          <XCircle size={15} />
          <span className="req-stat__num">{counts.rejected}</span>
          <span className="req-stat__label">Отклонены</span>
        </button>
      </div>

      {/* ── Таблица ── */}
      {requests.length === 0 ? (
        <div className="req-page__empty">
          <FileText size={32} />
          <p>Заявок не найдено</p>
        </div>
      ) : (
        <div className="req-page__table-wrap">
          <table className="req-page__table">
            <thead>
              <tr>
                <th>Менеджер</th>
                <th>Бизнес</th>
                <th>Статус</th>
                <th>Дата</th>
                <th>Рассмотрел</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <RequestRow
                  key={req._id}
                  request={req}
                  onView={setViewRequest}
                  onApprove={handleApprove}
                  onReject={setRejectRequest}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Модалка детали ── */}
      {viewRequest && (
        <RequestDetailModal
          request={viewRequest}
          onClose={() => setViewRequest(null)}
          onApprove={handleApprove}
          onReject={(r) => {
            setViewRequest(null);
            setRejectRequest(r);
          }}
        />
      )}

      {/* ── Модалка отклонения ── */}
      {rejectRequest && (
        <RejectModal
          request={rejectRequest}
          onClose={() => setRejectRequest(null)}
        />
      )}
    </div>
  );
}
