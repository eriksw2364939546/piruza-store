"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../dashboard.shared.scss";

// ─── Блок управления сайтом ───
const SiteModeBlock = ({ siteMode }) => {
  const [mode, setMode] = useState(siteMode);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToggle = async () => {
    const newMode = mode === "coming_soon" ? "live" : "coming_soon";
    setLoading(true);
    try {
      console.log("🔄 Отправляем запрос:", newMode);
      const res = await fetch("/api/proxy/settings/site-mode", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: newMode }),
        credentials: "include",
      });
      console.log("📡 Статус ответа:", res.status);
      const json = await res.json();
      console.log("📦 Ответ:", json);
      if (res.ok) {
        document.cookie = `site_mode=${newMode};path=/;max-age=31536000`;
        console.log("🍪 Cookie установлен:", document.cookie);
        setMode(newMode);
        router.refresh();
      }
    } catch (err) {
      console.error("❌ Ошибка:", err);
    } finally {
      setLoading(false);
    }
  };

  const isLive = mode === "live";

  return (
    <div className="dashboard__block" style={{ marginBottom: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <p className="dashboard__block-title" style={{ marginBottom: 4 }}>
            🌐 Режим сайта
          </p>
          <p style={{ fontSize: 13, color: "#999", margin: 0 }}>
            {isLive
              ? "Сайт работает в обычном режиме"
              : 'Отображается страница "Скоро открытие" для посетителей'}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            className={`dashboard__badge dashboard__badge--${isLive ? "active" : "pending"}`}
          >
            {isLive ? "🟢 Работает" : "🟡 Coming Soon"}
          </span>
          <button
            className={`sellers-btn sellers-btn--${isLive ? "warning" : "success"}`}
            onClick={handleToggle}
            disabled={loading}
          >
            {loading
              ? "..."
              : isLive
                ? "⏸ Включить Welcome"
                : "🚀 Запустить сайт"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Карточка статистики ───
const StatCard = ({ label, value, hint, accent }) => (
  <div className={`dashboard__stat-card dashboard__stat-card--${accent}`}>
    <span className="dashboard__stat-label">{label}</span>
    <span className="dashboard__stat-value">{value}</span>
    {hint && <span className="dashboard__stat-hint">{hint}</span>}
  </div>
);

// ─── Строка таблицы менеджеров ───
const ManagerRow = ({ item }) => (
  <tr>
    <td>{item.manager.name}</td>
    <td>{item.manager.email}</td>
    <td>{item.sellers.total}</td>
    <td>{item.sellers.active}</td>
    <td>
      <span className="dashboard__badge dashboard__badge--pending">
        {item.requests.pending}
      </span>
    </td>
    <td>{item.requests.approved}</td>
    <td>{item.requests.rejected}</td>
  </tr>
);

// ─── Карточка продавца ───
const SellerItem = ({ seller }) => (
  <div className="dashboard__seller-item">
    <span className="dashboard__seller-name">{seller.name}</span>
    <span className="dashboard__seller-meta">
      {seller.city?.name}
      {seller.globalCategories?.length > 0 &&
        ` · ${seller.globalCategories.map((c) => c.name).join(", ")}`}
    </span>
    {seller.activationEndDate && (
      <span className="dashboard__seller-meta">
        До: {new Date(seller.activationEndDate).toLocaleDateString("ru-RU")}
      </span>
    )}
  </div>
);

// ─── Главный компонент ───
const OwnerDashboard = ({
  overview,
  managers,
  sellersByStatus,
  userStats,
  siteMode,
}) => {
  const { sellers, requests } = overview;

  return (
    <div>
      {/* ── Режим сайта ── */}
      <SiteModeBlock siteMode={siteMode} />
      {/* ── Продавцы ── */}
      <p className="dashboard__section-title">Продавцы в системе</p>
      <div className="dashboard__stats-grid dashboard__stats-grid--4">
        <StatCard label="Всего" value={sellers.total} accent="total" />
        <StatCard label="Активных" value={sellers.active} accent="active" />
        <StatCard label="Черновики" value={sellers.draft} accent="draft" />
        <StatCard label="Истёкших" value={sellers.expired} accent="expired" />
      </div>

      {/* ── Заявки + Команда ── */}
      <div className="dashboard__two-col dashboard__two-col--top">
        {/* Заявки */}
        <div>
          <p className="dashboard__section-title">Заявки</p>
          <div className="dashboard__stats-grid dashboard__stats-grid--3">
            <StatCard
              label="Ожидают"
              value={requests.pending}
              accent="pending"
              hint="Требуют внимания"
            />
            <StatCard
              label="Одобрено"
              value={requests.approved}
              accent="active"
            />
            <StatCard
              label="Отклонено"
              value={requests.rejected}
              accent="expired"
            />
          </div>
        </div>

        {/* Команда */}
        <div>
          <p className="dashboard__section-title">Команда</p>
          <div className="dashboard__stats-grid dashboard__stats-grid--2">
            <Link
              href="/admins-piruza/owner/managers"
              className="dashboard__stat-card dashboard__stat-card--total dashboard__stat-card--link"
            >
              <span className="dashboard__stat-label">Менеджеры</span>
              <span className="dashboard__stat-value">
                {userStats?.managers ?? 0}
              </span>
              <span className="dashboard__stat-hint">Смотреть всех →</span>
            </Link>
            <Link
              href="/admins-piruza/owner/admins"
              className="dashboard__stat-card dashboard__stat-card--draft dashboard__stat-card--link"
            >
              <span className="dashboard__stat-label">Администраторы</span>
              <span className="dashboard__stat-value">
                {userStats?.admins ?? 0}
              </span>
              <span className="dashboard__stat-hint">Смотреть всех →</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard__divider" />

      {/* ── Таблица менеджеров ── */}
      <p className="dashboard__section-title">Статистика по менеджерам</p>
      {managers.length === 0 ? (
        <div className="dashboard__empty">Менеджеры не найдены</div>
      ) : (
        <div className="dashboard__table-wrap">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Менеджер</th>
                <th>Email</th>
                <th>Продавцов</th>
                <th>Активных</th>
                <th>Ожид. заявок</th>
                <th>Одобрено</th>
                <th>Отклонено</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((item) => (
                <ManagerRow key={item.manager.id} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="dashboard__divider" />

      {/* ── Продавцы по статусам ── */}
      <p className="dashboard__section-title">Продавцы по статусам</p>
      <div className="dashboard__two-col">
        <div className="dashboard__block">
          <p className="dashboard__block-title">
            Активные
            <span
              className="dashboard__badge dashboard__badge--active"
              style={{ marginLeft: 8 }}
            >
              {sellersByStatus.totals?.active ?? sellersByStatus.active.length}
            </span>
          </p>
          {sellersByStatus.active.length === 0 ? (
            <div className="dashboard__empty">Нет активных</div>
          ) : (
            <div className="dashboard__sellers-grid">
              {sellersByStatus.active.map((s) => (
                <SellerItem key={s._id} seller={s} />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard__block">
          <p className="dashboard__block-title">
            Черновики
            <span
              className="dashboard__badge dashboard__badge--draft"
              style={{ marginLeft: 8 }}
            >
              {sellersByStatus.totals?.draft ?? sellersByStatus.draft.length}
            </span>
          </p>
          {sellersByStatus.draft.length === 0 ? (
            <div className="dashboard__empty">Нет черновиков</div>
          ) : (
            <div className="dashboard__sellers-grid">
              {sellersByStatus.draft.map((s) => (
                <SellerItem key={s._id} seller={s} />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard__block">
          <p className="dashboard__block-title">
            Истёкшие
            <span
              className="dashboard__badge dashboard__badge--expired"
              style={{ marginLeft: 8 }}
            >
              {sellersByStatus.totals?.expired ??
                sellersByStatus.expired.length}
            </span>
          </p>
          {sellersByStatus.expired.length === 0 ? (
            <div className="dashboard__empty">Нет истёкших</div>
          ) : (
            <div className="dashboard__sellers-grid">
              {sellersByStatus.expired.map((s) => (
                <SellerItem key={s._id} seller={s} />
              ))}
            </div>
          )}
        </div>

        <div className="dashboard__block">
          <p className="dashboard__block-title">
            Неактивные
            <span
              className="dashboard__badge dashboard__badge--inactive"
              style={{ marginLeft: 8 }}
            >
              {sellersByStatus.totals?.inactive ??
                sellersByStatus.inactive.length}
            </span>
          </p>
          {sellersByStatus.inactive.length === 0 ? (
            <div className="dashboard__empty">Нет неактивных</div>
          ) : (
            <div className="dashboard__sellers-grid">
              {sellersByStatus.inactive.map((s) => (
                <SellerItem key={s._id} seller={s} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
