// app/privacy-policy/sections/ContactSection.js
import "./ContactSection.scss";

const ContactSection = () => {
  return (
    <section className="contact-section">
      <h2 className="contact-section__title">
        Contact et responsable du traitement
      </h2>

      <div className="contact-section__content">
        <div className="contact-section__info">
          <div className="contact-section__info-item">
            <div className="contact-section__info-icon">🏢</div>
            <div>
              <h3>Responsable du traitement</h3>
              <p>Piruza Store</p>
              <p>Représenté par Piruza</p>
            </div>
          </div>

          <div className="contact-section__info-item">
            <div className="contact-section__info-icon">📍</div>
            <div>
              <h3>Adresse</h3>
              <p>Marseille, France</p>
              <p className="contact-section__note">
                (Entreprise artisanale à domicile)
              </p>
            </div>
          </div>

          <div className="contact-section__info-item">
            <div className="contact-section__info-icon">📧</div>
            <div>
              <h3>Email</h3>
              <p>[insérer votre adresse email]</p>
            </div>
          </div>
        </div>

        <div className="contact-section__additional">
          <h4>Conservation des données</h4>
          <ul>
            <li>
              <strong>Données de commande :</strong> 3 ans à compter de la
              dernière interaction
            </li>
            <li>
              <strong>Données comptables :</strong> 10 ans (conformément à la
              réglementation française)
            </li>
            <li>
              <strong>Données techniques :</strong> 13 mois maximum
            </li>
          </ul>

          <h4>Sécurité des données</h4>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles
            appropriées pour protéger vos données contre tout accès non
            autorisé, altération ou destruction.
          </p>
          <p>
            Les communications via notre formulaire sont sécurisées et les
            messages transmis via Telegram utilisent le chiffrement de cette
            plateforme.
          </p>
        </div>

        <div className="contact-section__footer">
          <p>
            Cette politique de confidentialité peut être mise à jour
            périodiquement. Nous vous invitons à la consulter régulièrement.
          </p>
          <p className="contact-section__copyright">
            © {new Date().getFullYear()} Piruza Store. Tous droits réservés.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
