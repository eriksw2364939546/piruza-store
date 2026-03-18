"use client";

// ═══════════════════════════════════════════════════════
// SellerCard — карточка продавца (избранные / оценки)
// src/components/SellerCard/SellerCard.jsx
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import StarRating from "@/components/StarRating/StarRating";
import "./SellerCard.scss";

const MEDIA_BASE = process.env.NEXT_PUBLIC_URL || "http://localhost:7000";
const getImg = (path) => (path ? `${MEDIA_BASE}${path}` : null);

export default function SellerCard({ seller, badge, onRemove }) {
  return (
    <div className="seller-card">
      <div className="seller-card__cover">
        {seller.coverImage ? (
          <img src={getImg(seller.coverImage)} alt={seller.name} />
        ) : (
          <div className="seller-card__cover-empty" />
        )}
        {seller.logo && (
          <div className="seller-card__logo">
            <img src={getImg(seller.logo)} alt={seller.name} />
          </div>
        )}
        {badge && <span className="seller-card__badge">{badge}</span>}
      </div>

      <div className="seller-card__body">
        <div className="seller-card__info">
          <h3 className="seller-card__name">{seller.name}</h3>
          <p className="seller-card__type">{seller.businessType}</p>
          {seller.city && (
            <p className="seller-card__city">
              📍 {seller.city.name || seller.city}
            </p>
          )}
          {seller.averageRating > 0 && (
            <StarRating value={seller.averageRating} size={14} />
          )}
        </div>

        <div className="seller-card__actions">
          {onRemove && (
            <button
              className="seller-card__remove"
              onClick={() => onRemove(seller._id)}
              title="Убрать из избранного"
            >
              ♥
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
