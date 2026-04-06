"use client";
import "./HeaderSection.scss";
import { useTranslations } from "next-intl";

const HeaderSection = () => {
  const t = useTranslations("conditions.header");

  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="cg-header">
      <div className="container">
        <div className="cg-header__inner">
          <span className="cg-header__eyebrow">{t("eyebrow")}</span>
          <h1 className="cg-header__title">{t("title")}</h1>
          <p className="cg-header__date">
            {t("lastUpdate")} {formattedDate}
          </p>
          <div className="cg-header__intro">
            <p dangerouslySetInnerHTML={{ __html: t("intro1") }} />
            <p>{t("intro2")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderSection;
