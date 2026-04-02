"use client";

// ═══════════════════════════════════════════════════════
// SellerProfilePage — публичная страница продавца
// src/modules/SellerProfilePage/SellerProfilePage.jsx
// ═══════════════════════════════════════════════════════

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
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
import { validatePhone } from "@/lib/validation/orderForm.fr.schema";
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
  const [phoneError, setPhoneError] = useState("");

  // products уже отфильтрован через getCartItems
  const cartItems = products;

  const total = cartItems.reduce((sum, p) => {
    return sum + (p?.price || 0) * (cart[p._id] || p.quantity || 0);
  }, 0);

  const handleSend = () => {
    if (!cartItems.length) {
      alert("Choisissez au moins un produit");
      return;
    }
    const err = validatePhone(clientPhone);
    if (err) {
      setPhoneError(err);
      return;
    }
    setPhoneError("");

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
          disabled={!cartItems.length}
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

export default function SellerProfilePage({
  seller,
  categories,
  products,
  pagination,
  productsTotalAll = null,
  initialFilters = {},
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timerRef = useRef(null);
  const sidebarListRef = useRef(null);

  const [orderOpen, setOrderOpen] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [myRating, setMyRating] = useState(null);
  const [query, setQuery] = useState(initialFilters.query || "");

  const {
    cart,
    addItem,
    removeItem,
    totalItems,
    totalPrice,
    clearCart,
    getCartItems,
  } = useCart(seller._id);

  useEffect(() => {
    clientApi
      .get("/clients/favorites")
      .then((json) => {
        const favs = json.data || [];
        setIsFav(favs.some((s) => s._id === seller._id || s === seller._id));
      })
      .catch(() => {});

    clientApi
      .get(`/ratings/seller/${seller._id}/my`)
      .then((json) => {
        setMyRating(json.data?.rating || null);
      })
      .catch(() => {});
  }, [seller._id]);

  useEffect(() => {
    const saved = sessionStorage.getItem("seller_scroll");
    if (saved) {
      sessionStorage.removeItem("seller_scroll");
      window.scrollTo({ top: parseInt(saved), behavior: "instant" });
    }
  }, [searchParams]);

  const pushUrl = useCallback(
    (newQuery, newCategory, newPage = 1, saveScroll = true) => {
      if (saveScroll)
        sessionStorage.setItem("seller_scroll", window.scrollY.toString());
      const params = new URLSearchParams();
      if (newQuery) params.set("query", newQuery);
      if (newCategory) params.set("category", newCategory);
      if (newPage > 1) params.set("page", newPage);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname],
  );
  //на список и заблокируй вертикальный скролл
  useEffect(() => {
    const el = sidebarListRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let isHorizontal = false;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isHorizontal = false;
    };

    const onTouchMove = (e) => {
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);

      // определяем направление по первому движению
      if (dx > dy) {
        isHorizontal = true;
      }

      // если горизонтальный скролл — блокируем вертикальный скролл страницы
      if (isHorizontal) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false }); // passive: false — чтобы preventDefault работал

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => pushUrl(val, initialFilters.category),
      400,
    );
  };

  const handleCategory = (categoryId) => pushUrl(query, categoryId);

  const handlePage = (newPage) => {
    pushUrl(query, initialFilters.category, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleFav = async () => {
    try {
      await clientApi.post(`/clients/favorites/${seller._id}`);
      setIsFav((prev) => !prev);
    } catch (err) {
      if (err.message?.includes("401") || err.message?.includes("Токен"))
        router.push("/login");
    }
  };

  const handleRate = async (rating) => {
    try {
      if (rating === null) {
        await clientApi.delete(`/ratings/seller/${seller._id}/my`);
        setMyRating(null);
      } else {
        await clientApi.post(`/ratings/seller/${seller._id}`, { rating });
        setMyRating(rating);
      }
    } catch (err) {
      if (err.message?.includes("401") || err.message?.includes("Токен"))
        router.push("/login");
    }
  };

  const totalPages = pagination?.totalPages ?? pagination?.pages ?? 1;
  const currentPage = pagination?.page ?? 1;
  const total = pagination?.total ?? products.length;

  return (
    <div className="seller-profile">
      {/* ── Обложка внутри container ── */}
      <div className="seller-profile__cover-wrap">
        <div className="container">
          <div className="seller-profile__cover">
            <div className="seller-profile__cover-img-wrap">
              {seller.coverImage ? (
                <img src={getImageUrl(seller.coverImage)} alt={seller.name} />
              ) : (
                <div className="seller-profile__cover-empty" />
              )}
            </div>

            {/* Лого — левый нижний угол */}
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

            {/* Рейтинг — правый верхний угол */}
            {seller.averageRating > 0 && (
              <div className="seller-profile__cover-rating">
                <StarRating value={seller.averageRating} size={14} />
                <span className="seller-profile__cover-rating-count">
                  ({seller.totalRatings})
                </span>
              </div>
            )}
          </div>
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

          {/* ── Инфо — двухколоночный ── */}
          <div className="seller-profile__info">
            {/* Левая колонка */}
            <div className="seller-profile__info-left">
              <div className="seller-profile__title-row">
                <h1 className="seller-profile__name">{seller.name}</h1>
                <p className="seller-profile__type">{seller.businessType}</p>
              </div>

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
            </div>

            {/* Правая колонка */}
            <div className="seller-profile__info-right">
              {/* Контакты */}
              {seller.phone && (
                <a
                  href={`tel:${seller.phone}`}
                  className="seller-profile__contact-btn seller-profile__contact-btn--phone"
                >
                  <Phone size={16} /> {seller.phone}
                </a>
              )}

              {/* Оценить продавца */}
              <div className="seller-profile__rate">
                <div className="seller-profile__rate-head">
                  <p className="seller-profile__rate-label">
                    {myRating ? "Votre note" : "Noter ce vendeur"}
                  </p>
                  <button
                    className={`seller-profile__fav ${isFav ? "seller-profile__fav--active" : ""}`}
                    onClick={handleToggleFav}
                    title={
                      isFav ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                  >
                    <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="seller-profile__rate-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`seller-profile__rate-star ${myRating >= star ? "seller-profile__rate-star--active" : ""}`}
                      onClick={() => handleRate(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {myRating && (
                  <button
                    className="seller-profile__rate-delete"
                    onClick={() => handleRate(null)}
                  >
                    Supprimer ma note
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Товары ── */}
          <div className="seller-profile__products">
            <div className="seller-profile__products-layout">
              {categories.length > 0 && (
                <aside className="seller-profile__sidebar">
                  <p className="seller-profile__sidebar-title">Catégories</p>
                  <ul
                    className="seller-profile__sidebar-list"
                    ref={sidebarListRef}
                  >
                    <li>
                      <button
                        className={`seller-profile__sidebar-btn ${!initialFilters.category ? "seller-profile__sidebar-btn--active" : ""}`}
                        onClick={() => handleCategory("")}
                      >
                        Tous{" "}
                        <span className="seller-profile__sidebar-count">
                          {productsTotalAll ?? total}
                        </span>
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat._id}>
                        <button
                          className={`seller-profile__sidebar-btn ${initialFilters.category === cat.slug ? "seller-profile__sidebar-btn--active" : ""}`}
                          onClick={() => handleCategory(cat.slug)}
                        >
                          {cat.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              <div className="seller-profile__products-main">
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
          products={getCartItems(products)}
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
