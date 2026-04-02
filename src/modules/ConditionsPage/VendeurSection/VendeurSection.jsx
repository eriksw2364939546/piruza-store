import "./VendeurSection.scss";

const VendeurSection = () => {
  return (
    <section className="cg-vendeur">
      <div className="container">
        <div className="cg-vendeur__inner">
          <h2 className="cg-vendeur__title">Statut des vendeurs</h2>

          <div className="cg-vendeur__alert">
            <span className="cg-vendeur__alert-icon">⚠️</span>
            <div>
              <h3>Obligation légale importante</h3>
              <p>
                Tout vendeur référencé sur Piruza Store doit obligatoirement
                disposer d'un statut juridique reconnu en France pour exercer
                une activité commerciale. Piruza Store ne peut être tenu
                responsable des vendeurs exerçant sans statut légal.
              </p>
            </div>
          </div>

          <div className="cg-vendeur__block">
            <h3>Statut minimum requis</h3>
            <p>
              Pour être référencé sur notre plateforme, chaque vendeur doit
              disposer au minimum du statut de{" "}
              <strong>micro-entrepreneur (auto-entrepreneur)</strong>,
              enregistré auprès de l'URSSAF et immatriculé au Registre du
              Commerce et des Sociétés (RCS) ou au Répertoire des Métiers (RM)
              selon l'activité exercée.
            </p>
          </div>

          <div className="cg-vendeur__statuts">
            <h3>Statuts juridiques acceptés</h3>
            <div className="cg-vendeur__statuts-grid">
              <div className="cg-vendeur__statut-card cg-vendeur__statut-card--recommended">
                <span className="cg-vendeur__statut-badge">Recommandé</span>
                <h4>Micro-entrepreneur</h4>
                <p>
                  Statut simplifié idéal pour démarrer une activité artisanale
                  ou de vente. Adapté aux vendeurs qui souhaitent proposer leurs
                  produits de façon indépendante.
                </p>
                <a
                  href="https://www.autoentrepreneur.urssaf.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-vendeur__statut-link"
                >
                  S'inscrire sur autoentrepreneur.urssaf.fr →
                </a>
              </div>

              <div className="cg-vendeur__statut-card">
                <h4>EURL / SASU</h4>
                <p>
                  Sociétés unipersonnelles à responsabilité limitée. Adaptées
                  pour les vendeurs avec une activité plus structurée.
                </p>
              </div>

              <div className="cg-vendeur__statut-card">
                <h4>SARL / SAS</h4>
                <p>
                  Sociétés à responsabilité limitée ou par actions simplifiée.
                  Pour les activités commerciales établies.
                </p>
              </div>
            </div>
          </div>

          <div className="cg-vendeur__block">
            <h3>Obligations des vendeurs</h3>
            <div className="cg-vendeur__obligations">
              <div className="cg-vendeur__obligation-item">
                <span className="cg-vendeur__obligation-icon">📋</span>
                <div>
                  <h4>Déclaration d'activité</h4>
                  <p>
                    Le vendeur doit être déclaré auprès des autorités
                    compétentes et disposer d'un numéro SIRET valide avant toute
                    mise en ligne sur la plateforme.
                  </p>
                </div>
              </div>

              <div className="cg-vendeur__obligation-item">
                <span className="cg-vendeur__obligation-icon">🧾</span>
                <div>
                  <h4>Obligations fiscales</h4>
                  <p>
                    Le vendeur est seul responsable de la déclaration et du
                    paiement de ses cotisations sociales et fiscales auprès des
                    autorités compétentes françaises.
                  </p>
                </div>
              </div>

              <div className="cg-vendeur__obligation-item">
                <span className="cg-vendeur__obligation-icon">🍽️</span>
                <div>
                  <h4>Normes alimentaires</h4>
                  <p>
                    Tout vendeur proposant des produits alimentaires doit
                    respecter les normes d'hygiène alimentaire françaises en
                    vigueur, déclarer son activité auprès des autorités
                    sanitaires compétentes et disposer des formations requises.
                  </p>
                </div>
              </div>

              <div className="cg-vendeur__obligation-item">
                <span className="cg-vendeur__obligation-icon">🏷️</span>
                <div>
                  <h4>Étiquetage des produits</h4>
                  <p>
                    Les produits alimentaires doivent respecter la
                    réglementation européenne sur l'étiquetage, notamment
                    l'indication des allergènes, la liste des ingrédients et la
                    date de durabilité minimale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cg-vendeur__block">
            <h3>Référencement et abonnement</h3>
            <p>
              Le référencement sur Piruza Store est soumis au paiement d'un
              abonnement mensuel. Cet abonnement donne accès à la visibilité sur
              la plateforme pour la durée convenue. Piruza Store se réserve le
              droit de suspendre ou de supprimer tout vendeur ne respectant pas
              les présentes conditions ou les obligations légales en vigueur.
            </p>
          </div>

          <div className="cg-vendeur__disclaimer">
            <p>
              <strong>Décharge de responsabilité :</strong> Piruza Store décline
              toute responsabilité en cas de manquement des vendeurs à leurs
              obligations légales, fiscales ou sanitaires. Chaque vendeur est
              seul responsable de la conformité de son activité avec la
              législation française en vigueur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VendeurSection;
