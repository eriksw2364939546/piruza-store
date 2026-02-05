// app/privacy-policy/sections/DataCollectionSection.js
import "./DataCollectionSection.scss";

const DataCollectionSection = () => {
  return (
    <section className="data-collection-section">
      <h2 className="data-collection-section__title">Données collectées</h2>

      <div className="data-collection-section__content">
        <p>
          Nous collectons uniquement les informations nécessaires au traitement
          de votre commande :
        </p>

        <ul className="data-collection-section__list">
          <li>
            <strong>Informations de contact :</strong> Nom, numéro de téléphone
          </li>
          <li>
            <strong>Informations de commande :</strong> Produit(s)
            sélectionné(s), quantité
          </li>
          <li>
            <strong>Informations de livraison :</strong> Station de métro
            choisie à Marseille (pour la remise en main propre)
          </li>
          <li>
            <strong>Données de communication :</strong> Contenu des messages
            échangés via notre formulaire
          </li>
          <li>
            <strong>Données techniques :</strong> Adresse IP, type de
            navigateur, informations sur le dispositif (collectées
            automatiquement pour des raisons de sécurité)
          </li>
        </ul>

        <p className="data-collection-section__note">
          <strong>Note importante :</strong> Nous ne collectons pas de données
          de paiement en ligne. Les transactions sont effectuées en main propre
          lors de la livraison.
        </p>
      </div>
    </section>
  );
};

export default DataCollectionSection;
