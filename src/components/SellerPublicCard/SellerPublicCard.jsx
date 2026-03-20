"use client";

// ═══════════════════════════════════════════════════════
// SellerPublicCard — публичная карточка продавца
// src/components/SellerPublicCard/SellerPublicCard.jsx
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import "./SellerPublicCard.scss";

const SellerPublicCard = ({ seller }) => (
  <Link href={`/sellers/${seller.slug}`} className="seller-public-card">
    <div className="seller-public-card__cover">
      {seller.coverImage ? (
        <img src={getImageUrl(seller.coverImage)} alt={seller.name} />
      ) : (
        <div className="seller-public-card__cover-empty" />
      )}
      {seller.logo && (
        <div className="seller-public-card__logo">
          <img src={getImageUrl(seller.logo)} alt={seller.name} />
        </div>
      )}
    </div>

    <div className="seller-public-card__body">
      <div className="seller-public-card__info">
        <h3 className="seller-public-card__name">{seller.name}</h3>
        <p className="seller-public-card__type">{seller.businessType}</p>
        {seller.city && (
          <p className="seller-public-card__city">
            <MapPin size={12} />
            {seller.city.name}
          </p>
        )}
      </div>

      {seller.averageRating > 0 && (
        <div className="seller-public-card__rating">
          <Star size={12} fill="currentColor" />
          <span>{Number(seller.averageRating).toFixed(1)}</span>
        </div>
      )}
    </div>
  </Link>
);

export default SellerPublicCard;
