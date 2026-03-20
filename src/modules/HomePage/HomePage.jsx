"use client";

import "./HomePage.scss";
import Hero from "./Hero/Hero";
import HowToOrder from "./HowToOrder/HowToOrder";
import Sellers from "./Sellers/Sellers";
import CityModal from "@/components/CityModal/CityModal";
import { clientApi } from "@/lib/clientApi";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const HomePage = ({ categories = [], cities = [], sellers = [] }) => {
  const pathname = usePathname();
  const [city, setCity] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Восстанавливаем позицию скролла при возврате с /sellers
  useEffect(() => {
    const savedScroll = sessionStorage.getItem("home_scroll");
    const referrer = sessionStorage.getItem("sellers_referrer");
    if (savedScroll && referrer === "/") {
      sessionStorage.removeItem("sellers_referrer");
      window.scrollTo({ top: parseInt(savedScroll), behavior: "instant" });
    }
  }, [pathname]);

  // Определяем город клиента
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      clientApi
        .get("/clients/profile")
        .then((json) => {
          if (json.data?.city) setCity(json.data.city);
          else checkLocalCity();
        })
        .catch(() => checkLocalCity());
    } else {
      checkLocalCity();
    }
  }, []);

  const checkLocalCity = () => {
    const saved = localStorage.getItem("piruza_city");
    if (saved) setCity(JSON.parse(saved));
    else setShowModal(true);
  };

  const handleCitySelect = (selectedCity) => {
    localStorage.setItem("piruza_city", JSON.stringify(selectedCity));
    setCity(selectedCity);
    setShowModal(false);
  };

  return (
    <main>
      {showModal && <CityModal cities={cities} onSelect={handleCitySelect} />}
      <Hero categories={categories} />
      <Sellers sellers={sellers} city={city} />
      <HowToOrder />
    </main>
  );
};

export default HomePage;
