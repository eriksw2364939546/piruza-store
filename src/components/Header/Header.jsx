"use client";

import "./Header.scss";
import Link from "next/link";
import Image from "next/image";
import { clientApi } from "@/lib/clientApi";
import { useState, useEffect, useRef } from "react";
import { LogIn, CircleUserRound, MapPin, Search } from "lucide-react";
import CityModal from "@/components/CityModal/CityModal";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/lib/utils";

const Header = ({ cities = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [clientName, setClientName] = useState(null);
  const [city, setCity] = useState(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const timerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    clientApi
      .get("/clients/profile")
      .then(async (json) => {
        if (json.success && json.data?.name) {
          setClientName(json.data.name);
        }
        if (json.data?.city) {
          const profileCity = json.data.city;
          const saved = localStorage.getItem("piruza_city");
          const localCity = saved ? JSON.parse(saved) : null;
          if (
            localCity &&
            localCity._id.toString() !== profileCity._id.toString()
          ) {
            try {
              await clientApi.patch("/clients/city", { city: localCity._id });
              setCity(localCity);
            } catch {
              setCity(profileCity);
              localStorage.setItem("piruza_city", JSON.stringify(profileCity));
            }
          } else {
            setCity(profileCity);
            localStorage.setItem("piruza_city", JSON.stringify(profileCity));
          }
        } else {
          loadLocalCity();
        }
      })
      .catch(() => {
        setClientName(null);
        loadLocalCity();
      });
  }, []);

  const loadLocalCity = () => {
    const saved = localStorage.getItem("piruza_city");
    if (saved) setCity(JSON.parse(saved));
  };

  const handleCitySelect = async (selectedCity) => {
    localStorage.setItem("piruza_city", JSON.stringify(selectedCity));
    setCity(selectedCity);
    setShowCityModal(false);
    if (clientName) {
      try {
        await clientApi.patch("/clients/city", { city: selectedCity._id });
      } catch {}
    }
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("city", selectedCity.slug);
    window.location.href = `${window.location.pathname}?${currentParams.toString()}`;
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (!city?.slug) return;
      setSearchLoading(true);
      try {
        const params = new URLSearchParams({
          city: city.slug,
          query: val,
          limit: 4,
        });
        const json = await clientApi.get(`/sellers/public?${params}`);
        setSearchResults(json.data || []);
        setShowDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    const params = new URLSearchParams();
    if (city?.slug) params.set("city", city.slug);
    if (query.trim()) params.set("query", query.trim());
    router.push(`/sellers?${params.toString()}`);
    closeMenu();
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLoginClick = () => {
    router.push(clientName ? "/cabinet" : "/login");
    closeMenu();
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="header-items row">
            {/* ── Мобильный логотип слева ── */}
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

            {/* ── Бургер по центру мобильный ── */}
            <button
              className={`burger-menu ${isMenuOpen ? "active" : ""}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            {/* ── Иконка входа справа мобильный ── */}
            <button
              className={`header-user-btn header-user-btn--mobile ${clientName ? "header-user-btn--active" : ""}`}
              onClick={handleLoginClick}
              title={clientName ? clientName : "Se connecter"}
            >
              {clientName ? (
                <CircleUserRound size={28} strokeWidth={1.5} />
              ) : (
                <LogIn size={28} strokeWidth={1.5} />
              )}
            </button>

            {/* ── Навигация ── */}
            <nav className={isMenuOpen ? "active" : ""}>
              {/* Левая часть */}
              <div className="header-nav__items">
                <a href="/" onClick={closeMenu}>
                  Accueil
                </a>
                <a
                  className="header-nav__item-link"
                  href="#how-to__order"
                  onClick={closeMenu}
                >
                  Comment commander
                </a>
              </div>

              {/* Центр — логотип десктоп */}
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

              {/* Правая часть */}
              <div className="header-nav__items header-nav__items--right">
                {/* Выбор города */}
                <button
                  className="header-city-btn"
                  onClick={() => setShowCityModal(true)}
                >
                  <MapPin size={16} />
                  <span>{city ? city.name : "Ville"}</span>
                </button>

                {/* Поиск с dropdown */}
                <div className="header-search-wrap">
                  <form className="header-search" onSubmit={handleSearch}>
                    <input
                      className="header-search__input"
                      type="text"
                      placeholder="Rechercher..."
                      value={query}
                      onChange={handleQueryChange}
                      onBlur={() =>
                        setTimeout(() => setShowDropdown(false), 200)
                      }
                      onFocus={() =>
                        searchResults.length > 0 && setShowDropdown(true)
                      }
                    />
                    <button type="submit" className="header-search__btn">
                      <Search size={16} />
                    </button>
                  </form>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="header-search__dropdown">
                      {searchLoading ? (
                        <div className="header-search__dropdown-loading">
                          ...
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="header-search__dropdown-empty">
                          Aucun résultat
                        </div>
                      ) : (
                        searchResults.map((seller) => (
                          <Link
                            key={seller._id}
                            href={`/sellers/${seller.slug}`}
                            className="header-search__dropdown-item"
                            onClick={() => {
                              setShowDropdown(false);
                              setQuery("");
                              closeMenu();
                            }}
                          >
                            {seller.logo ? (
                              <img
                                src={getImageUrl(seller.logo)}
                                alt={seller.name}
                                className="header-search__dropdown-logo"
                              />
                            ) : (
                              <div className="header-search__dropdown-logo-placeholder">
                                {seller.name?.charAt(0)}
                              </div>
                            )}
                            <div>
                              <div className="header-search__dropdown-name">
                                {seller.name}
                              </div>
                              <div className="header-search__dropdown-city">
                                {seller.city?.name}
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Иконка входа десктоп */}
                <button
                  className={`header-user-btn header-user-btn--desktop ${clientName ? "header-user-btn--active" : ""}`}
                  onClick={handleLoginClick}
                  title={clientName ? clientName : "Se connecter"}
                >
                  {clientName ? (
                    <CircleUserRound size={28} strokeWidth={1.5} />
                  ) : (
                    <LogIn size={28} strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </nav>
          </div>
        </div>

        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </header>

      {/* ── Модалка города ── */}
      {showCityModal && (
        <CityModal
          cities={cities}
          selectedCity={city}
          onSelect={handleCitySelect}
          onClose={() => setShowCityModal(false)}
        />
      )}
    </>
  );
};

export default Header;
