"use client";

// ═══════════════════════════════════════════════════════
// ClientDetailPage — детальная страница клиента
// /admins-piruza/owner/clients/[id]
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Star,
  Heart,
  Shield,
  ShieldOff,
  Trash2,
} from "lucide-react";
import {
  toggleClientActiveAction,
  deleteClientAction,
} from "@/app/actions/client.actions";
import Pagination from "@/components/Pagination/Pagination";
import { getImageUrl } from "@/lib/utils";
import "./ClientsPage.scss";

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Список оценок ─────────────────────────────────────

function RatingsList({
  ratings,
  ratingsPagination,
  ratingFilter,
  onFilterChange,
  onPage,
}) {
  return (
    <div className="client-detail__section">
      <div className="client-detail__section-head">
        <h3 className="client-detail__section-title">
          Оценки ({ratingsPagination?.total ?? ratings.length})
        </h3>
        <div className="client-detail__rating-filters">
          <button
            className={`client-detail__rf-btn ${!ratingFilter ? "client-detail__rf-btn--active" : ""}`}
            onClick={() => onFilterChange("")}
          >
            Все
          </button>
          {[5, 4, 3, 2, 1].map((s) => (
            <button
              key={s}
              className={`client-detail__rf-btn ${ratingFilter === String(s) ? "client-detail__rf-btn--active" : ""}`}
              onClick={() => onFilterChange(String(s))}
            >
              <Star size={11} /> {s}
            </button>
          ))}
        </div>
      </div>

      {ratings.length === 0 ? (
        <div className="client-detail__empty">
          {ratingFilter
            ? `Нет оценок на ${ratingFilter} ⭐`
            : "Оценок пока нет"}
        </div>
      ) : (
        <div className="client-detail__ratings-list">
          {ratings.map((r) => (
            <div key={r._id} className="client-detail__rating-row">
              <div className="client-detail__rating-seller">
                {r.seller?.logo ? (
                  <img
                    src={getImageUrl(r.seller.logo)}
                    alt={r.seller.name}
                    className="client-detail__seller-logo"
                  />
                ) : (
                  <div className="client-detail__seller-placeholder">
                    {r.seller?.name?.charAt(0) || "S"}
                  </div>
                )}
                <div>
                  <div className="client-detail__seller-name">
                    {r.seller?.name || "—"}
                  </div>
                  <div className="client-detail__rating-date">
                    {formatDateTime(r.createdAt)}
                  </div>
                </div>
              </div>
              <div className="client-detail__stars">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i <= r.rating
                        ? "client-detail__star--filled"
                        : "client-detail__star--empty"
                    }
                  />
                ))}
                <span className="client-detail__rating-num">{r.rating}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination
        currentPage={ratingsPagination?.page ?? 1}
        totalPages={
          ratingsPagination?.pages ?? ratingsPagination?.totalPages ?? 1
        }
        onPageChange={onPage}
      />
    </div>
  );
}

// ── Список избранных ──────────────────────────────────

function FavoritesList({ favorites, favoritesPagination, onPage }) {
  return (
    <div className="client-detail__section">
      <h3 className="client-detail__section-title">
        Избранные ({favoritesPagination?.total ?? favorites?.length ?? 0})
      </h3>
      {!favorites?.length ? (
        <div className="client-detail__empty">Нет избранных продавцов</div>
      ) : (
        <>
          <div className="client-detail__favorites-list">
            {favorites.map((seller) => (
              <Link
                key={seller._id}
                href={`/admins-piruza/owner/sellers/${seller.slug}`}
                className="client-detail__fav-row"
              >
                {seller.logo ? (
                  <img
                    src={getImageUrl(seller.logo)}
                    alt={seller.name}
                    className="client-detail__seller-logo"
                  />
                ) : (
                  <div className="client-detail__seller-placeholder">
                    {seller.name?.charAt(0) || "S"}
                  </div>
                )}
                <div className="client-detail__fav-info">
                  <div className="client-detail__seller-name">
                    {seller.name}
                  </div>
                  {seller.averageRating > 0 && (
                    <div className="client-detail__fav-rating">
                      <Star size={12} className="client-detail__star--filled" />
                      {Number(seller.averageRating).toFixed(1)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Pagination
            currentPage={favoritesPagination?.page ?? 1}
            totalPages={favoritesPagination?.pages ?? 1}
            onPageChange={onPage}
          />
        </>
      )}
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────

export default function ClientDetailPage({
  client,
  ratings = [],
  ratingsPagination,
  favorites = [],
  favoritesPagination,
  ratingFilter,
  activeTab,
  basePath,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isActive, setIsActive] = useState(client.isActive);
  const [blocking, startBlocking] = useTransition();
  const [deleting, startDeleting] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Удалить клиента "${client.name}"? Это действие необратимо.`))
      return;
    startDeleting(async () => {
      const result = await deleteClientAction(client._id);
      if (result.success) {
        toast.success("Клиент удалён");
        router.push(basePath);
      } else {
        toast.error(result.message);
      }
    });
  };

  const pushUrl = useCallback(
    (tab, ratPage, favPage, rating) => {
      const params = new URLSearchParams();
      params.set("tab", tab);
      if (rating) params.set("rating", rating);
      if (ratPage > 1) params.set("ratPage", ratPage);
      if (favPage > 1) params.set("favPage", favPage);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const handleTabChange = (tab) => pushUrl(tab, 1, 1, ratingFilter);
  const handleRatingFilter = (val) => pushUrl("ratings", 1, 1, val);
  const handleRatPage = (page) => pushUrl(activeTab, page, 1, ratingFilter);
  const handleFavPage = (page) => pushUrl(activeTab, 1, page, ratingFilter);

  const handleToggleActive = () => {
    startBlocking(async () => {
      const result = await toggleClientActiveAction(client._id);
      if (result.success) {
        setIsActive(result.data.isActive);
        toast.success(
          result.data.isActive ? "Клиент разблокирован" : "Клиент заблокирован",
        );
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="client-detail">
      {/* ── Навигация ── */}
      <div className="client-detail__nav">
        <Link href={basePath} className="client-detail__back">
          <ArrowLeft size={16} /> Все клиенты
        </Link>
      </div>

      {/* ── Шапка ── */}
      <div className="client-detail__head">
        <div className="client-detail__avatar-wrap">
          {client.avatar ? (
            <img
              src={client.avatar}
              alt={client.name}
              className="client-detail__avatar-img"
            />
          ) : (
            <div className="client-detail__avatar-placeholder">
              {client.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div className="client-detail__info">
          <h2 className="client-detail__name">{client.name}</h2>
          <div className="client-detail__meta">
            <span>
              <Mail size={13} /> {client.email}
            </span>
            {client.city && (
              <span>
                <MapPin size={13} /> {client.city.name}
              </span>
            )}
            <span>
              <Calendar size={13} /> {formatDate(client.createdAt)}
            </span>
          </div>
          <span
            className={`client-detail__status ${isActive ? "client-detail__status--active" : "client-detail__status--blocked"}`}
          >
            {isActive ? "Активен" : "Заблокирован"}
          </span>
        </div>
        <div className="client-detail__actions">
          <button
            className={`sellers-btn ${isActive ? "sellers-btn--warning" : "sellers-btn--success"}`}
            onClick={handleToggleActive}
            disabled={blocking}
          >
            {blocking ? (
              "..."
            ) : isActive ? (
              <>
                <ShieldOff size={14} /> Заблокировать
              </>
            ) : (
              <>
                <Shield size={14} /> Разблокировать
              </>
            )}
          </button>

          <button
            className="sellers-btn sellers-btn--danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              "..."
            ) : (
              <>
                <Trash2 size={14} /> Удалить
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Статистика ── */}
      <div className="client-detail__stats">
        <div className="client-detail__stat">
          <span className="client-detail__stat-num">
            {ratingsPagination?.total ?? ratings.length}
          </span>
          <span className="client-detail__stat-label">Оценок</span>
        </div>
        <div className="client-detail__stat">
          <span className="client-detail__stat-num">
            {favoritesPagination?.total ?? client.favorites?.length ?? 0}
          </span>
          <span className="client-detail__stat-label">Избранных</span>
        </div>
      </div>

      {/* ── Табы ── */}
      <div className="client-detail__tabs">
        <button
          className={`client-detail__tab ${activeTab === "ratings" ? "client-detail__tab--active" : ""}`}
          onClick={() => handleTabChange("ratings")}
        >
          <Star size={14} /> Оценки
        </button>
        <button
          className={`client-detail__tab ${activeTab === "favorites" ? "client-detail__tab--active" : ""}`}
          onClick={() => handleTabChange("favorites")}
        >
          <Heart size={14} /> Избранные
        </button>
      </div>

      {/* ── Контент таба ── */}
      <div className="client-detail__tab-content">
        {activeTab === "ratings" ? (
          <RatingsList
            ratings={ratings}
            ratingsPagination={ratingsPagination}
            ratingFilter={ratingFilter}
            onFilterChange={handleRatingFilter}
            onPage={handleRatPage}
          />
        ) : (
          <FavoritesList
            favorites={favorites}
            favoritesPagination={favoritesPagination}
            onPage={handleFavPage}
          />
        )}
      </div>
    </div>
  );
}
