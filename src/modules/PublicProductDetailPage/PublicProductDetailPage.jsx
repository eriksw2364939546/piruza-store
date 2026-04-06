"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Tag, Hash } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { validatePhone } from "@/lib/validation/orderForm.fr.schema";
import useCart from "@/hooks/useCart";
import { useTranslations } from "next-intl";
import "./PublicProductDetailPage.scss";

const OrderForm = ({
  seller,
  products,
  onClose,
  cart,
  onAdd,
  onRemove,
  onClear,
}) => {
  const t = useTranslations("sellerProfile");
  const [clientPhone, setClientPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const total = products.reduce((sum, p) => {
    return sum + (p?.price || 0) * (cart[p._id] || p.quantity || 0);
  }, 0);

  const handleSend = () => {
    if (!products.length) {
      alert(t("chooseProduct"));
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
      t("waGreeting", { name: seller.name }),
      "",
      ...lines,
      total > 0
        ? `\n${t("waTotal", { total: total.toLocaleString("fr-FR") })}`
        : "",
      clientPhone ? `\n${t("waPhone", { phone: clientPhone })}` : "",
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
          <h3 className="order-form__title">
            {t("orderTitle", { name: seller.name })}
          </h3>
          <button className="order-form__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="order-form__products">
          {products.length === 0 ? (
            <p className="order-form__empty">{t("cartEmpty")}</p>
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
            {t("total")} <strong>{total.toLocaleString("fr-FR")} €</strong>
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
          <MessageCircle size={18} /> {t("sendWhatsapp")}
        </button>
        <p className="order-form__privacy">
          {t("privacy")}{" "}
          <Link href="/politique-de-confidentialite">{t("privacyLink")}</Link>
        </p>
      </div>
    </div>
  );
};

export default function PublicProductDetailPage({ product, seller }) {
  const t = useTranslations("sellerProfile");
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
  const cartItems = getCartItems([product]);

  return (
    <div className="public-product-detail">
      <div className="container">
        <button
          className="public-product-detail__back"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} /> {t("back")}
        </button>

        <div className="public-product-detail__body">
          <div className="public-product-detail__img-col">
            {product.image ? (
              <div className="public-product-detail__img-wrap">
                <img src={getImageUrl(product.image)} alt={product.name} />
              </div>
            ) : (
              <div className="public-product-detail__img-empty">
                <span>{t("noPhoto")}</span>
              </div>
            )}
          </div>

          <div className="public-product-detail__info">
            {product.category && (
              <div className="public-product-detail__category">
                <Tag size={13} /> {product.category.name}
              </div>
            )}

            <h1 className="public-product-detail__name">{product.name}</h1>

            {product.code && (
              <div className="public-product-detail__code">
                <Hash size={13} /> {product.code}
              </div>
            )}

            {product.price > 0 && (
              <div className="public-product-detail__price">
                {product.price.toLocaleString("fr-FR")} €
              </div>
            )}

            {product.description && (
              <p className="public-product-detail__desc">
                {product.description}
              </p>
            )}

            <div className="public-product-detail__cart">
              {quantity === 0 ? (
                <button
                  className="public-product-detail__add-btn"
                  onClick={() => addItem(product._id, product)}
                >
                  <MessageCircle size={16} /> {t("addToCart")}
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

      {seller.whatsapp && totalItems > 0 && (
        <div className="cart-bar" onClick={() => setOrderOpen(true)}>
          <div className="cart-bar__left">
            <span className="cart-bar__count">{totalItems}</span>
            <span className="cart-bar__label">
              {totalItems > 1 ? t("cartLabelPlural") : t("cartLabel")}
            </span>
          </div>
          <div className="cart-bar__right">
            {totalPrice([product]) > 0 && (
              <span className="cart-bar__total">
                {totalPrice([product]).toLocaleString("fr-FR")} €
              </span>
            )}
            <span className="cart-bar__btn">
              <MessageCircle size={18} /> {t("order")}
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
