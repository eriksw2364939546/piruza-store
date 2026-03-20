"use client";

// ═══════════════════════════════════════════════════════
// PublicProductCard — публичная карточка товара
// src/components/PublicProductCard/PublicProductCard.jsx
// ═══════════════════════════════════════════════════════

import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import "./PublicProductCard.scss";

const PublicProductCard = ({ product, sellerSlug, cart, onAdd, onRemove }) => {
  const quantity = cart?.[product._id] || 0;

  return (
    <div className="public-product-card">
      {/* Изображение — ссылка на страницу товара */}
      <Link
        href={`/sellers/${sellerSlug}/products/${product.slug}`}
        className="public-product-card__img-wrap"
      >
        {product.image ? (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="public-product-card__img"
          />
        ) : (
          <div className="public-product-card__img-empty" />
        )}
      </Link>

      <div className="public-product-card__body">
        <Link
          href={`/sellers/${sellerSlug}/products/${product.slug}`}
          className="public-product-card__name-link"
        >
          <p className="public-product-card__name">{product.name}</p>
        </Link>
        {product.code && (
          <p className="public-product-card__code">#{product.code}</p>
        )}
        {product.description && (
          <p className="public-product-card__desc">{product.description}</p>
        )}

        <div className="public-product-card__footer">
          {product.price > 0 && (
            <p className="public-product-card__price">
              {product.price.toLocaleString("fr-FR")} €
            </p>
          )}

          {/* Кнопки корзины */}
          <div className="public-product-card__cart">
            {quantity === 0 ? (
              <button
                className="public-product-card__add-btn"
                onClick={() => onAdd(product._id)}
              >
                +
              </button>
            ) : (
              <div className="public-product-card__counter">
                <button
                  className="public-product-card__counter-btn"
                  onClick={() => onRemove(product._id)}
                >
                  −
                </button>
                <span className="public-product-card__counter-val">
                  {quantity}
                </span>
                <button
                  className="public-product-card__counter-btn public-product-card__counter-btn--plus"
                  onClick={() => onAdd(product._id)}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProductCard;
