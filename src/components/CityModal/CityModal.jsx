"use client";

// ═══════════════════════════════════════════════════════
// CityModal — модалка выбора города
// src/components/CityModal/CityModal.jsx
// Показывается при первом посещении если нет города
// ═══════════════════════════════════════════════════════

import { MapPin } from "lucide-react";
import "./CityModal.scss";

const CityModal = ({ cities = [], onSelect }) => {
  return (
    <div className="city-modal__overlay">
      <div className="city-modal">
        <div className="city-modal__icon">
          <MapPin size={28} />
        </div>

        <h2 className="city-modal__title">Choisissez votre ville</h2>
        <p className="city-modal__subtitle">
          Pour voir les vendeurs près de chez vous
        </p>

        <div className="city-modal__list">
          {cities.map((city) => (
            <button
              key={city._id}
              className="city-modal__item"
              onClick={() => onSelect(city)}
            >
              <MapPin size={14} />
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityModal;
