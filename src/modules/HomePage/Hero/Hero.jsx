"use client";

import "./Hero.scss";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Hero = ({ categories = [] }) => {
  const t = useTranslations("hero");
  const router = useRouter();

  const handleCategory = (slug) => {
    router.push(`/sellers?category=${slug}`);
  };

  return (
    <section className="hero">
      <div className="hero__bg" />

      <div className="container">
        <div className="hero__content">
          <div className="hero__text">
            <span className="hero__eyebrow">{t("eyebrow")}</span>
            <h1 className="hero__title">
              {t("title")}
              <br />
              <em>{t("titleEm")}</em>
            </h1>
            <p className="hero__subtitle">{t("subtitle")}</p>
          </div>

          {categories.length > 0 && (
            <div className="hero__categories">
              <p className="hero__categories-label">{t("categories")}</p>
              <div className="hero__categories-list">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className="hero__cat-btn"
                    onClick={() => handleCategory(cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
