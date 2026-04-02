import "./PresentationSection.scss";

const PresentationSection = () => {
  return (
    <section className="cg-presentation">
      <div className="container">
        <div className="cg-presentation__inner">
          <h2 className="cg-presentation__title">
            Présentation de la plateforme
          </h2>

          <div className="cg-presentation__block">
            <h3>Qu'est-ce que Piruza Store ?</h3>
            <p>
              Piruza Store est une plateforme numérique de mise en relation
              entre des vendeurs locaux proposant des spécialités artisanales
              des pays de l'ex-URSS et des clients résidant en France. La
              plateforme agit exclusivement en tant qu'intermédiaire et vitrine
              digitale.
            </p>
          </div>

          <div className="cg-presentation__block">
            <h3>Ce que Piruza Store ne fait pas</h3>
            <div className="cg-presentation__list cg-presentation__list--negative">
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✗</span>
                <p>N'accepte aucun paiement en ligne</p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✗</span>
                <p>N'organise pas la livraison des produits</p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✗</span>
                <p>Ne prend pas en charge les commandes</p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✗</span>
                <p>
                  N'est pas responsable des transactions entre vendeurs et
                  clients
                </p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✗</span>
                <p>Ne garantit pas la disponibilité des produits affichés</p>
              </div>
            </div>
          </div>

          <div className="cg-presentation__block">
            <h3>Ce que Piruza Store fait</h3>
            <div className="cg-presentation__list cg-presentation__list--positive">
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✓</span>
                <p>
                  Met en relation les clients avec des vendeurs locaux
                  référencés
                </p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✓</span>
                <p>
                  Affiche les coordonnées des vendeurs (téléphone, WhatsApp)
                  pour un contact direct
                </p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✓</span>
                <p>
                  Permet aux clients de consulter les produits, les évaluer et
                  les ajouter en favoris
                </p>
              </div>
              <div className="cg-presentation__list-item">
                <span className="cg-presentation__list-icon">✓</span>
                <p>
                  Filtre les vendeurs par ville afin de faciliter la recherche
                  locale
                </p>
              </div>
            </div>
          </div>

          <div className="cg-presentation__notice">
            <span className="cg-presentation__notice-icon">⚠️</span>
            <p>
              Toute transaction, négociation de prix, modalité de livraison ou
              de paiement se fait directement et exclusivement entre le client
              et le vendeur. Piruza Store n'est en aucun cas partie prenante de
              ces échanges.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresentationSection;
