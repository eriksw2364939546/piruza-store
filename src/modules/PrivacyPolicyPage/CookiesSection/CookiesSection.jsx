import "./CookiesSection.scss";
import { useTranslations } from "next-intl";

const CookiesSection = () => {
  const t = useTranslations("privacy.cookies");

  return (
    <section className="cg-cookies">
      <div className="container">
        <div className="cg-cookies__inner">
          <h2 className="cg-cookies__title">{t("title")}</h2>
          <p className="cg-cookies__intro">{t("intro")}</p>

          <div className="cg-cookies__category">
            <div className="cg-cookies__category-header">
              <span className="cg-cookies__category-icon">🔐</span>
              <div>
                <h3>{t("essentialTitle")}</h3>
                <span className="cg-cookies__category-badge cg-cookies__category-badge--required">
                  {t("essentialBadge")}
                </span>
              </div>
            </div>
            <p className="cg-cookies__category-desc">{t("essentialDesc")}</p>
          </div>

          <div className="cg-cookies__category">
            <div className="cg-cookies__category-header">
              <span className="cg-cookies__category-icon">💾</span>
              <div>
                <h3>{t("localTitle")}</h3>
                <span className="cg-cookies__category-badge cg-cookies__category-badge--required">
                  {t("localBadge")}
                </span>
              </div>
            </div>
            <p className="cg-cookies__category-desc">{t("localDesc")}</p>
          </div>

          <div className="cg-cookies__category">
            <div className="cg-cookies__category-header">
              <span className="cg-cookies__category-icon">🔗</span>
              <div>
                <h3>{t("thirdTitle")}</h3>
                <span className="cg-cookies__category-badge cg-cookies__category-badge--third">
                  {t("thirdBadge")}
                </span>
              </div>
            </div>
            <p className="cg-cookies__category-desc">{t("thirdDesc")}</p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="cg-cookies__link"
            >
              {t("googleLink")}
            </a>
          </div>

          <div className="cg-cookies__management">
            <h3>{t("manageTitle")}</h3>
            <p>{t("manageText")}</p>
            <div className="cg-cookies__browsers">
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome →
              </a>
              <a
                href="https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox →
              </a>
              <a
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari →
              </a>
              <a
                href="https://support.microsoft.com/fr-fr/windows/supprimer-et-g%C3%A9rer-les-cookies"
                target="_blank"
                rel="noopener noreferrer"
              >
                Edge →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CookiesSection;
