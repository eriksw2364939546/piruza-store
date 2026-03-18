"use client";

import "./Header.scss";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LogIn, CircleUserRound } from "lucide-react";
import OrderModal from "@/components/OrderModal/OrderModal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setClientName(null);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.name) {
          setClientName(json.data.name);
        } else {
          localStorage.removeItem("token");
          setClientName(null);
        }
      })
      .catch(() => setClientName(null));
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openModal = () => {
    setIsModalOpen(true);
    closeMenu();
  };

  const handleSuccess = () => {
    toast.success(
      "Piruza a déjà commencé à préparer votre sudjouke ❤️\nNous vous appellerons ou vous enverrons un SMS pour confirmer votre commande !",
      { duration: 6000 },
    );
  };

  const handleLoginClick = () => {
    router.push(clientName ? "/cabinet" : "/login");
    closeMenu();
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

            <button
              className={`burger-menu ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="header-mobile-order">
              <button className="header-btn btn" onClick={openModal}>
                Commande
              </button>
            </div>

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

                {/* ── Иконка входа / кабинет ── */}
                <button
                  className={`header-user-btn ${clientName ? "header-user-btn--active" : ""}`}
                  onClick={handleLoginClick}
                  title={clientName ? clientName : "Se connecter"}
                >
                  {clientName ? (
                    <CircleUserRound size={28} strokeWidth={1.5} />
                  ) : (
                    <LogIn size={28} strokeWidth={1.5} />
                  )}
                </button>

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
