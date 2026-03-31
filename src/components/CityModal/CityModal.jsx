"use client";

import { useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import "./CityModal.scss";

const CityModal = ({ cities = [], onSelect, onClose, selectedCity = null }) => {
  const [query, setQuery] = useState("");

  const filtered = cities.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="city-modal__overlay" onClick={onClose}>
      <div className="city-modal" onClick={(e) => e.stopPropagation()}>
        {/* Закрыть — только если есть onClose (не первый визит) */}
        {onClose && (
          <button className="city-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        )}

        <div className="city-modal__icon">
          <MapPin size={28} />
        </div>

        <h2 className="city-modal__title">Choisissez votre ville</h2>
        <p className="city-modal__subtitle">
          Pour voir les vendeurs près de chez vous
        </p>

        {/* Поиск */}
        <div className="city-modal__search-wrap">
          <Search size={16} className="city-modal__search-icon" />
          <input
            className="city-modal__search"
            type="text"
            placeholder="Rechercher une ville..."
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

        {/* Текущий город */}
        {selectedCity && !query && (
          <div className="city-modal__current">
            <MapPin size={13} />
            Ville actuelle : <strong>{selectedCity.name}</strong>
          </div>
        )}

        {/* Результаты */}
        <div className="city-modal__list">
          {filtered.length === 0 ? (
            <p className="city-modal__empty">Aucune ville trouvée</p>
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
