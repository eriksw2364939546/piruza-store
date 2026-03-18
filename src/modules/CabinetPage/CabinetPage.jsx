"use client";

// ═══════════════════════════════════════════════════════
// CabinetPage — личный кабинет клиента
// src/modules/CabinetPage/CabinetPage.jsx
// ═══════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating/StarRating";
import SellerCard from "@/components/SellerCard/SellerCard";
import { clientApi } from "@/lib/clientApi";
import "./CabinetPage.scss";

const MEDIA_BASE = process.env.NEXT_PUBLIC_URL || "http://localhost:7000";
const getImg = (path) => (path ? `${MEDIA_BASE}${path}` : null);

const TABS = [
  { key: "profile", label: "👤 Профиль" },
  { key: "favorites", label: "♥ Избранные" },
  { key: "ratings", label: "⭐ Мои оценки" },
];

// ── Вкладка профиля ───────────────────────────────────

function ProfileTab({ profile, onCityChange, cities, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [cityId, setCityId] = useState(profile.city?._id || profile.city || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await clientApi.patch("/clients/city", { city: cityId });
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
      {/* Аватар + имя */}
      <div className="cabinet-profile__hero">
        <div className="cabinet-profile__avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.name} />
          ) : (
            <span>{profile.name?.charAt(0)?.toUpperCase() || "?"}</span>
          )}
        </div>
        <div>
          <h2 className="cabinet-profile__name">{profile.name}</h2>
          <p className="cabinet-profile__email">{profile.email}</p>
        </div>
      </div>

      {/* Поля */}
      <div className="cabinet-profile__fields">
        <div className="cabinet-profile__field">
          <span className="cabinet-profile__label">Email</span>
          <span className="cabinet-profile__value">{profile.email}</span>
        </div>

        <div className="cabinet-profile__field">
          <span className="cabinet-profile__label">Город</span>
          {editing ? (
            <div className="cabinet-profile__city-edit">
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                className="cabinet-profile__select"
              >
                <option value="">— Выберите город —</option>
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
                {loading ? "..." : "Сохранить"}
              </button>
              <button
                className="cabinet-btn cabinet-btn--ghost"
                onClick={() => setEditing(false)}
              >
                Отмена
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
                ✏️ Изменить
              </button>
            </div>
          )}
        </div>

        <div className="cabinet-profile__field">
          <span className="cabinet-profile__label">Зарегистрирован</span>
          <span className="cabinet-profile__value cabinet-profile__value--muted">
            {new Date(profile.createdAt).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {success && (
        <div className="cabinet-profile__success">✅ Город обновлён</div>
      )}

      <div className="cabinet-profile__logout">
        <button className="cabinet-btn cabinet-btn--ghost" onClick={onLogout}>
          🚪 Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

// ── Вкладка избранных ─────────────────────────────────

function FavoritesTab({ favorites, onRemove }) {
  if (!favorites?.length) {
    return (
      <div className="cabinet-empty">
        <span className="cabinet-empty__icon">♥</span>
        <p>У вас пока нет избранных продавцов</p>
      </div>
    );
  }

  return (
    <div className="cabinet-grid">
      {favorites.map((seller) => (
        <SellerCard key={seller._id} seller={seller} onRemove={onRemove} />
      ))}
    </div>
  );
}

// ── Вкладка оценок ────────────────────────────────────

function RatingsTab({ ratings }) {
  if (!ratings?.length) {
    return (
      <div className="cabinet-empty">
        <span className="cabinet-empty__icon">⭐</span>
        <p>Вы ещё не оценили ни одного продавца</p>
      </div>
    );
  }

  return (
    <div className="cabinet-ratings">
      {ratings.map((r) => (
        <div key={r._id} className="cabinet-rating-row">
          <div className="cabinet-rating-row__seller">
            {r.seller?.logo ? (
              <img
                src={getImg(r.seller.logo)}
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
                {new Date(r.createdAt).toLocaleDateString("ru-RU", {
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
  );
}

// ── Главный компонент ─────────────────────────────────

export default function CabinetPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [ratings, setRatings] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Проверяем токен и загружаем данные
  const loadData = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const [profileRes, favRes, ratingsRes, citiesRes] =
        await Promise.allSettled([
          clientApi.get("/clients/profile"),
          clientApi.get("/clients/favorites"),
          clientApi.get("/clients/ratings"),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/cities/active`).then((r) =>
            r.json(),
          ),
        ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      else {
        localStorage.removeItem("token");
        router.replace("/login");
        return;
      }

      if (favRes.status === "fulfilled") setFavorites(favRes.value.data || []);
      if (ratingsRes.status === "fulfilled") {
        const r = ratingsRes.value;
        // Поддерживаем оба формата: массив или { data: [] }
        setRatings(Array.isArray(r.data) ? r.data : Array.isArray(r) ? r : []);
      }
      if (citiesRes.status === "fulfilled")
        setCities(citiesRes.value.data || []);
    } catch {
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRemoveFavorite = async (sellerId) => {
    try {
      await clientApi.post(`/clients/favorites/${sellerId}`);
      setFavorites((prev) => prev.filter((s) => s._id !== sellerId));
    } catch (e) {
      alert(e.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="cabinet-loading">
        <div className="cabinet-loading__spinner" />
        <p>Загрузка...</p>
      </div>
    );
  }

  if (error) {
    return <div className="cabinet-error">{error}</div>;
  }

  if (!profile) return null;

  return (
    <div className="cabinet">
      {/* ── Контент ── */}
      <main className="cabinet-main">
        {/* Статистика */}
        <div className="cabinet-stats">
          <div className="cabinet-stat">
            <span className="cabinet-stat__num">{favorites.length}</span>
            <span className="cabinet-stat__label">Избранных</span>
          </div>
          <div className="cabinet-stat">
            <span className="cabinet-stat__num">{ratings?.length ?? 0}</span>
            <span className="cabinet-stat__label">Оценок</span>
          </div>
        </div>

        {/* Табы */}
        <div className="cabinet-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`cabinet-tab ${activeTab === tab.key ? "cabinet-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Контент таба */}
        <div className="cabinet-content">
          {activeTab === "profile" && (
            <ProfileTab
              profile={profile}
              cities={cities}
              onCityChange={loadData}
              onLogout={handleLogout}
            />
          )}
          {activeTab === "favorites" && (
            <FavoritesTab
              favorites={favorites}
              onRemove={handleRemoveFavorite}
            />
          )}
          {activeTab === "ratings" && <RatingsTab ratings={ratings} />}
        </div>
      </main>
    </div>
  );
}
