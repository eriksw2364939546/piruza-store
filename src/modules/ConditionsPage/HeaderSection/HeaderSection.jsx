import "./HeaderSection.scss";

const HeaderSection = () => {
  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="cg-header">
      <div className="container">
        <div className="cg-header__inner">
          <span className="cg-header__eyebrow">Informations légales</span>
          <h1 className="cg-header__title">
            Conditions générales d'utilisation
          </h1>
          <p className="cg-header__date">
            Dernière mise à jour : {formattedDate}
          </p>
          <div className="cg-header__intro">
            <p>
              Les présentes conditions générales d'utilisation régissent l'accès
              et l'utilisation de la plateforme <strong>Piruza Store</strong>.
              En utilisant notre plateforme, vous acceptez sans réserve les
              présentes conditions.
            </p>
            <p>
              Piruza Store est une plateforme de mise en relation entre des
              vendeurs locaux et des clients. Elle n'intervient pas dans les
              transactions commerciales et n'est pas responsable des échanges
              entre les parties.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeaderSection;
