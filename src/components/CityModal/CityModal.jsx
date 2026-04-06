"use client";

import { useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import "./CityModal.scss";
import { useTranslations } from "next-intl";

const CityModal = ({ cities = [], onSelect, onClose, selectedCity = null }) => {
  const t = useTranslations("cityModal");
  const [query, setQuery] = useState("");

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="city-modal__overlay" onClick={onClose}>
      <div className="city-modal" onClick={(e) => e.stopPropagation()}>
        {onClose && (
          <button className="city-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        )}

        <div className="city-modal__icon">
          <MapPin size={28} />
        </div>

        <h2 className="city-modal__title">{t("title")}</h2>
        <p className="city-modal__subtitle">{t("subtitle")}</p>

        <div className="city-modal__search-wrap">
          <Search size={16} className="city-modal__search-icon" />
          <input
            className="city-modal__search"
            type="text"
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button
              className="city-modal__search-clear"
              onClick={() => setQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {selectedCity && !query && (
          <div className="city-modal__current">
            <MapPin size={13} />
            {t("currentCity")} <strong>{selectedCity.name}</strong>
          </div>
        )}

        <div className="city-modal__list">
          {filtered.length === 0 ? (
            <p className="city-modal__empty">{t("noCity")}</p>
          ) : (
            filtered.map((city) => (
              <button
                key={city._id}
                className={`city-modal__item ${selectedCity?._id === city._id ? "city-modal__item--selected" : ""}`}
                onClick={() => onSelect(city)}
              >
                <MapPin size={14} />
                {city.name}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CityModal;
