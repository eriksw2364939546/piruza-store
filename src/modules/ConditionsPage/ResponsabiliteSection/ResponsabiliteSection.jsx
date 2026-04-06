"use client";
import "./ResponsabiliteSection.scss";
import { useTranslations } from "next-intl";

const ResponsabiliteSection = () => {
  const t = useTranslations("conditions.responsabilite");

  const cards = [
    { icon: "🛒", titleKey: "card1Title", textKey: "card1Text" },
    { icon: "🍽️", titleKey: "card2Title", textKey: "card2Text" },
    { icon: "📦", titleKey: "card3Title", textKey: "card3Text" },
    { icon: "⚖️", titleKey: "card4Title", textKey: "card4Text" },
    { icon: "⭐", titleKey: "card5Title", textKey: "card5Text" },
    { icon: "🌐", titleKey: "card6Title", textKey: "card6Text" },
  ];

  return (
    <section className="cg-responsabilite">
      <div className="container">
        <div className="cg-responsabilite__inner">
          <h2 className="cg-responsabilite__title">{t("title")}</h2>
          <p className="cg-responsabilite__intro">{t("intro")}</p>

          <div className="cg-responsabilite__grid">
            {cards.map((card, i) => (
              <div key={i} className="cg-responsabilite__card">
                <span className="cg-responsabilite__card-icon">
                  {card.icon}
                </span>
                <h3>{t(card.titleKey)}</h3>
                <p>{t(card.textKey)}</p>
              </div>
            ))}
          </div>

          <div className="cg-responsabilite__notice">
            <span className="cg-responsabilite__notice-icon">⚠️</span>
            <p>{t("notice")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsabiliteSection;
