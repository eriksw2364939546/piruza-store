import "./ConservationSection.scss";

const ConservationSection = () => {
  const data = [
    {
      icon: "👤",
      category: "Données clients",
      items: [
        {
          label: "Profil client (nom, email, avatar)",
          duration: "Jusqu'à suppression du compte",
          basis: "Consentement",
        },
        {
          label: "Ville sélectionnée",
          duration: "Jusqu'à modification ou suppression",
          basis: "Intérêt légitime",
        },
        {
          label: "Liste des favoris",
          duration: "Jusqu'à suppression du compte",
          basis: "Consentement",
        },
        {
          label: "Évaluations attribuées",
          duration: "Jusqu'à suppression du compte",
          basis: "Consentement",
        },
      ],
    },
    {
      icon: "🏪",
      category: "Données vendeurs",
      items: [
        {
          label: "Informations publiques du vendeur",
          duration: "Durée de l'abonnement actif + 1 an",
          basis: "Abonnement de référencement",
        },
        {
          label: "Historique des abonnements",
          duration: "10 ans",
          basis: "Obligation légale (comptabilité)",
        },
        {
          label: "Évaluations reçues",
          duration: "Durée de l'abonnement actif + 1 an",
          basis: "Intérêt légitime",
        },
      ],
    },
    {
      icon: "🛠️",
      category: "Données administrateurs et managers",
      items: [
        {
          label: "Données de compte (nom, email)",
          duration: "Durée d'utilisation de la plateforme + 3 ans",
          basis: "Intérêt légitime",
        },
        {
          label: "Historique d'activité",
          duration: "12 mois",
          basis: "Intérêt légitime (sécurité)",
        },
      ],
    },
    {
      icon: "⚙️",
      category: "Données techniques",
      items: [
        {
          label: "Adresse IP et journaux d'accès",
          duration: "12 mois maximum",
          basis: "Intérêt légitime (sécurité)",
        },
        {
          label: "Cookies de session",
          duration: "Durée de la session",
          basis: "Fonctionnement de la plateforme",
        },
        {
          label: "Préférences de navigation (ville choisie)",
          duration: "Jusqu'à effacement par l'utilisateur",
          basis: "Fonctionnement de la plateforme",
        },
      ],
    },
  ];

  return (
    <section className="cg-conservation">
      <div className="container">
        <div className="cg-conservation__inner">
          <h2 className="cg-conservation__title">Conservation des données</h2>

          <p className="cg-conservation__intro">
            Conformément au principe de limitation de la conservation prévu par
            le RGPD (article 5.1.e), nous ne conservons vos données personnelles
            que pour la durée strictement nécessaire aux finalités pour
            lesquelles elles ont été collectées, ou pour répondre à nos
            obligations légales.
          </p>

          {/* Tableau de conservation */}
          {data.map((group, index) => (
            <div key={index} className="cg-conservation__group">
              <div className="cg-conservation__group-header">
                <span className="cg-conservation__group-icon">
                  {group.icon}
                </span>
                <h3>{group.category}</h3>
              </div>
              <div className="cg-conservation__table">
                <div className="cg-conservation__table-header">
                  <span>Donnée</span>
                  <span>Durée de conservation</span>
                  <span>Base légale</span>
                </div>
                {group.items.map((item, i) => (
                  <div key={i} className="cg-conservation__table-row">
                    <span>{item.label}</span>
                    <span className="cg-conservation__duration">
                      {item.duration}
                    </span>
                    <span className="cg-conservation__basis">{item.basis}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notice légale */}
          <div className="cg-conservation__notice">
            <span className="cg-conservation__notice-icon">⚖️</span>
            <div>
              <h3>Obligations légales de conservation</h3>
              <p>
                Certaines données peuvent être conservées au-delà des durées
                indiquées ci-dessus pour répondre à des obligations légales
                françaises et européennes :
              </p>
              <ul>
                <li>
                  <strong>Documents comptables :</strong> 10 ans (article
                  L.123-22 du Code de commerce)
                </li>
                <li>
                  <strong>Données de connexion :</strong> 12 mois (loi n°
                  2004-575 pour la Confiance dans l'Économie Numérique)
                </li>
                <li>
                  <strong>Données relatives aux litiges :</strong> durée de la
                  prescription légale applicable (2 à 5 ans selon la nature du
                  litige)
                </li>
              </ul>
            </div>
          </div>

          {/* Sécurité */}
          <div className="cg-conservation__security">
            <h3>Sécurité des données</h3>
            <div className="cg-conservation__security-grid">
              <div className="cg-conservation__security-item">
                <span>🔐</span>
                <div>
                  <h4>Chiffrement des données sensibles</h4>
                  <p>
                    Les données sensibles sont chiffrées avant leur stockage
                    afin de garantir leur confidentialité.
                  </p>
                </div>
              </div>
              <div className="cg-conservation__security-item">
                <span>🛡️</span>
                <div>
                  <h4>Protection des mots de passe</h4>
                  <p>
                    Aucun mot de passe n'est stocké en clair. Ils sont protégés
                    par des mécanismes conformes aux standards actuels.
                  </p>
                </div>
              </div>
              <div className="cg-conservation__security-item">
                <span>🍪</span>
                <div>
                  <h4>Sessions sécurisées</h4>
                  <p>
                    Les sessions sont gérées via des mécanismes sécurisés
                    protégeant contre les accès non autorisés.
                  </p>
                </div>
              </div>
              <div className="cg-conservation__security-item">
                <span>🚦</span>
                <div>
                  <h4>Protection contre les abus</h4>
                  <p>
                    Des systèmes de sécurité actifs protègent la plateforme
                    contre tout accès non autorisé ou utilisation abusive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConservationSection;
