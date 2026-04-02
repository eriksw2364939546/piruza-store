import "./ContactSection.scss";

const ContactSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="cg-contact">
      <div className="container">
        <div className="cg-contact__inner">
          <h2 className="cg-contact__title">Contact</h2>

          <p className="cg-contact__intro">
            Pour toute question relative aux présentes conditions générales
            d'utilisation ou au fonctionnement de la plateforme, vous pouvez
            nous contacter via les coordonnées suivantes.
          </p>

          <div className="cg-contact__grid">
            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">🏢</span>
              <h3>Responsable de la plateforme</h3>
              <p>Piruza Store</p>
              <p>Plateforme de mise en relation de vendeurs locaux</p>
              <p>France</p>
            </div>

            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">💬</span>
              <h3>Nous contacter</h3>
              <p>Pour toute question ou demande relative à la plateforme :</p>
              <div className="cg-contact__card-links">
                <a
                  href="https://wa.me/14434628696"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-contact__card-link"
                >
                  WhatsApp →
                </a>
                <a
                  href="https://t.me/piruza_store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cg-contact__card-link"
                >
                  Telegram →
                </a>
              </div>
            </div>

            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">🌍</span>
              <h3>Hébergement</h3>
              <p>Serveurs situés au sein de l'Union Européenne</p>
              <p>Conformité RGPD garantie</p>
            </div>
          </div>

          <div className="cg-contact__update">
            <span className="cg-contact__update-icon">🔄</span>
            <div>
              <h3>Mise à jour des conditions</h3>
              <p>
                Les présentes conditions générales d'utilisation peuvent être
                mises à jour à tout moment pour refléter les évolutions légales,
                réglementaires ou liées au fonctionnement de la plateforme. Nous
                vous invitons à les consulter régulièrement. La date de dernière
                mise à jour est indiquée en haut de la page.
              </p>
            </div>
          </div>

          <div className="cg-contact__footer">
            <p>© {currentYear} Piruza Store. Tous droits réservés.</p>
            <p className="cg-contact__footer-note">
              Plateforme de mise en relation — pas de livraison, pas de paiement
              en ligne. Piruza Store n'est pas responsable des transactions
              effectuées entre vendeurs et clients.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
