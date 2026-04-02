import "./DroitsSection.scss";

const DroitsSection = () => {
  const rights = [
    {
      icon: "👁️",
      title: "Droit d'accès",
      description:
        "Vous pouvez demander à consulter l'ensemble des données personnelles que nous détenons vous concernant.",
    },
    {
      icon: "✏️",
      title: "Droit de rectification",
      description:
        "Vous pouvez demander la correction de données inexactes ou incomplètes vous concernant.",
    },
    {
      icon: "🗑️",
      title: "Droit à l'effacement",
      description:
        "Vous pouvez demander la suppression de vos données personnelles, sous réserve de nos obligations légales de conservation.",
    },
    {
      icon: "✋",
      title: "Droit d'opposition",
      description:
        "Vous pouvez vous opposer au traitement de vos données personnelles pour des motifs légitimes.",
    },
    {
      icon: "📤",
      title: "Droit à la portabilité",
      description:
        "Vous pouvez recevoir vos données dans un format structuré, couramment utilisé et lisible par machine.",
    },
    {
      icon: "⏸️",
      title: "Droit à la limitation",
      description:
        "Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances prévues par le RGPD.",
    },
  ];

  return (
    <section className="cg-droits">
      <div className="container">
        <div className="cg-droits__inner">
          <h2 className="cg-droits__title">Vos droits</h2>

          <p className="cg-droits__intro">
            Conformément au Règlement Général sur la Protection des Données
            (RGPD — Règlement UE 2016/679) et à la loi française « Informatique
            et Libertés » du 6 janvier 1978 modifiée, vous disposez des droits
            suivants concernant vos données personnelles :
          </p>

          {/* Grille des droits */}
          <div className="cg-droits__grid">
            {rights.map((right, index) => (
              <div key={index} className="cg-droits__card">
                <span className="cg-droits__card-icon">{right.icon}</span>
                <h3>{right.title}</h3>
                <p>{right.description}</p>
              </div>
            ))}
          </div>

          {/* Comment exercer */}
          <div className="cg-droits__how-to">
            <h3>Comment exercer vos droits ?</h3>
            <p>
              Pour exercer l'un de ces droits, veuillez nous contacter par email
              à l'adresse indiquée dans la section Contact. Merci de préciser
              dans votre demande :
            </p>
            <ul>
              <li>Votre nom et prénom</li>
              <li>L'adresse email associée à votre compte</li>
              <li>Le droit que vous souhaitez exercer</li>
              <li>
                Tout élément permettant de vérifier votre identité si nécessaire
              </li>
            </ul>
            <p>
              Nous nous engageons à répondre à votre demande dans un délai d'un
              mois à compter de sa réception, conformément à l'article 12 du
              RGPD.
            </p>
          </div>

          {/* Suppression compte */}
          <div className="cg-droits__deletion">
            <div className="cg-droits__deletion-icon">🗑️</div>
            <div>
              <h3>Suppression de votre compte client</h3>
              <p>
                Si vous souhaitez supprimer votre compte Piruza Store, vous
                pouvez en faire la demande par email. Suite à votre demande,
                nous supprimerons dans un délai de 30 jours :
              </p>
              <ul>
                <li>Votre profil et vos données personnelles</li>
                <li>Votre liste de favoris</li>
                <li>L'historique de vos évaluations</li>
              </ul>
              <p className="cg-droits__deletion-note">
                Certaines données peuvent être conservées au-delà de ce délai
                pour répondre à nos obligations légales (comptabilité, litiges).
              </p>
            </div>
          </div>

          {/* CNIL */}
          <div className="cg-droits__cnil">
            <span className="cg-droits__cnil-icon">⚖️</span>
            <div>
              <h3>Recours auprès de la CNIL</h3>
              <p>
                Si vous estimez que le traitement de vos données personnelles
                n'est pas conforme à la réglementation, vous avez le droit
                d'introduire une réclamation auprès de la{" "}
                <strong>
                  Commission Nationale de l'Informatique et des Libertés (CNIL)
                </strong>
                , autorité de contrôle française compétente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DroitsSection;
