import "./DonneesSection.scss";
import { useTranslations } from "next-intl";

const DonneesSection = () => {
  const t = useTranslations("privacy.donnees");

  return (
    <section className="cg-donnees">
      <div className="container">
        <div className="cg-donnees__inner">
          <h2 className="cg-donnees__title">{t("title")}</h2>
          <p className="cg-donnees__intro">{t("intro")}</p>

          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">👤</span>
              <h3>{t("clientsTitle")}</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>{t("clientsGoogleTitle")}</h4>
                <ul>
                  <li>{t("clientsGoogle1")}</li>
                  <li>{t("clientsGoogle2")}</li>
                  <li>{t("clientsGoogle3")}</li>
                  <li>{t("clientsGoogle4")}</li>
                </ul>
              </div>
              <div className="cg-donnees__item">
                <h4>{t("clientsPlatformTitle")}</h4>
                <ul>
                  <li>{t("clientsPlatform1")}</li>
                  <li>{t("clientsPlatform2")}</li>
                  <li>{t("clientsPlatform3")}</li>
                  <li>{t("clientsPlatform4")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">🏪</span>
              <h3>{t("sellersTitle")}</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>{t("sellersPublicTitle")}</h4>
                <ul>
                  <li>{t("sellersPublic1")}</li>
                  <li>{t("sellersPublic2")}</li>
                  <li>{t("sellersPublic3")}</li>
                  <li>{t("sellersPublic4")}</li>
                  <li>{t("sellersPublic5")}</li>
                  <li>{t("sellersPublic6")}</li>
                  <li>{t("sellersPublic7")}</li>
                </ul>
              </div>
              <div className="cg-donnees__item">
                <h4>{t("sellersPrivateTitle")}</h4>
                <ul>
                  <li>{t("sellersPrivate1")}</li>
                  <li>{t("sellersPrivate2")}</li>
                  <li>{t("sellersPrivate3")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">🛠️</span>
              <h3>{t("adminsTitle")}</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>{t("adminsSecureTitle")}</h4>
                <ul>
                  <li>{t("admins1")}</li>
                  <li>{t("admins2")}</li>
                  <li>{t("admins3")}</li>
                  <li>{t("admins4")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">⚙️</span>
              <h3>{t("techTitle")}</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>{t("techAutoTitle")}</h4>
                <ul>
                  <li>{t("tech1")}</li>
                  <li>{t("tech2")}</li>
                  <li>{t("tech3")}</li>
                  <li>{t("tech4")}</li>
                  <li>{t("tech5")}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">🔗</span>
              <h3>{t("tiersTitle")}</h3>
            </div>
            <div className="cg-donnees__tiers">
              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>{t("googleTitle")}</h4>
                  <span className="cg-donnees__tier-role">
                    {t("googleRole")}
                  </span>
                </div>
                <p>{t("googleText")}</p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-donnees__tier-link"
                >
                  {t("googleLink")}
                </a>
              </div>
              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>{t("emailTitle")}</h4>
                  <span className="cg-donnees__tier-role">
                    {t("emailRole")}
                  </span>
                </div>
                <p>{t("emailText")}</p>
              </div>
              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>{t("hostTitle")}</h4>
                  <span className="cg-donnees__tier-role">{t("hostRole")}</span>
                </div>
                <p>{t("hostText")}</p>
              </div>
              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>{t("dbTitle")}</h4>
                  <span className="cg-donnees__tier-role">{t("dbRole")}</span>
                </div>
                <p>{t("dbText")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonneesSection;
