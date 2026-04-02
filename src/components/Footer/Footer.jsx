"use client";
import "./Footer.scss";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const [currentYear, setCurrentYear] = useState("2026");
  useEffect(() => {
    const year = new Date().getFullYear();
    setCurrentYear(year);
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
              <p className="footer__logo-bottom__descr">
                Les saveurs d'ailleurs, <br /> retrouvées ici
              </p>
            </div>
            <div className="footer__logo-bottom__descr-heart">
              <Image
                src="/icon/footer-heart.png"
                width={45}
                height={45}
                alt="Heart icon"
              />
              <p>
                Fait avec amour, <br /> comme à la maison
              </p>
            </div>
          </div>

          {/* ── Колонка 2 — Navigation ── */}
          <div className="footer-item">
            <h3>Navigation</h3>
            <div className="footer-item__info">
              <Link href="/#header">Accueil</Link>
              <Link href="/sellers">Vendeurs</Link>
              <Link href="/#how-to__order">Comment commander</Link>
            </div>
          </div>

          {/* ── Колонка 3 — Contacts ── */}
          <div className="footer-item">
            <h3>Contacts</h3>
            <div className="footer-item__info-content">
              <a
                href="https://erik-yeghiazaryan.site/"
                className="footer-item__info-dev"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contactez le développeur
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
            <h3>Pages utilitaires</h3>
            <div className="footer-item__info">
              <Link href="/politique-de-confidentialite">
                Politique de confidentialité
              </Link>
              <Link href="/conditions-generales">Conditions générales</Link>
              <Link href="/a-propos">À propos</Link>
            </div>
          </div>
        </div>

        {/* ── Footer bottom ── */}
        <div className="footer-bottom">
          <p>© {currentYear} Piruza Store. Tous droits réservés.</p>
          <p className="footer-bottom__note">
            Plateforme de mise en relation — pas de livraison, pas de paiement
            en ligne
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
