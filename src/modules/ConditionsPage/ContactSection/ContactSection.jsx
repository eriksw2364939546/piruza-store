"use client";
import "./ContactSection.scss";
import { useTranslations } from "next-intl";

const ContactSection = () => {
  const t = useTranslations("conditions.contact");
  const currentYear = new Date().getFullYear();

  return (
    <section className="cg-contact">
      <div className="container">
        <div className="cg-contact__inner">
          <h2 className="cg-contact__title">{t("title")}</h2>
          <p className="cg-contact__intro">{t("intro")}</p>

          <div className="cg-contact__grid">
            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">🏢</span>
              <h3>{t("respTitle")}</h3>
              <p>{t("resp1")}</p>
              <p>{t("resp2")}</p>
              <p>{t("resp3")}</p>
            </div>

            <div className="cg-contact__card">
              <span className="cg-contact__card-icon">💬</span>
              <h3>{t("contactTitle")}</h3>
              <p>{t("contactText")}</p>
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
              <h3>{t("hostTitle")}</h3>
              <p>{t("host1")}</p>
              <p>{t("host2")}</p>
            </div>
          </div>

          <div className="cg-contact__update">
            <span className="cg-contact__update-icon">🔄</span>
            <div>
              <h3>{t("updateTitle")}</h3>
              <p>{t("updateText")}</p>
            </div>
          </div>

          <div className="cg-contact__footer">
            <p>
              © {currentYear} Piruza Store. {t("rights")}
            </p>
            <p className="cg-contact__footer-note">{t("footerNote")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
