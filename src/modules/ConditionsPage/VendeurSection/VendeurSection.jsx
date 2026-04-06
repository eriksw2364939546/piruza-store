"use client";
import "./VendeurSection.scss";
import { useTranslations } from "next-intl";

const VendeurSection = () => {
  const t = useTranslations("conditions.vendeur");

  const obligations = [
    { icon: "📋", titleKey: "oblig1Title", textKey: "oblig1Text" },
    { icon: "🧾", titleKey: "oblig2Title", textKey: "oblig2Text" },
    { icon: "🍽️", titleKey: "oblig3Title", textKey: "oblig3Text" },
    { icon: "🏷️", titleKey: "oblig4Title", textKey: "oblig4Text" },
  ];

  return (
    <section className="cg-vendeur">
      <div className="container">
        <div className="cg-vendeur__inner">
          <h2 className="cg-vendeur__title">{t("title")}</h2>

          <div className="cg-vendeur__alert">
            <span className="cg-vendeur__alert-icon">⚠️</span>
            <div>
              <h3>{t("alertTitle")}</h3>
              <p>{t("alertText")}</p>
            </div>
          </div>

          <div className="cg-vendeur__block">
            <h3>{t("minTitle")}</h3>
            <p>{t("minText")}</p>
          </div>

          <div className="cg-vendeur__statuts">
            <h3>{t("statutsTitle")}</h3>
            <div className="cg-vendeur__statuts-grid">
              <div className="cg-vendeur__statut-card cg-vendeur__statut-card--recommended">
                <span className="cg-vendeur__statut-badge">
                  {t("recommended")}
                </span>
                <h4>{t("microTitle")}</h4>
                <p>{t("microText")}</p>
                <a
                  href="https://www.autoentrepreneur.urssaf.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-vendeur__statut-link"
                >
                  {t("microLink")}
                </a>
              </div>
              <div className="cg-vendeur__statut-card">
                <h4>{t("eurlTitle")}</h4>
                <p>{t("eurlText")}</p>
              </div>
              <div className="cg-vendeur__statut-card">
                <h4>{t("sarlTitle")}</h4>
                <p>{t("sarlText")}</p>
              </div>
            </div>
          </div>

          <div className="cg-vendeur__block">
            <h3>{t("obligationsTitle")}</h3>
            <div className="cg-vendeur__obligations">
              {obligations.map((o, i) => (
                <div key={i} className="cg-vendeur__obligation-item">
                  <span className="cg-vendeur__obligation-icon">{o.icon}</span>
                  <div>
                    <h4>{t(o.titleKey)}</h4>
                    <p>{t(o.textKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cg-vendeur__block">
            <h3>{t("refTitle")}</h3>
            <p>{t("refText")}</p>
          </div>

          <div className="cg-vendeur__disclaimer">
            <p>{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendeurSection;
