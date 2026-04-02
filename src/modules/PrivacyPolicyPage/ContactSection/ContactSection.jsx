import "./ContactSection.scss";

const ContactSection = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="cg-contact">
      <div className="container">
        <div className="cg-contact__inner">
          <h2 className="cg-contact__title">Contact</h2>

          <p className="cg-contact__intro">
            Pour toute question relative à la présente politique de
            confidentialité, à l'exercice de vos droits ou à la gestion de vos
            données personnelles, vous pouvez nous contacter via les coordonnées
            suivantes.
          </p>

          {/* Infos contact */}
          <div className="cg-contact__grid">
            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">🏢</span>
              <h3>Responsable du traitement</h3>
              <p>Piruza Store</p>
              <p>Plateforme de mise en relation de vendeurs locaux</p>
              <p>France</p>
            </div>

            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">📍</span>
              <h3>Hébergement</h3>
              <p>Hetzner Online GmbH</p>
              <p>Industriestr. 25, 91710 Gunzenhausen</p>
              <p>Allemagne (Union Européenne)</p>
              <a
                href="https://www.hetzner.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cg-contact__card-link"
              >
                www.hetzner.com →
              </a>
            </div>

            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">💬</span>
              <h3>Nous contacter</h3>
              <p>Pour toute demande relative à vos données personnelles :</p>
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
          </div>

          {/* Délai de réponse */}
          <div className="cg-contact__delay">
            <span className="cg-contact__delay-icon">⏱️</span>
            <div>
              <h3>Délai de réponse</h3>
              <p>
                Nous nous engageons à répondre à toute demande relative à vos
                données personnelles dans un délai maximum d'un mois à compter
                de la réception de votre demande, conformément à l'article 12 du
                RGPD. Ce délai peut être prolongé de deux mois supplémentaires
                en cas de demande complexe ou nombreuse, après information de
                votre part.
              </p>
            </div>
          </div>

          {/* Mise à jour */}
          <div className="cg-contact__update">
            <span className="cg-contact__update-icon">🔄</span>
            <div>
              <h3>Mise à jour de la politique</h3>
              <p>
                La présente politique de confidentialité et conditions générales
                d'utilisation peut être mise à jour à tout moment pour refléter
                les évolutions légales, réglementaires ou techniques. Nous vous
                invitons à la consulter régulièrement. En cas de modification
                substantielle, nous en informerons les utilisateurs enregistrés
                via les coordonnées disponibles dans leur profil.
              </p>
            </div>
          </div>

          {/* Footer de la page */}
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
