import "./CookiesSection.scss";

const CookiesSection = () => {
  return (
    <section className="cg-cookies">
      <div className="container">
        <div className="cg-cookies__inner">
          <h2 className="cg-cookies__title">Cookies et stockage local</h2>

          <p className="cg-cookies__intro">
            Piruza Store utilise des cookies et le stockage local pour assurer
            le bon fonctionnement de la plateforme. Conformément à la directive
            ePrivacy et aux recommandations de la CNIL, nous vous informons de
            leur utilisation.
          </p>

          {/* Cookies essentiels */}
          <div className="cg-cookies__category">
            <div className="cg-cookies__category-header">
              <span className="cg-cookies__category-icon">🔐</span>
              <div>
                <h3>Cookies essentiels</h3>
                <span className="cg-cookies__category-badge cg-cookies__category-badge--required">
                  Obligatoires
                </span>
              </div>
            </div>
            <p className="cg-cookies__category-desc">
              Ces cookies sont indispensables au bon fonctionnement de la
              plateforme. Ils permettent de maintenir votre session active et
              sécurisée. Ils ne peuvent pas être désactivés.
            </p>
          </div>

          {/* Stockage local */}
          <div className="cg-cookies__category">
            <div className="cg-cookies__category-header">
              <span className="cg-cookies__category-icon">💾</span>
              <div>
                <h3>Stockage local</h3>
                <span className="cg-cookies__category-badge cg-cookies__category-badge--required">
                  Fonctionnel
                </span>
              </div>
            </div>
            <p className="cg-cookies__category-desc">
              Nous utilisons le stockage local de votre navigateur pour
              mémoriser vos préférences, notamment la ville que vous avez
              sélectionnée. Ces données restent sur votre appareil et ne sont
              pas transmises à nos serveurs.
            </p>
          </div>

          {/* Cookies tiers */}
          <div className="cg-cookies__category">
            <div className="cg-cookies__category-header">
              <span className="cg-cookies__category-icon">🔗</span>
              <div>
                <h3>Cookies tiers</h3>
                <span className="cg-cookies__category-badge cg-cookies__category-badge--third">
                  Services externes
                </span>
              </div>
            </div>
            <p className="cg-cookies__category-desc">
              Lors de la connexion via Google, des cookies tiers peuvent être
              déposés par Google sur votre appareil. Ces cookies sont soumis à
              la politique de confidentialité de Google et échappent au contrôle
              de Piruza Store.
            </p>
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="cg-cookies__link"
            >
              Politique de confidentialité Google →
            </a>
          </div>

          {/* Gestion */}
          <div className="cg-cookies__management">
            <h3>Comment gérer vos cookies ?</h3>
            <p>
              Vous pouvez à tout moment gérer ou supprimer les cookies et
              données de stockage local via les paramètres de votre navigateur.
              Notez que la désactivation des cookies essentiels peut entraîner
              des dysfonctionnements ou votre déconnexion de la plateforme.
            </p>
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
