"use client";

import "./Sellers.scss";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SellerPublicCard from "@/components/SellerPublicCard/SellerPublicCard";
import { useTranslations } from "next-intl";

const SkeletonCard = () => (
  <div className="seller-card seller-card--skeleton">
    <div className="seller-card__cover seller-card__cover--skeleton" />
    <div className="seller-card__body">
      <div className="seller-card__skeleton-line" />
      <div className="seller-card__skeleton-line seller-card__skeleton-line--short" />
    </div>
  </div>
);

const SellersSection = ({ eyebrow, titleKey, sellers, loading, allHref }) => {
  const t = useTranslations("sellers");

  const handleSeeAll = () => {
    sessionStorage.setItem("home_scroll", window.scrollY.toString());
    sessionStorage.setItem("sellers_referrer", window.location.pathname);
  };

  return (
    <div className="sellers__section">
      <div className="sellers__head">
        <div>
          <span className="sellers__eyebrow">{eyebrow}</span>
          <h2 className="sellers__title">
            {t.rich(titleKey, {
              em: (chunks) => <em key="em">{chunks}</em>,
            })}
          </h2>
        </div>
        <Link
          href={allHref}
          className="sellers__see-all"
          onClick={handleSeeAll}
        >
          {t("seeAll")} <ArrowRight size={16} />
        </Link>
      </div>

      <div className="sellers__grid">
        {loading ? (
          [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
        ) : sellers.length === 0 ? (
          <p className="sellers__empty">{t("empty")}</p>
        ) : (
          sellers.map((s) => <SellerPublicCard key={s._id} seller={s} />)
        )}
      </div>
    </div>
  );
};

const Sellers = ({ sellers = [], city }) => {
  const t = useTranslations("sellers");
  const citySlug = city?.slug || null;
  const cityName = city?.name || "";
  const loading = !city;

  const byCitySlug = useMemo(() => {
    if (!citySlug) return sellers;
    return sellers.filter((s) => (s.city?.slug || s.city) === citySlug);
  }, [sellers, citySlug]);

  const popular = useMemo(() => {
    return [...byCitySlug]
      .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0))
      .slice(0, 8);
  }, [byCitySlug]);

  const local = useMemo(() => {
    return [...byCitySlug].sort(() => Math.random() - 0.5).slice(0, 8);
  }, [byCitySlug]);

  return (
    <section className="sellers">
      <div className="container">
        <SellersSection
          eyebrow={t("popularEyebrow")}
          titleKey="popularTitle"
          sellers={popular}
          loading={loading}
          allHref={
            citySlug
              ? `/sellers?city=${citySlug}&sort=views`
              : "/sellers?sort=views"
          }
        />

        <SellersSection
          eyebrow={
            cityName
              ? t("localEyebrow", { city: cityName })
              : t("localEyebrowDefault")
          }
          titleKey="localTitle"
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
