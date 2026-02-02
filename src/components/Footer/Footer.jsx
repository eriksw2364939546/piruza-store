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
          <div className="footer-item">
            <div className="footer-logo">
              <Image
                src="/icon/header-logo.png"
                width={120}
                height={90}
                alt="Logo"
              />
              <p className="footer__logo-bottom__descr">
                Des douceurs maison de <br /> grand-mère Piruza
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
                Nous cuisinons à la main et <br /> avec amour
              </p>
            </div>
          </div>

          <div className="footer-item">
            <h3>Contacts</h3>
            <div className="footer-item__info-content">
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

              {/* Telegram - замените username на ваш username */}
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

          <div className="footer-item">
            <h3>Pages utilitaires</h3>
            <div className="footer-item__info">
              <Link
                className="footer__privacy-policy"
                href="/conditions-generales"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
          <div className="footer-item">
            <h3>Horaires d'ouverture</h3>
            <div className="footer-item__info">
              <p>Lundi - Vendredi: 9h00 - 18h00</p>
              <p>Samedi: 10h00 - 16h00</p>
              <p>Dimanche: Fermé</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Piruza Store. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
