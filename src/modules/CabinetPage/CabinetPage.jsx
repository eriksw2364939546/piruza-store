"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import StarRating from "@/components/StarRating/StarRating";
import SellerPublicCard from "@/components/SellerPublicCard/SellerPublicCard";
import Pagination from "@/components/Pagination/Pagination";
import { getImageUrl } from "@/lib/utils";
import {
  toggleFavoriteAction,
  logoutClientAction,
  updateClientCityAction,
} from "@/app/actions/client.actions";
import { useTranslations } from "next-intl";
import "./CabinetPage.scss";

function ProfileTab({ profile, onCityChange, cities }) {
  const t = useTranslations("cabinet");
  const [editing, setEditing] = useState(false);
  const [cityId, setCityId] = useState(profile.city?._id || profile.city || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateClientCityAction(cityId);
      const selectedCity = cities.find((c) => c._id === cityId);
      if (selectedCity) {
        localStorage.setItem(
          "piruza_city",
          JSON.stringify({
            _id: selectedCity._id,
            name: selectedCity.name,
            slug: selectedCity.slug,
          }),
        );
      }
      setSuccess(true);
      setEditing(false);
      onCityChange();
      setTimeout(() => setSuccess(false), 2000);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cabinet-profile">
      <div className="cabinet-profile__hero">
        <div className="cabinet-profile__avatar">
          {profile.avatar && !avatarError ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              referrerPolicy="no-referrer"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <span>{profile.name?.charAt(0)?.toUpperCase() || "?"}</span>
          )}
        </div>
        <div>
          <h2 className="cabinet-profile__name">{profile.name}</h2>
          <p className="cabinet-profile__email">{profile.email}</p>
        </div>
      </div>

      <div className="cabinet-profile__fields">
        <div className="cabinet-profile__field">
          <span className="cabinet-profile__label">{t("profileEmail")}</span>
          <span className="cabinet-profile__value">{profile.email}</span>
        </div>

        <div className="cabinet-profile__field">
          <span className="cabinet-profile__label">{t("profileCity")}</span>
          {editing ? (
            <div className="cabinet-profile__city-edit">
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="cabinet-profile__select"
              >
                <option value="">{t("profileCityPlaceholder")}</option>
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <button
                className="cabinet-btn cabinet-btn--primary"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? t("profileLoading") : t("profileSave")}
              </button>
              <button
                className="cabinet-btn cabinet-btn--ghost"
                onClick={() => setEditing(false)}
              >
                {t("profileCancel")}
              </button>
            </div>
          ) : (
            <div className="cabinet-profile__city-view">
              <span className="cabinet-profile__value">
                {profile.city?.name || "—"}
              </span>
              <button
                className="cabinet-btn cabinet-btn--ghost cabinet-btn--sm"
                onClick={() => setEditing(true)}
              >
                {t("profileEdit")}
              </button>
            </div>
          )}
        </div>

        <div className="cabinet-profile__field">
          <span className="cabinet-profile__label">
            {t("profileCreatedAt")}
          </span>
          <span className="cabinet-profile__value cabinet-profile__value--muted">
            {new Date(profile.createdAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {success && (
        <div className="cabinet-profile__success">{t("profileSuccess")}</div>
      )}
    </div>
  );
}

function FavoritesTab({ favorites, pagination, onRemove, onPage }) {
  const t = useTranslations("cabinet");

  if (!favorites?.length) {
    return (
      <div className="cabinet-empty">
        <span className="cabinet-empty__icon">♥</span>
        <p>{t("favEmpty")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="cabinet-grid">
        {favorites.map((seller) => (
          <SellerPublicCard key={seller._id} seller={seller} />
        ))}
      </div>
      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.pages ?? 1}
        onPageChange={onPage}
      />
    </>
  );
}

function RatingsTab({ ratings, pagination, onPage }) {
  const t = useTranslations("cabinet");

  if (!ratings?.length) {
    return (
      <div className="cabinet-empty">
        <span className="cabinet-empty__icon">⭐</span>
        <p>{t("ratEmpty")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="cabinet-ratings">
        {ratings.map((r) => (
          <div key={r._id} className="cabinet-rating-row">
            <div className="cabinet-rating-row__seller">
              {r.seller?.logo ? (
                <img
                  src={getImageUrl(r.seller.logo)}
                  alt={r.seller.name}
                  className="cabinet-rating-row__logo"
                />
              ) : (
                <div className="cabinet-rating-row__logo-placeholder">
                  {r.seller?.name?.charAt(0) || "S"}
                </div>
              )}
              <div>
                <div className="cabinet-rating-row__name">
                  {r.seller?.name || "—"}
                </div>
                <div className="cabinet-rating-row__date">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <StarRating value={r.rating} size={18} />
          </div>
        ))}
      </div>
      <Pagination
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.totalPages ?? pagination?.pages ?? 1}
        onPageChange={onPage}
      />
    </>
  );
}

export default function CabinetPage({
  profile,
  favorites = [],
  favPagination = null,
  ratings = [],
  ratPagination = null,
  cities = [],
  initialTab = "profile",
  initialFavPage = 1,
  initialRatPage = 1,
}) {
  const t = useTranslations("cabinet");
  const router = useRouter();
  const pathname = usePathname();

  const TABS = [
    { key: "profile", label: t("tabProfile") },
    { key: "favorites", label: t("tabFavorites") },
    { key: "ratings", label: t("tabRatings") },
  ];

  const [activeTab, setActiveTab] = useState(initialTab);
  const [favsList, setFavsList] = useState(favorites);

  useEffect(() => {
    setFavsList(favorites);
  }, [favorites]);

  const pushUrl = useCallback(
    (tab, favPage, ratPage) => {
      const params = new URLSearchParams();
      if (tab !== "profile") params.set("tab", tab);
      if (favPage > 1) params.set("favPage", favPage);
      if (ratPage > 1) params.set("ratPage", ratPage);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`, { scroll: false });
    },
    [router, pathname],
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    pushUrl(tab, initialFavPage, initialRatPage);
  };

  const handleFavPage = (page) => pushUrl(activeTab, page, initialRatPage);
  const handleRatPage = (page) => pushUrl(activeTab, initialFavPage, page);

  const handleRemoveFavorite = async (sellerId) => {
    const res = await toggleFavoriteAction(sellerId);
    if (res.success) {
      setFavsList((prev) => prev.filter((s) => s._id !== sellerId));
    }
  };

  const handleLogout = async () => {
    await logoutClientAction();
  };

  const handleCityChange = () => {
    window.location.reload();
  };

  return (
    <div className="cabinet">
      <main className="cabinet-main">
        <div className="cabinet-stats">
          <div className="cabinet-stat">
            <span className="cabinet-stat__num">
              {favPagination?.total ?? favsList.length}
            </span>
            <span className="cabinet-stat__label">{t("statFavorites")}</span>
          </div>
          <div className="cabinet-stat">
            <span className="cabinet-stat__num">
              {ratPagination?.total ?? ratings.length}
            </span>
            <span className="cabinet-stat__label">{t("statRatings")}</span>
          </div>
        </div>

        <div className="cabinet-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`cabinet-tab ${activeTab === tab.key ? "cabinet-tab--active" : ""}`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="cabinet-logout">
          <button
            className="cabinet-btn cabinet-btn--ghost"
            onClick={handleLogout}
          >
            {t("logout")}
          </button>
        </div>

        <div className="cabinet-content">
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              cities={cities}
              onCityChange={handleCityChange}
            />
          )}
          {activeTab === "favorites" && (
            <FavoritesTab
              favorites={favsList}
              pagination={favPagination}
              onRemove={handleRemoveFavorite}
              onPage={handleFavPage}
            />
          )}
          {activeTab === "ratings" && (
            <RatingsTab
              ratings={ratings}
              pagination={ratPagination}
              onPage={handleRatPage}
            />
          )}
        </div>
      </main>
    </div>
  );
}
