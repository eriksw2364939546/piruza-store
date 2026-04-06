import "./DroitsSection.scss";
import { useTranslations } from "next-intl";

const DroitsSection = () => {
  const t = useTranslations("privacy.droits");

  const rights = [
    { icon: "👁️", titleKey: "right1Title", descKey: "right1Desc" },
    { icon: "✏️", titleKey: "right2Title", descKey: "right2Desc" },
    { icon: "🗑️", titleKey: "right3Title", descKey: "right3Desc" },
    { icon: "✋", titleKey: "right4Title", descKey: "right4Desc" },
    { icon: "📤", titleKey: "right5Title", descKey: "right5Desc" },
    { icon: "⏸️", titleKey: "right6Title", descKey: "right6Desc" },
  ];

  return (
    <section className="cg-droits">
      <div className="container">
        <div className="cg-droits__inner">
          <h2 className="cg-droits__title">{t("title")}</h2>
          <p className="cg-droits__intro">{t("intro")}</p>

          <div className="cg-droits__grid">
            {rights.map((right, index) => (
              <div key={index} className="cg-droits__card">
                <span className="cg-droits__card-icon">{right.icon}</span>
                <h3>{t(right.titleKey)}</h3>
                <p>{t(right.descKey)}</p>
              </div>
            ))}
          </div>

          <div className="cg-droits__how-to">
            <h3>{t("howTitle")}</h3>
            <p>{t("howText")}</p>
            <ul>
              <li>{t("how1")}</li>
              <li>{t("how2")}</li>
              <li>{t("how3")}</li>
              <li>{t("how4")}</li>
            </ul>
            <p>{t("howCommit")}</p>
          </div>

          <div className="cg-droits__deletion">
            <div className="cg-droits__deletion-icon">🗑️</div>
            <div>
              <h3>{t("deleteTitle")}</h3>
              <p>{t("deleteText")}</p>
              <ul>
                <li>{t("delete1")}</li>
                <li>{t("delete2")}</li>
                <li>{t("delete3")}</li>
              </ul>
              <p className="cg-droits__deletion-note">{t("deleteNote")}</p>
            </div>
          </div>

          <div className="cg-droits__cnil">
            <span className="cg-droits__cnil-icon">⚖️</span>
            <div>
              <h3>{t("cnilTitle")}</h3>
              <p>
                {t("cnilText")} <strong>{t("cnilName")}</strong>
                {t("cnilSuffix")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DroitsSection;
