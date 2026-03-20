"use client";

// ═══════════════════════════════════════════════════════
// SellerProfilePage — публичная страница продавца
// src/modules/SellerProfilePage/SellerProfilePage.jsx
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Phone,
  MessageCircle,
  MapPin,
  Heart,
  ArrowLeft,
  Search,
} from "lucide-react";
import StarRating from "@/components/StarRating/StarRating";
import Pagination from "@/components/Pagination/Pagination";
import { clientApi } from "@/lib/clientApi";
import { getImageUrl } from "@/lib/utils";
import PublicProductCard from "@/components/PublicProductCard/PublicProductCard";
import useCart from "@/hooks/useCart";
import "./SellerProfilePage.scss";

// ── Форма заказа WhatsApp ─────────────────────────────

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

  // Товары в корзине
  const cartItems = products.filter((p) => cart[p._id] > 0);

  const total = cartItems.reduce((sum, p) => {
    return sum + (p?.price || 0) * (cart[p._id] || 0);
  }, 0);

  const handleSend = () => {
    if (!cartItems.length) {
      alert("Choisissez au moins un produit");
      return;
    }
    const lines = cartItems.map((p) => {
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

    // Очищаем корзину после отправки
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
          {cartItems.length === 0 ? (
            <p className="order-form__empty">Votre panier est vide</p>
          ) : (
            cartItems.map((product) => (
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
            placeholder="Votre numéro de téléphone"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            className="order-form__phone-input"
          />
        </div>

        <button
          className="order-form__send"
          onClick={handleSend}
          disabled={!cartItems.length}
        >
          <MessageCircle size={18} /> Envoyer sur WhatsApp
        </button>
      </div>
    </div>
  );
};

// ── Главный компонент ─────────────────────────────────

export default function SellerProfilePage({
  seller,
  categories,
  products,
  pagination,
  initialFilters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef(null);

  const [orderOpen, setOrderOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [query, setQuery] = useState(initialFilters.query || "");

  const { cart, addItem, removeItem, totalItems, totalPrice, clearCart } =
    useCart(seller._id);

  // Восстанавливаем скролл после фильтрации
  useEffect(() => {
    const saved = sessionStorage.getItem("seller_scroll");
    if (saved) {
      sessionStorage.removeItem("seller_scroll");
      window.scrollTo({ top: parseInt(saved), behavior: "instant" });
    }
  }, [searchParams]);

  const pushUrl = useCallback(
    (newQuery, newCategory, newPage = 1, saveScroll = true) => {
      if (saveScroll) {
        sessionStorage.setItem("seller_scroll", window.scrollY.toString());
      }
      const params = new URLSearchParams();
      if (newQuery) params.set("query", newQuery);
      if (newCategory) params.set("category", newCategory);
      if (newPage > 1) params.set("page", newPage);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      pushUrl(val, initialFilters.category);
    }, 400);
  };

  const handleCategory = (categoryId) => {
    pushUrl(query, categoryId);
  };

  const handlePage = (newPage) => {
    pushUrl(query, initialFilters.category, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFav = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await clientApi.post(`/clients/favorites/${seller._id}`);
      setIsFav((prev) => !prev);
    } catch {}
  };

  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;
  const currentPage = pagination?.page ?? 1;
  const total = pagination?.total ?? products.length;

  return (
    <div className="seller-profile">
      {/* ── Обложка ── */}
      <div className="seller-profile__cover">
        {seller.coverImage ? (
          <img src={getImageUrl(seller.coverImage)} alt={seller.name} />
        ) : (
          <div className="seller-profile__cover-empty" />
        )}
        <div className="seller-profile__logo-wrap">
          {seller.logo ? (
            <img
              src={getImageUrl(seller.logo)}
              alt={seller.name}
              className="seller-profile__logo"
            />
          ) : (
            <div className="seller-profile__logo-placeholder">
              {seller.name?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* ── Контент ── */}
      <div className="seller-profile__body">
        <div className="container">
          {/* Кнопка назад */}
          <button
            className="seller-profile__back"
            onClick={() => router.back()}
          >
            <ArrowLeft size={16} /> Retour
          </button>

          {/* Инфо о продавце */}
          <div className="seller-profile__info">
            <div className="seller-profile__title-row">
              <div>
                <h1 className="seller-profile__name">{seller.name}</h1>
                <p className="seller-profile__type">{seller.businessType}</p>
              </div>
              <button
                className={`seller-profile__fav ${isFav ? "seller-profile__fav--active" : ""}`}
                onClick={handleToggleFav}
              >
                <Heart size={20} fill={isFav ? "currentColor" : "none"} />
              </button>
            </div>

            {seller.averageRating > 0 && (
              <div className="seller-profile__rating">
                <StarRating value={seller.averageRating} size={16} />
                <span className="seller-profile__rating-count">
                  ({seller.totalRatings})
                </span>
              </div>
            )}

            {seller.address && (
              <p className="seller-profile__address">
                <MapPin size={14} /> {seller.address}
              </p>
            )}

            {seller.description && (
              <p className="seller-profile__desc">{seller.description}</p>
            )}

            {seller.legalInfo && (
              <p className="seller-profile__legal">{seller.legalInfo}</p>
            )}

            <div className="seller-profile__contacts">
              {seller.phone && (
                <a
                  href={`tel:${seller.phone}`}
                  className="seller-profile__contact-btn seller-profile__contact-btn--phone"
                >
                  <Phone size={16} /> {seller.phone}
                </a>
              )}
            </div>
          </div>

          {/* ── Товары ── */}
          <div className="seller-profile__products">
            <div className="seller-profile__products-layout">
              {/* Сайдбар категорий */}
              {categories.length > 0 && (
                <aside className="seller-profile__sidebar">
                  <p className="seller-profile__sidebar-title">Catégories</p>
                  <ul className="seller-profile__sidebar-list">
                    <li>
                      <button
                        className={`seller-profile__sidebar-btn ${!initialFilters.category ? "seller-profile__sidebar-btn--active" : ""}`}
                        onClick={() => handleCategory("")}
                      >
                        Tous{" "}
                        <span className="seller-profile__sidebar-count">
                          {total}
                        </span>
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          className={`seller-profile__sidebar-btn ${initialFilters.category === cat._id ? "seller-profile__sidebar-btn--active" : ""}`}
                          onClick={() => handleCategory(cat._id)}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              {/* Основной контент */}
              <div className="seller-profile__products-main">
                {/* Поиск */}
                <div className="seller-profile__search-wrap">
                  <Search size={15} className="seller-profile__search-icon" />
                  <input
                    className="seller-profile__search"
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={query}
                    onChange={handleQueryChange}
                  />
                </div>

                {/* Сетка товаров */}
                {products.length === 0 ? (
                  <div className="seller-profile__empty">
                    <p>Aucun produit trouvé</p>
                  </div>
                ) : (
                  <div className="seller-profile__products-grid">
                    {products.map((product) => (
                      <PublicProductCard
                        key={product._id}
                        product={product}
                        sellerSlug={seller.slug}
                        cart={cart}
                        onAdd={addItem}
                        onRemove={removeItem}
                      />
                    ))}
                  </div>
                )}

                {/* Пагинация */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Панель корзины ── */}
      {seller.whatsapp && totalItems > 0 && (
        <div className="cart-bar" onClick={() => setOrderOpen(true)}>
          <div className="cart-bar__left">
            <span className="cart-bar__count">{totalItems}</span>
            <span className="cart-bar__label">
              article{totalItems > 1 ? "s" : ""} dans le panier
            </span>
          </div>
          <div className="cart-bar__right">
            {totalPrice(products) > 0 && (
              <span className="cart-bar__total">
                {totalPrice(products).toLocaleString("fr-FR")} €
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
          products={products}
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
