import "./ResponsabiliteSection.scss";

const ResponsabiliteSection = () => {
  return (
    <section className="cg-responsabilite">
      <div className="container">
        <div className="cg-responsabilite__inner">
          <h2 className="cg-responsabilite__title">Responsabilité</h2>

          <p className="cg-responsabilite__intro">
            Piruza Store agit exclusivement en tant que plateforme
            d'intermédiation. À ce titre, sa responsabilité est strictement
            limitée à la mise en relation entre vendeurs et clients.
          </p>

          <div className="cg-responsabilite__grid">
            <div className="cg-responsabilite__card">
              <span className="cg-responsabilite__card-icon">🛒</span>
              <h3>Transactions commerciales</h3>
              <p>
                Piruza Store n'est pas partie aux transactions conclues entre
                les vendeurs et les clients. Tout litige relatif à un achat, un
                paiement ou une livraison doit être réglé directement entre les
                parties concernées.
              </p>
            </div>

            <div className="cg-responsabilite__card">
              <span className="cg-responsabilite__card-icon">🍽️</span>
              <h3>Qualité des produits</h3>
              <p>
                Piruza Store ne contrôle pas la qualité, la conformité ou la
                sécurité des produits proposés par les vendeurs. Chaque vendeur
                est seul responsable des produits qu'il propose et de leur
                conformité aux normes en vigueur.
              </p>
            </div>

            <div className="cg-responsabilite__card">
              <span className="cg-responsabilite__card-icon">📦</span>
              <h3>Livraison et disponibilité</h3>
              <p>
                Piruza Store ne garantit pas la disponibilité des produits
                affichés ni les conditions de remise ou de livraison pratiquées
                par les vendeurs. Ces modalités sont définies exclusivement par
                chaque vendeur.
              </p>
            </div>

            <div className="cg-responsabilite__card">
              <span className="cg-responsabilite__card-icon">⚖️</span>
              <h3>Conformité légale des vendeurs</h3>
              <p>
                Piruza Store ne peut garantir la conformité légale, fiscale ou
                sanitaire de chaque vendeur référencé. La vérification du statut
                juridique du vendeur relève de la responsabilité du client.
              </p>
            </div>

            <div className="cg-responsabilite__card">
              <span className="cg-responsabilite__card-icon">⭐</span>
              <h3>Évaluations et avis</h3>
              <p>
                Les évaluations publiées sur la plateforme reflètent l'opinion
                personnelle des clients et n'engagent pas la responsabilité de
                Piruza Store. Nous nous réservons le droit de supprimer tout
                contenu inapproprié ou abusif.
              </p>
            </div>

            <div className="cg-responsabilite__card">
              <span className="cg-responsabilite__card-icon">🌐</span>
              <h3>Disponibilité de la plateforme</h3>
              <p>
                Piruza Store s'efforce d'assurer la disponibilité de la
                plateforme mais ne peut garantir un accès ininterrompu. Des
                interruptions pour maintenance ou raisons techniques peuvent
                survenir sans préavis.
              </p>
            </div>
          </div>

          <div className="cg-responsabilite__notice">
            <span className="cg-responsabilite__notice-icon">⚠️</span>
            <p>
              En utilisant la plateforme Piruza Store, vous reconnaissez avoir
              pris connaissance des présentes conditions et acceptez que Piruza
              Store ne puisse être tenu responsable des dommages directs ou
              indirects résultant de l'utilisation de la plateforme ou des
              transactions effectuées entre vendeurs et clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResponsabiliteSection;
