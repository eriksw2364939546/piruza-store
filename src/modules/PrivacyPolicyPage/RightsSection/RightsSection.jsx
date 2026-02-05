// app/privacy-policy/sections/RightsSection.js
import "./RightsSection.scss";

const RightsSection = () => {
  const rights = [
    {
      title: "Droit d'accès",
      description: "Demander la communication des données vous concernant",
      icon: "👁️",
    },
    {
      title: "Droit de rectification",
      description: "Faire corriger des données inexactes ou incomplètes",
      icon: "✏️",
    },
    {
      title: "Droit à l'effacement",
      description: "Demander la suppression de vos données (sous conditions)",
      icon: "🗑️",
    },
    {
      title: "Droit d'opposition",
      description: "Vous opposer au traitement de vos données",
      icon: "✋",
    },
    {
      title: "Droit à la portabilité",
      description: "Recevoir vos données dans un format structuré",
      icon: "📤",
    },
    {
      title: "Droit de limitation",
      description: "Demander la limitation du traitement",
      icon: "⏸️",
    },
  ];

  return (
    <section className="rights-section">
      <h2 className="rights-section__title">Vos droits</h2>

      <div className="rights-section__content">
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD)
          et à la loi "Informatique et Libertés", vous disposez des droits
          suivants concernant vos données personnelles :
        </p>

        <div className="rights-section__grid">
          {rights.map((right, index) => (
            <div key={index} className="rights-section__card">
              <div className="rights-section__card-icon">{right.icon}</div>
              <h3>{right.title}</h3>
              <p>{right.description}</p>
            </div>
          ))}
        </div>

        <div className="rights-section__how-to">
          <h4>Comment exercer vos droits ?</h4>
          <p>
            Pour exercer l'un de ces droits, veuillez nous contacter par email à
            l'adresse indiquée dans la section "Contact". Nous nous engageons à
            répondre dans un délai d'un mois.
          </p>
          <p className="rights-section__cnil">
            Vous avez également le droit d'introduire une réclamation auprès de
            la
            <strong>
              {" "}
              Commission Nationale de l'Informatique et des Libertés (CNIL)
            </strong>
            si vous estimez que vos droits ne sont pas respectés.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RightsSection;
