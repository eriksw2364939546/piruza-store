"use client";

// ═══════════════════════════════════════════════════════
// Admin Dashboard — клиентский компонент
// Admin видит: продавцов (активные города/категории), заявки, менеджеров/администраторов
// НЕ видит: неактивные города/категории
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import "../dashboard.shared.scss";

// ─── Карточка статистики ───
const StatCard = ({ label, value, hint, accent }) => (
  <div className={`dashboard__stat-card dashboard__stat-card--${accent}`}>
    <span className="dashboard__stat-label">{label}</span>
    <span className="dashboard__stat-value">{value}</span>
    {hint && <span className="dashboard__stat-hint">{hint}</span>}
  </div>
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

// ─── Строка менеджера (компактная) ───
const UserRow = ({ item }) => (
  <tr>
    <td>
      <div className="dashboard__user-name">{item.manager.name}</div>
      <div className="dashboard__user-email">{item.manager.email}</div>
    </td>
    <td>{item.sellers.total}</td>
    <td>{item.sellers.active}</td>
    <td>
      {item.requests.pending > 0 ? (
        <span className="dashboard__badge dashboard__badge--pending">
          {item.requests.pending}
        </span>
      ) : (
        <span className="dashboard__badge dashboard__badge--none">0</span>
      )}
    </td>
  </tr>
);

// ─── Главный компонент ───
const AdminDashboard = ({ overview, managers, sellersByStatus, userStats }) => {
  const { sellers, requests } = overview;

  return (
    <div>
      {/* ── Продавцы ── */}
      <p className="dashboard__section-title">Продавцы</p>
      <div className="dashboard__stats-grid dashboard__stats-grid--4">
        <StatCard label="Всего" value={sellers.total} accent="total" />
        <StatCard label="Активных" value={sellers.active} accent="active" />
        <StatCard label="Черновики" value={sellers.draft} accent="draft" />
        <StatCard label="Истёкших" value={sellers.expired} accent="expired" />
      </div>

      {/* ── Заявки + Пользователи ── */}
      <div className="dashboard__two-col dashboard__two-col--top">
        {/* Заявки */}
        <div>
          <p className="dashboard__section-title">Заявки менеджеров</p>
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

        {/* Менеджеры + Администраторы */}
        <div>
          <p className="dashboard__section-title">Команда</p>
          <div className="dashboard__stats-grid dashboard__stats-grid--2">
            <Link
              href="/admins-piruza/admin-panel/managers"
              className="dashboard__stat-card dashboard__stat-card--total dashboard__stat-card--link"
            >
              <span className="dashboard__stat-label">Менеджеры</span>
              <span className="dashboard__stat-value">
                {userStats?.managers ?? 0}
              </span>
              <span className="dashboard__stat-hint">Смотреть всех →</span>
            </Link>
            <Link
              href="/admins-piruza/admin-panel/admins"
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
      <div className="dashboard__block-header">
        <p className="dashboard__section-title" style={{ marginBottom: 0 }}>
          Активность менеджеров
        </p>
        <Link
          href="/admins-piruza/admin-panel/managers"
          className="dashboard__link-all"
        >
          Все менеджеры →
        </Link>
      </div>

      {managers.length === 0 ? (
        <div className="dashboard__empty">Менеджеры не найдены</div>
      ) : (
        <div className="dashboard__table-wrap">
          <table className="dashboard__table">
            <thead>
              <tr>
                <th>Менеджер</th>
                <th>Продавцов</th>
                <th>Активных</th>
                <th>Ожид. заявок</th>
              </tr>
            </thead>
            <tbody>
              {managers.map((item) => (
                <UserRow key={item.manager.id} item={item} />
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
              {sellersByStatus.active.length}
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
              {sellersByStatus.draft.length}
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
              {sellersByStatus.expired.length}
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
              {sellersByStatus.inactive.length}
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

export default AdminDashboard;
