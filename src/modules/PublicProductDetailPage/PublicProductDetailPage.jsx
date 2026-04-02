"use client";

// ═══════════════════════════════════════════════════════
// PublicProductDetailPage — публичная страница товара
// src/modules/PublicProductDetailPage/PublicProductDetailPage.jsx
// ═══════════════════════════════════════════════════════

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Tag, Hash } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { validatePhone } from "@/lib/validation/orderForm.fr.schema";
import useCart from "@/hooks/useCart";
import "./PublicProductDetailPage.scss";

// ── OrderForm ─────────────────────────────────────────

const OrderForm = ({
  seller,
  products,
  onClose,
  cart,
  onAdd,
  onRemove,
  onClear,
}) => {
  const [clientPhone, setClientPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // products уже отфильтрован — это cartItems из useCart.getCartItems
  const total = products.reduce((sum, p) => {
    return sum + (p?.price || 0) * (cart[p._id] || p.quantity || 0);
  }, 0);

  const handleSend = () => {
    if (!products.length) {
      alert("Choisissez au moins un produit");
      return;
    }
    const err = validatePhone(clientPhone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError("");

    const lines = products.map((p) => {
      const qty = cart[p._id];
      const price = p.price
        ? ` — ${(p.price * qty).toLocaleString("fr-FR")} €`
        : "";
      return `• ${p.name} × ${qty}${price}`;
    });
    const text = [
      `Bonjour! Je voudrais commander chez "${seller.name}":`,
      "",
      ...lines,
      total > 0 ? `\n💰 Total: ${total.toLocaleString("fr-FR")} €` : "",
      clientPhone ? `\n📱 Mon numéro: ${clientPhone}` : "",
    ].join("\n");

    window.open(
      `https://wa.me/${seller.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
      "_blank",
    );
    onClear();
    onClose();
  };

  return (
    <div className="order-form__overlay" onClick={onClose}>
      <div className="order-form" onClick={(e) => e.stopPropagation()}>
        <div className="order-form__head">
          <h3 className="order-form__title">Commander chez {seller.name}</h3>
          <button className="order-form__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="order-form__products">
          {products.length === 0 ? (
            <p className="order-form__empty">Votre panier est vide</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="order-form__product">
                {product.image && (
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.name}
                    className="order-form__product-img"
                  />
                )}
                <div className="order-form__product-info">
                  <div className="order-form__product-name">{product.name}</div>
                  {product.price > 0 && (
                    <div className="order-form__product-price">
                      {product.price.toLocaleString("fr-FR")} €
                    </div>
                  )}
                </div>
                <div className="order-form__counter">
                  <button
                    className="order-form__counter-btn"
                    onClick={() => onRemove(product._id)}
                  >
                    −
                  </button>
                  <span className="order-form__counter-val">
                    {cart[product._id] || 0}
                  </span>
                  <button
                    className="order-form__counter-btn order-form__counter-btn--plus"
                    onClick={() => onAdd(product._id)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {total > 0 && (
          <div className="order-form__total">
            Total: <strong>{total.toLocaleString("fr-FR")} €</strong>
          </div>
        )}

        <div className="order-form__phone">
          <input
            type="tel"
            placeholder="06 12 34 56 78"
            value={clientPhone}
            onChange={(e) => {
              setClientPhone(e.target.value);
              if (phoneError) setPhoneError("");
            }}
            onBlur={() => setPhoneError(validatePhone(clientPhone) || "")}
            className={`order-form__phone-input ${phoneError ? "order-form__phone-input--error" : ""}`}
          />
          {phoneError && (
            <p className="order-form__phone-error">{phoneError}</p>
          )}
        </div>

        <button
          className="order-form__send"
          onClick={handleSend}
          disabled={!products.length}
        >
          <MessageCircle size={18} /> Envoyer sur WhatsApp
        </button>
        <p className="order-form__privacy">
          En envoyant, vous acceptez notre{" "}
          <Link href="/politique-de-confidentialite">
            politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────

export default function PublicProductDetailPage({ product, seller }) {
  const router = useRouter();
  const [orderOpen, setOrderOpen] = useState(false);

  const {
    cart,
    addItem,
    removeItem,
    totalItems,
    totalPrice,
    clearCart,
    getCartItems,
  } = useCart(seller._id);

  const quantity = cart[product._id] || 0;

  // Получаем все товары корзины (из кэша + текущий продукт)
  const cartItems = getCartItems([product]);

  return (
    <div className="public-product-detail">
      <div className="container">
        {/* Кнопка назад */}
        <button
          className="public-product-detail__back"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="public-product-detail__body">
          {/* ── Фото ── */}
          <div className="public-product-detail__img-col">
            {product.image ? (
              <div className="public-product-detail__img-wrap">
                <img src={getImageUrl(product.image)} alt={product.name} />
              </div>
            ) : (
              <div className="public-product-detail__img-empty">
                <span>Pas de photo</span>
              </div>
            )}
          </div>

          {/* ── Инфо ── */}
          <div className="public-product-detail__info">
            {/* Категория */}
            {product.category && (
              <div className="public-product-detail__category">
                <Tag size={13} /> {product.category.name}
              </div>
            )}

            <h1 className="public-product-detail__name">{product.name}</h1>

            {/* Артикул */}
            {product.code && (
              <div className="public-product-detail__code">
                <Hash size={13} /> {product.code}
              </div>
            )}

            {/* Цена */}
            {product.price > 0 && (
              <div className="public-product-detail__price">
                {product.price.toLocaleString("fr-FR")} €
              </div>
            )}

            {/* Описание */}
            {product.description && (
              <p className="public-product-detail__desc">
                {product.description}
              </p>
            )}

            {/* Кнопка корзины */}
            <div className="public-product-detail__cart">
              {quantity === 0 ? (
                <button
                  className="public-product-detail__add-btn"
                  onClick={() => addItem(product._id, product)}
                >
                  <MessageCircle size={16} /> Ajouter au panier
                </button>
              ) : (
                <div className="public-product-detail__counter">
                  <button
                    className="public-product-detail__counter-btn"
                    onClick={() => removeItem(product._id)}
                  >
                    −
                  </button>
                  <span className="public-product-detail__counter-val">
                    {quantity}
                  </span>
                  <button
                    className="public-product-detail__counter-btn public-product-detail__counter-btn--plus"
                    onClick={() => addItem(product._id, product)}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Продавец */}
            <button
              className="public-product-detail__seller-link"
              onClick={() => router.push(`/sellers/${seller.slug}`)}
            >
              {seller.logo && (
                <img
                  src={getImageUrl(seller.logo)}
                  alt={seller.name}
                  className="public-product-detail__seller-logo"
                />
              )}
              <span>{seller.name}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CartBar ── */}
      {seller.whatsapp && totalItems > 0 && (
        <div className="cart-bar" onClick={() => setOrderOpen(true)}>
          <div className="cart-bar__left">
            <span className="cart-bar__count">{totalItems}</span>
            <span className="cart-bar__label">
              article{totalItems > 1 ? "s" : ""} dans le panier
            </span>
          </div>
          <div className="cart-bar__right">
            {totalPrice([product]) > 0 && (
              <span className="cart-bar__total">
                {totalPrice([product]).toLocaleString("fr-FR")} €
              </span>
            )}
            <span className="cart-bar__btn">
              <MessageCircle size={18} /> Commander
            </span>
          </div>
        </div>
      )}

      {orderOpen && (
        <OrderForm
          seller={seller}
          products={cartItems}
          cart={cart}
          onAdd={addItem}
          onRemove={removeItem}
          onClear={clearCart}
          onClose={() => setOrderOpen(false)}
        />
      )}
    </div>
  );
}
