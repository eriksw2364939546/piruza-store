"use client";

import "./Sellers.scss";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SellerPublicCard from "@/components/SellerPublicCard/SellerPublicCard";

// ── Скелетон ─────────────────────────────────────────

const SkeletonCard = () => (
  <div className="seller-card seller-card--skeleton">
    <div className="seller-card__cover seller-card__cover--skeleton" />
    <div className="seller-card__body">
      <div className="seller-card__skeleton-line" />
      <div className="seller-card__skeleton-line seller-card__skeleton-line--short" />
    </div>
  </div>
);

// ── Секция ────────────────────────────────────────────

const SellersSection = ({ eyebrow, title, sellers, loading, allHref }) => {
  const handleSeeAll = () => {
    // Сохраняем текущий скролл и referrer в момент клика
    sessionStorage.setItem("home_scroll", window.scrollY.toString());
    sessionStorage.setItem("sellers_referrer", "/");
  };

  return (
    <div className="sellers__section">
      <div className="sellers__head">
        <div>
          <span className="sellers__eyebrow">{eyebrow}</span>
          <h2
            className="sellers__title"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
        <Link
          href={allHref}
          className="sellers__see-all"
          onClick={handleSeeAll}
        >
          Voir tous <ArrowRight size={16} />
        </Link>
      </div>

      <div className="sellers__grid">
        {loading ? (
          [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
        ) : sellers.length === 0 ? (
          <p className="sellers__empty">Aucun vendeur disponible.</p>
        ) : (
          sellers.map((s) => <SellerPublicCard key={s._id} seller={s} />)
        )}
      </div>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────

const Sellers = ({ sellers = [], city }) => {
  const citySlug = city?.slug || null;
  const cityName = city?.name || "";
  const loading = !city;

  const byCitySlug = useMemo(() => {
    if (!citySlug) return sellers;
    return sellers.filter((s) => (s.city?.slug || s.city) === citySlug);
  }, [sellers, citySlug]);

  const popular = useMemo(() => {
    const sorted = [...byCitySlug]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 4);

    return sorted;
  }, [byCitySlug]);

  const local = useMemo(() => {
    return [...byCitySlug].sort(() => Math.random() - 0.5).slice(0, 4);
  }, [byCitySlug]);

  return (
    <section className="sellers">
      <div className="container">
        <SellersSection
          eyebrow="Les plus visités"
          title="Populaires"
          sellers={popular}
          loading={loading}
          allHref={
            citySlug
              ? `/sellers?city=${citySlug}&sort=views`
              : "/sellers?sort=views"
          }
        />

        <SellersSection
          eyebrow={cityName ? `À ${cityName}` : "Près de vous"}
          title={`Vendeurs <em>locaux</em>`}
          sellers={local}
          loading={loading}
          allHref={
            citySlug
              ? `/sellers?city=${citySlug}&sort=random`
              : "/sellers?sort=random"
          }
        />
      </div>
    </section>
  );
};

export default Sellers;
