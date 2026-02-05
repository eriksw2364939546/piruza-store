"use client";

import "./Header.scss";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import OrderModal from "@/components/OrderModal/OrderModal";
import toast from "react-hot-toast";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
    closeMenu();
  };

  const handleSuccess = () => {
    toast.success(
      "Piruza a déjà commencé à préparer votre churchkhela ❤️\nNous vous appellerons ou vous enverrons un SMS pour confirmer votre commande !",
      {
        duration: 6000,
      },
    );
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="header-items row">
            <div className="header-logo">
              <Link href="/" onClick={closeMenu}>
                <Image
                  src="/icon/header-logo.png"
                  width={120}
                  height={90}
                  alt="Logo"
                />
              </Link>
            </div>

            {/* Бургер-меню кнопка */}
            <button
              className={`burger-menu ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* Кнопка заказа для мобильных */}
            <div className="header-mobile-order">
              <button className="header-btn btn" onClick={openModal}>
                Commande
              </button>
            </div>

            {/* Навигация */}
            <nav className={isMenuOpen ? "active" : ""}>
              <div className="header-nav__items">
                <a href="/" onClick={closeMenu}>
                  Accueil
                </a>
                <a
                  className="header-nav__item-link"
                  href="#about"
                  onClick={closeMenu}
                >
                  À propos
                </a>
                <a
                  className="header-nav__item-link"
                  href="#flavors"
                  onClick={closeMenu}
                >
                  Goûts
                </a>
              </div>

              <div className="header-logo__wrapper">
                <div className="header-logo__dekstop">
                  <Link href="/">
                    <Image
                      src="/icon/header-logo.png"
                      width={120}
                      height={90}
                      alt="Logo"
                    />
                  </Link>
                </div>
              </div>

              <div className="header-nav__items">
                <a
                  className="header-nav__item-link"
                  href="#how-to__order"
                  onClick={closeMenu}
                >
                  Comment commander
                </a>
                <button
                  className="header-btn btn desktop-order-btn"
                  onClick={openModal}
                >
                  Commande
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Оверлей для закрытия меню при клике вне его */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </header>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default Header;
