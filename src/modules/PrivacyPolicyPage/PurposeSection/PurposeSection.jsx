// app/privacy-policy/sections/PurposeSection.js
import "./PurposeSection.scss";

const PurposeSection = () => {
  return (
    <section className="purpose-section">
      <h2 className="purpose-section__title">Finalités du traitement</h2>

      <div className="purpose-section__content">
        <p>Vos données sont utilisées exclusivement pour :</p>

        <div className="purpose-section__grid">
          <div className="purpose-section__card">
            <div className="purpose-section__card-icon">📋</div>
            <h3>Traitement des commandes</h3>
            <p>Traiter et gérer votre commande de douceurs artisanales</p>
          </div>

          <div className="purpose-section__card">
            <div className="purpose-section__card-icon">📱</div>
            <h3>Communication</h3>
            <p>
              Vous contacter pour confirmer la commande et organiser la
              livraison
            </p>
          </div>

          <div className="purpose-section__card">
            <div className="purpose-section__card-icon">🚚</div>
            <h3>Organisation de la livraison</h3>
            <p>
              Coordonner la remise en main propre à la station de métro choisie
            </p>
          </div>

          <div className="purpose-section__card">
            <div className="purpose-section__card-icon">⚖️</div>
            <h3>Obligations légales</h3>
            <p>Respecter nos obligations comptables et fiscales en France</p>
          </div>
        </div>

        <div className="purpose-section__legal-basis">
          <h4>Base légale du traitement (RGPD) :</h4>
          <ul>
            <li>Exécution d'un contrat (traitement de votre commande)</li>
            <li>Intérêt légitime (communication liée à la commande)</li>
            <li>Obligation légale (conservation des données comptables)</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PurposeSection;
