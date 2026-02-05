// app/privacy-policy/sections/HeaderSection.js
import "./HeaderSection.scss";

const HeaderSection = () => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="header-section">
      <h1 className="header-section__title">Politique de confidentialité</h1>
      <p className="header-section__last-update">
        Dernière mise à jour : {formattedDate}
      </p>
      <div className="header-section__content">
        <p>
          La présente politique de confidentialité décrit la manière dont{" "}
          <strong>Piruza Store</strong>
          ("nous", "notre", "nos") collecte, utilise et protège vos données
          personnelles lorsque vous utilisez notre site web et nos services.
        </p>
        <p>
          Cette politique s'applique au site web accessible à l'adresse{" "}
          {"[insérer votre URL]"}
          et à tous les services associés proposés par Piruza Store.
        </p>
      </div>
    </section>
  );
};

export default HeaderSection;
