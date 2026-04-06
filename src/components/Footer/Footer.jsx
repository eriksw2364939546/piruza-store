"use client";
import "./Footer.scss";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const Footer = () => {
  const { locale } = useParams();
  const t = useTranslations("footer");
  const [currentYear, setCurrentYear] = useState("2026");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer>
      <div className="container">
        <div className="footer-content row">
          {/* ── Колонка 1 — Бренд ── */}
          <div className="footer-item">
            <div className="footer-logo">
              <Image
                src="/icon/header-logo.png"
                width={120}
                height={90}
                alt="Logo"
              />
              <p className="footer__logo-bottom__descr">{t("logoDescr")}</p>
            </div>
            <div className="footer__logo-bottom__descr-heart">
              <Image
                src="/icon/footer-heart.png"
                width={45}
                height={45}
                alt="Heart icon"
              />
              <p>{t("heartDescr")}</p>
            </div>
          </div>

          {/* ── Колонка 2 — Navigation ── */}
          <div className="footer-item">
            <h3>{t("nav")}</h3>
            <div className="footer-item__info">
              <Link href="/#header">{t("home")}</Link>
              <Link href="/sellers">{t("sellers")}</Link>
              <Link href={`/${locale}/#how-to__order`}>{t("howToOrder")}</Link>
            </div>
          </div>

          {/* ── Колонка 3 — Contacts ── */}
          <div className="footer-item">
            <h3>{t("contacts")}</h3>
            <div className="footer-item__info-content">
              <a
                href="https://erik-yeghiazaryan.site/"
                className="footer-item__info-dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("contactDev")}
              </a>
              <div className="footer-item__messenger">
                <a
                  href="https://wa.me/14434628696"
                  className="footer-item__info__image-wrapper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="footer-item__info-icon"
                    src="/icon/whatsapp-icon.svg"
                    width={25}
                    height={25}
                    alt="Whatsapp icon"
                  />
                </a>
                <a
                  href="https://t.me/piruza_store"
                  className="footer-item__info__image-wrapper"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    className="footer-item__info-icon"
                    src="/icon/telegram-icon.svg"
                    width={25}
                    height={25}
                    alt="Telegram icon"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* ── Колонка 4 — Pages utilitaires ── */}
          <div className="footer-item">
            <h3>{t("utilPages")}</h3>
            <div className="footer-item__info">
              <Link href="/politique-de-confidentialite">{t("privacy")}</Link>
              <Link href="/conditions-generales">{t("terms")}</Link>
              <Link href="/a-propos">{t("about")}</Link>
            </div>
          </div>
        </div>

        {/* ── Footer bottom ── */}
        <div className="footer-bottom">
          <p>
            © {currentYear} Piruza Store. {t("rights")}
          </p>
          <p className="footer-bottom__note">{t("note")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
