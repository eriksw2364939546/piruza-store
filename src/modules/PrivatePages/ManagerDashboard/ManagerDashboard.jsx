"use client";

// ═══════════════════════════════════════════════════════
// Manager Dashboard — клиентский компонент
// Manager видит: только своих продавцов и свои заявки
// НЕ видит: других менеджеров, неактивные города/категории
// ═══════════════════════════════════════════════════════

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
      {seller.city?.name} ·{" "}
      {seller.globalCategories?.map((c) => c.name).join(", ")}
    </span>
    {seller.activationEndDate && (
      <span className="dashboard__seller-meta">
        До: {new Date(seller.activationEndDate).toLocaleDateString("ru-RU")}
      </span>
    )}
  </div>
);

// ─── Главный компонент ───
const ManagerDashboard = ({ overview, sellersByStatus }) => {
  const { sellers, requests } = overview;

  return (
    <div>
      {/* ── Мои продавцы ── */}
      <p className="dashboard__section-title">Мои продавцы</p>
      <div className="dashboard__stats-grid dashboard__stats-grid--4">
        <StatCard label="Всего" value={sellers.total} accent="total" />
        <StatCard label="Активных" value={sellers.active} accent="active" />
        <StatCard label="Черновики" value={sellers.draft} accent="draft" />
        <StatCard label="Истёкших" value={sellers.expired} accent="expired" />
      </div>

      {/* ── Мои заявки ── */}
      <p className="dashboard__section-title">Мои заявки</p>
      <div className="dashboard__stats-grid dashboard__stats-grid--3">
        <StatCard
          label="Ожидают"
          value={requests.pending}
          accent="pending"
          hint="Ждут одобрения"
        />
        <StatCard label="Одобрено" value={requests.approved} accent="active" />
        <StatCard
          label="Отклонено"
          value={requests.rejected}
          accent="expired"
        />
      </div>

      <div className="dashboard__divider" />

      {/* ── Мои продавцы по статусам ── */}
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

export default ManagerDashboard;
