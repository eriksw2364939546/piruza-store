"use client";

// ═══════════════════════════════════════════════════════
// ManagerRequestsPage — заявки менеджера
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Store,
  ArrowRight,
} from "lucide-react";
import { createRequestAction } from "@/app/actions/request.actions";
import "./ManagerRequestsPage.scss";
import Pagination from "@/components/Pagination/Pagination";

const STATUS_MAP = {
  pending: { label: "На рассмотрении", cls: "pending", Icon: Clock },
  approved: { label: "Одобрена", cls: "approved", Icon: CheckCircle },
  rejected: { label: "Отклонена", cls: "rejected", Icon: XCircle },
};

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

// ── Модалка создания заявки ───────────────────────────

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
      className="mreq-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="mreq-modal__box">
        <div className="mreq-modal__header">
          <span className="mreq-modal__title">Новая заявка на продавца</span>
          <button className="mreq-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        <p className="mreq-modal__hint">
          После отправки заявка поступит на рассмотрение Owner'у или Admin'у.
          При одобрении вы сможете заполнить полный профиль продавца.
        </p>
        <form action={formAction} className="mreq-modal__form">
          {state.success === false && (
            <div className="mreq-modal__error">{state.message}</div>
          )}
          <div className="mreq-modal__field">
            <label>Название продавца *</label>
            <input
              name="name"
              type="text"
              placeholder="Например: Boulangerie Parisienne"
              required
              autoFocus
            />
          </div>
          <div className="mreq-modal__field">
            <label>Тип бизнеса *</label>
            <input
              name="businessType"
              type="text"
              placeholder="Например: Пекарня, Ресторан, Магазин"
              required
            />
          </div>
          <div className="mreq-modal__field">
            <label>Юридические данные *</label>
            <textarea
              name="legalInfo"
              rows={3}
              placeholder="Например: SIRET: 123 456 789 00010"
              required
              minLength={5}
            />
          </div>
          <div className="mreq-modal__actions">
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

// ── Карточка заявки ───────────────────────────────────

function RequestCard({ request }) {
  const router = useRouter();
  const s = STATUS_MAP[request.status] || STATUS_MAP.pending;
  const { Icon } = s;

  const canCreate = request.status === "approved" && !request.isUsed;

  return (
    <div className={`mreq-card mreq-card--${s.cls}`}>
      <div className="mreq-card__head">
        <div className="mreq-card__info">
          <div className="mreq-card__name">{request.name}</div>
          <div className="mreq-card__type">{request.businessType}</div>
        </div>
        <span className={`mreq-badge mreq-badge--${s.cls}`}>
          <Icon size={13} />
          {s.label}
        </span>
      </div>

      {request.legalInfo && (
        <div className="mreq-card__legal">
          <FileText size={13} />
          {request.legalInfo}
        </div>
      )}

      {request.status === "rejected" && request.rejectionReason && (
        <div className="mreq-card__reason">
          <XCircle size={13} />
          Причина отказа: {request.rejectionReason}
        </div>
      )}

      {request.status === "approved" && request.isUsed && (
        <div className="mreq-card__approved-hint">
          <CheckCircle size={13} />
          Заявка использована — продавец создан в системе
        </div>
      )}

      {canCreate && (
        <div className="mreq-card__action">
          <div className="mreq-card__action-hint">
            <CheckCircle size={14} />
            Заявка одобрена! Заполните профиль продавца.
          </div>
          <button
            className="sellers-btn sellers-btn--primary mreq-card__create-btn"
            onClick={() => router.push("/admins-piruza/manager/sellers/create")}
          >
            <Store size={15} />
            Создать продавца
            <ArrowRight size={15} />
          </button>
        </div>
      )}

      <div className="mreq-card__date">{formatDate(request.createdAt)}</div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────

export default function ManagerRequestsPage({
  requests = [],
  pagination = null,
  counts = {},
  initialStatus = "",
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const handleFilterChange = useCallback(
    (key) => {
      const newStatus = key === "all" ? "" : key;
      setStatusFilter(newStatus);
      const qs = newStatus ? `?status=${newStatus}` : "";
      router.push(`${pathname}${qs}`);
    },
    [router, pathname],
  );

  const totalCount = counts.all ?? requests.length;

  const FILTERS_LIST = [
    { key: "all", label: "Все", count: totalCount },
    {
      key: "pending",
      label: "На рассмотрении",
      count:
        counts.pending ?? requests.filter((r) => r.status === "pending").length,
    },
    {
      key: "approved",
      label: "Одобренные",
      count:
        counts.approved ??
        requests.filter((r) => r.status === "approved").length,
    },
    {
      key: "rejected",
      label: "Отклонённые",
      count:
        counts.rejected ??
        requests.filter((r) => r.status === "rejected").length,
    },
  ];

  return (
    <div className="mreq-page">
      {/* ── Шапка ── */}
      <div className="mreq-page__head">
        <div>
          <h2 className="mreq-page__title">Мои заявки</h2>
          <p className="mreq-page__subtitle">Всего: {totalCount}</p>
        </div>
        <button
          className="sellers-btn sellers-btn--primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Новая заявка
        </button>
      </div>

      {/* ── Фильтры через URL ── */}
      {totalCount > 0 && (
        <div className="mreq-filters">
          {FILTERS_LIST.map((f) => (
            <button
              key={f.key}
              className={`mreq-filter ${(!statusFilter && f.key === "all") || statusFilter === f.key ? "mreq-filter--active" : ""}`}
              onClick={() => handleFilterChange(f.key)}
            >
              {f.label}
              {f.count > 0 && (
                <span className="mreq-filter__count">{f.count}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Список заявок ── */}
      {totalCount === 0 ? (
        <div className="mreq-page__empty">
          <FileText size={40} />
          <p>У вас ещё нет заявок.</p>
          <p className="mreq-page__empty-hint">
            Создайте заявку чтобы добавить нового продавца.
          </p>
          <button
            className="sellers-btn sellers-btn--primary"
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Создать заявку
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className="mreq-page__empty">
          <p>Нет заявок в этой категории</p>
        </div>
      ) : (
        <div className="mreq-list">
          {requests.map((req) => (
            <RequestCard key={req._id} request={req} />
          ))}
        </div>
      )}
      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? pagination?.pages ?? 1}
        onPageChange={(page) => {
          const params = new URLSearchParams();
          if (statusFilter) params.set("status", statusFilter);
          if (page > 1) params.set("page", page);
          router.push(`${pathname}?${params.toString()}`);
        }}
      />

      {/* ── Модалка ── */}
      {showModal && <CreateRequestModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
