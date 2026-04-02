import "./DonneesSection.scss";

const DonneesSection = () => {
  return (
    <section className="cg-donnees">
      <div className="container">
        <div className="cg-donnees__inner">
          <h2 className="cg-donnees__title">Données collectées</h2>

          <p className="cg-donnees__intro">
            Dans le cadre du fonctionnement de la plateforme Piruza Store, nous
            collectons uniquement les données strictement nécessaires à la
            fourniture de nos services, conformément au principe de minimisation
            des données prévu par le RGPD.
          </p>

          {/* Clients */}
          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">👤</span>
              <h3>Données des clients</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>Via la connexion Google</h4>
                <ul>
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Photo de profil</li>
                  <li>Identifiant unique de connexion</li>
                </ul>
              </div>
              <div className="cg-donnees__item">
                <h4>Via l'utilisation de la plateforme</h4>
                <ul>
                  <li>Ville sélectionnée</li>
                  <li>Liste des vendeurs ajoutés en favoris</li>
                  <li>Évaluations attribuées aux vendeurs (note 1 à 5)</li>
                  <li>Date d'inscription et dernière connexion</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Vendeurs */}
          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">🏪</span>
              <h3>Données des vendeurs</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>Informations publiques (affichées sur la plateforme)</h4>
                <ul>
                  <li>Nom du commerce</li>
                  <li>Description de l'activité</li>
                  <li>Ville et adresse</li>
                  <li>Numéro de téléphone professionnel</li>
                  <li>Lien de contact WhatsApp professionnel</li>
                  <li>Logo et photo de couverture</li>
                  <li>Catégories et produits proposés</li>
                </ul>
              </div>
              <div className="cg-donnees__item">
                <h4>Informations de gestion (non publiques)</h4>
                <ul>
                  <li>Dates d'activation et d'expiration de l'abonnement</li>
                  <li>Statut du compte</li>
                  <li>Historique des évaluations reçues</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Managers/Admins */}
          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">🛠️</span>
              <h3>Données des administrateurs et managers</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>Données stockées de façon sécurisée</h4>
                <ul>
                  <li>Nom et prénom</li>
                  <li>Adresse email professionnelle</li>
                  <li>
                    Mot de passe (stocké de façon sécurisée, jamais en clair)
                  </li>
                  <li>Rôle dans la plateforme</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Techniques */}
          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">⚙️</span>
              <h3>Données techniques</h3>
            </div>
            <div className="cg-donnees__items">
              <div className="cg-donnees__item">
                <h4>Collectées automatiquement</h4>
                <ul>
                  <li>Adresse IP (pour la sécurité de la plateforme)</li>
                  <li>Type de navigateur et système d'exploitation</li>
                  <li>Pages consultées et durée de visite</li>
                  <li>Token de session sécurisé</li>
                  <li>Ville choisie (stockée localement sur votre appareil)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tiers */}
          <div className="cg-donnees__category">
            <div className="cg-donnees__category-header">
              <span className="cg-donnees__category-icon">🔗</span>
              <h3>Données transmises à des tiers</h3>
            </div>
            <div className="cg-donnees__tiers">
              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>Google LLC</h4>
                  <span className="cg-donnees__tier-role">
                    Authentification
                  </span>
                </div>
                <p>
                  Lors de la connexion via Google, vos données
                  d'authentification sont traitées par Google conformément à
                  leur politique de confidentialité. Piruza Store ne stocke pas
                  votre mot de passe Google.
                </p>
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-donnees__tier-link"
                >
                  Politique de confidentialité Google →
                </a>
              </div>

              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>Service d'envoi d'emails</h4>
                  <span className="cg-donnees__tier-role">Notifications</span>
                </div>
                <p>
                  Les adresses email des managers et administrateurs sont
                  transmises à notre prestataire d'envoi d'emails uniquement
                  pour l'envoi de notifications liées à la plateforme
                  (activation, expiration, demandes). Ce prestataire agit en
                  tant que sous-traitant au sens du RGPD.
                </p>
              </div>

              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>Hébergeur (Union Européenne)</h4>
                  <span className="cg-donnees__tier-role">Hébergement</span>
                </div>
                <p>
                  Notre infrastructure est hébergée sur des serveurs situés au
                  sein de l'Union Européenne, garantissant la conformité au RGPD
                  sans transfert de données hors de l'UE. Notre hébergeur agit
                  en tant que sous-traitant au sens du RGPD.
                </p>
              </div>

              <div className="cg-donnees__tier-item">
                <div className="cg-donnees__tier-header">
                  <h4>Service de base de données</h4>
                  <span className="cg-donnees__tier-role">
                    Stockage des données
                  </span>
                </div>
                <p>
                  Les données de la plateforme sont stockées sur un service de
                  base de données sécurisé. Les données sensibles sont chiffrées
                  avant leur stockage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonneesSection;
