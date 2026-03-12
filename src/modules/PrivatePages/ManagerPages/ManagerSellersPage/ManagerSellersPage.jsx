"use client";

// ═══════════════════════════════════════════════════════
// ManagerSellersPage — продавцы менеджера
// Manager видит только СВОИХ продавцов
// Может редактировать / создавать заявки на новых
// НЕ может: активировать / деактивировать / удалять
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useEffect, useTransition } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Store,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Plus,
} from "lucide-react";
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

const REQUEST_STATUS = {
  pending: {
    label: "На рассмотрении",
    cls: "pending",
    icon: <Clock size={12} />,
  },
  approved: {
    label: "Одобрена",
    cls: "approved",
    icon: <CheckCircle size={12} />,
  },
  rejected: {
    label: "Отклонена",
    cls: "rejected",
    icon: <XCircle size={12} />,
  },
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
              src={`${process.env.NEXT_PUBLIC_API_URL}${seller.logo}`}
              alt={seller.name}
              className="msellers-row__logo"
            />
          ) : (
            <div className="msellers-row__logo-placeholder">
              {seller.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
          )}
          <div>
            <div className="msellers-row__name">{seller.name}</div>
            <div className="msellers-row__type">
              {seller.businessType || "—"}
            </div>
          </div>
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
          {/* Редактирование только в статусе draft */}
          {seller.status === "draft" && (
            <Link
              href={`${SELLERS_BASE}/${seller.slug}/edit`}
              className="sellers-btn sellers-btn--sm sellers-btn--ghost"
              title="Редактировать"
            >
              ✏️
            </Link>
          )}
          {/* ❌ Нет кнопок активации/деактивации */}
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

// ─── Блок последних заявок ────────────────────────────
function RequestsPreview({ requests }) {
  if (!requests || requests.length === 0) return null;

  return (
    <div className="msellers-requests">
      <h3 className="msellers-requests__title">
        <FileText size={16} /> Мои заявки
      </h3>
      <div className="msellers-requests__list">
        {requests.slice(0, 5).map((req) => {
          const r = REQUEST_STATUS[req.status] || REQUEST_STATUS.pending;
          return (
            <div
              key={req._id}
              className={`msellers-req msellers-req--${r.cls}`}
            >
              <div className="msellers-req__name">{req.name}</div>
              <div className="msellers-req__meta">
                <span className="msellers-req__type">{req.businessType}</span>
                <span
                  className={`msellers-req__status msellers-req__status--${r.cls}`}
                >
                  {r.icon} {r.label}
                </span>
                {req.status === "rejected" && req.rejectionReason && (
                  <span className="msellers-req__reason">
                    Причина: {req.rejectionReason}
                  </span>
                )}
              </div>
              <div className="msellers-req__date">
                {formatDate(req.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
      <Link
        href="/admins-piruza/manager/requests"
        className="msellers-requests__all"
      >
        Все заявки →
      </Link>
    </div>
  );
}

// ─── Статистика ───────────────────────────────────────
function Stats({ sellers }) {
  const counts = {
    active: sellers.filter((s) => s.status === "active").length,
    draft: sellers.filter((s) => s.status === "draft").length,
    expired: sellers.filter((s) => s.status === "expired").length,
    inactive: sellers.filter((s) => s.status === "inactive").length,
  };

  return (
    <div className="msellers-stats">
      {Object.entries(STATUS_LABELS).map(([key, val]) => (
        <div key={key} className={`msellers-stat msellers-stat--${val.cls}`}>
          <span className="msellers-stat__num">{counts[key]}</span>
          <span className="msellers-stat__label">{val.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Главный компонент ────────────────────────────────
export default function ManagerSellersPage({ sellers = [], requests = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = sellers.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="msellers-page">
      {/* ── Шапка ── */}
      <div className="msellers-page__head">
        <div>
          <h2 className="msellers-page__title">Мои продавцы</h2>
          <p className="msellers-page__subtitle">Всего: {sellers.length}</p>
        </div>
        <button
          className="sellers-btn sellers-btn--primary"
          onClick={() => setShowModal(true)}
        >
          <Plus size={16} /> Новая заявка
        </button>
      </div>

      {/* ── Статистика ── */}
      {sellers.length > 0 && <Stats sellers={sellers} />}

      {/* ── Последние заявки ── */}
      <RequestsPreview requests={requests} />

      {/* ── Поиск ── */}
      {sellers.length > 0 && (
        <div className="msellers-page__search">
          <input
            type="text"
            placeholder="Поиск по названию или городу..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="msellers-page__search-input"
          />
        </div>
      )}

      {/* ── Таблица ── */}
      {sellers.length === 0 ? (
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
      ) : filtered.length === 0 ? (
        <div className="msellers-page__empty">
          <p>Ничего не найдено по запросу «{search}»</p>
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
              {filtered.map((seller) => (
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
