"use client";

// ═══════════════════════════════════════════════════════
// SellerDetailPage — детальная страница продавца
// /admins-piruza/owner/sellers/[slug]
// ═══════════════════════════════════════════════════════

import {
  useState,
  useRef,
  useTransition,
  useActionState,
  useEffect,
} from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Upload,
  X,
  Plus,
  Building2,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Tag,
  Calendar,
  Package,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
} from "lucide-react";

import {
  activateSellerAction,
  extendSellerAction,
  deactivateSellerAction,
  moveToDraftAction,
  deleteSellerAction,
  uploadSellerLogoAction,
  deleteSellerLogoAction,
  uploadSellerCoverAction,
  deleteSellerCoverAction,
} from "@/app/actions/seller.actions";

import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  uploadProductImageAction,
  deleteProductImageAction,
} from "@/app/actions/product.actions";

import {
  createSellerCategoryAction,
  updateSellerCategoryAction,
  deleteSellerCategoryAction,
} from "@/app/actions/category.actions";

import "./SellerDetailPage.scss";

import { getImageUrl } from "@/lib/utils";

// ── Утилиты ──────────────────────────────────────────

const STATUS_MAP = {
  active: { label: "Активен", cls: "active" },
  draft: { label: "Черновик", cls: "draft" },
  expired: { label: "Истёк", cls: "expired" },
  inactive: { label: "Неактивен", cls: "inactive" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, cls: "draft" };
  return (
    <span className={`sellers-badge sellers-badge--${s.cls}`}>{s.label}</span>
  );
}

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// ── Модальное окно (переиспользуем паттерн) ──────────

function Modal({ title, onClose, wide, children }) {
  return (
    <div
      className="sellers-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`sellers-modal__box${wide ? " sellers-modal__box--wide" : ""}`}
      >
        <div className="sellers-modal__header">
          <span className="sellers-modal__title">{title}</span>
          <button className="sellers-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Загрузка изображения (лого / обложка) ────────────

function ImageUploader({ label, currentImage, onUpload, onDelete, loading }) {
  const inputRef = useRef();

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    await onUpload(fd, !!currentImage);
    e.target.value = "";
  }

  return (
    <div className="detail-image-uploader">
      <div className="detail-image-uploader__preview">
        {currentImage ? (
          <img src={getImageUrl(currentImage)} alt={label} />
        ) : (
          <div className="detail-image-uploader__empty">
            <ImageIcon size={28} />
          </div>
        )}
      </div>
      <div className="detail-image-uploader__controls">
        <span className="detail-image-uploader__label">{label}</span>
        <div className="detail-image-uploader__btns">
          <button
            className="sellers-btn sellers-btn--ghost sellers-btn--sm"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            <Upload size={14} />
            {currentImage ? "Заменить" : "Загрузить"}
          </button>
          {currentImage && (
            <button
              className="sellers-btn sellers-btn--danger sellers-btn--sm"
              onClick={onDelete}
              disabled={loading}
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          hidden
        />
      </div>
    </div>
  );
}

// ── Форма активации / продления ──────────────────────

function ActivateModal({ seller, mode, onClose }) {
  const [months, setMonths] = useState(1);
  const [loading, startTransition] = useTransition();

  async function handleSubmit() {
    startTransition(async () => {
      const res =
        mode === "extend"
          ? await extendSellerAction(seller._id, months, seller.slug)
          : await activateSellerAction(seller._id, months, seller.slug);

      if (res.success) {
        toast.success(mode === "extend" ? "Продлено!" : "Активирован!");
        onClose();
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <Modal
      title={mode === "extend" ? "Продлить подписку" : "Активировать продавца"}
      onClose={onClose}
    >
      <div className="sellers-modal__form">
        <p className="sellers-modal__subtitle">
          Продавец: <strong>{seller.name}</strong>
        </p>
        <div className="sellers-modal__field">
          <label>Количество месяцев</label>
          <input
            type="number"
            min={1}
            max={24}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
          />
        </div>
        <div className="sellers-modal__actions">
          <button className="sellers-btn sellers-btn--ghost" onClick={onClose}>
            Отмена
          </button>
          <button
            className="sellers-btn sellers-btn--primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Подтвердить"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ── Форма товара ──────────────────────────────────────

const PRODUCT_INIT = { success: null, message: "" };

function ProductModal({ seller, product, categories, onClose }) {
  const isEdit = !!product;
  const action = isEdit ? updateProductAction : createProductAction;
  const [state, formAction, pending] = useActionState(action, PRODUCT_INIT);

  useEffect(() => {
    if (state.success === true) {
      toast.success(
        state.message || (isEdit ? "Товар обновлён" : "Товар создан"),
      );
      onClose();
    }
  }, [state.success]);

  return (
    <Modal
      title={isEdit ? "Редактировать товар" : "Новый товар"}
      onClose={onClose}
    >
      <form action={formAction} className="sellers-modal__form">
        <input type="hidden" name="sellerSlug" value={seller.slug} />
        <input type="hidden" name="sellerId" value={seller._id} />
        {isEdit && <input type="hidden" name="id" value={product._id} />}

        {state.success === false && (
          <div className="sellers-modal__error">{state.message}</div>
        )}

        <div className="sellers-modal__grid">
          <div className="sellers-modal__field sellers-modal__field--full">
            <label>Название *</label>
            <input name="name" defaultValue={product?.name || ""} required />
          </div>

          <div className="sellers-modal__field">
            <label>Цена</label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              defaultValue={product?.price ?? ""}
            />
          </div>

          <div className="sellers-modal__field">
            <label>Артикул (код)</label>
            <input name="code" defaultValue={product?.code || ""} />
          </div>

          <div className="sellers-modal__field sellers-modal__field--full">
            <label>Категория</label>
            <select
              name="categoryId"
              defaultValue={product?.category?._id || ""}
            >
              <option value="">— без категории —</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sellers-modal__field sellers-modal__field--full">
            <label>Описание</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={product?.description || ""}
            />
          </div>

          <div className="sellers-modal__field">
            <label>Доступность</label>
            <select
              name="isAvailable"
              defaultValue={product?.isAvailable !== false ? "true" : "false"}
            >
              <option value="true">В наличии</option>
              <option value="false">Нет в наличии</option>
            </select>
          </div>
        </div>

        <div className="sellers-modal__actions">
          <button
            type="button"
            className="sellers-btn sellers-btn--ghost"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="sellers-btn sellers-btn--primary"
            disabled={pending}
          >
            {pending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Строка товара ─────────────────────────────────────

function ProductRow({ product, seller, basePath, onEdit }) {
  const [imgLoading, startImgTransition] = useTransition();
  const [deleting, startDeleteTransition] = useTransition();

  async function handleImageUpload(fd, hasImage) {
    startImgTransition(async () => {
      const res = await uploadProductImageAction(
        product._id,
        seller.slug,
        fd,
        hasImage,
      );
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  async function handleImageDelete() {
    if (!confirm("Удалить изображение?")) return;
    startImgTransition(async () => {
      const res = await deleteProductImageAction(product._id, seller.slug);
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  async function handleDelete() {
    if (!confirm(`Удалить товар "${product.name}"?`)) return;
    startDeleteTransition(async () => {
      const res = await deleteProductAction(product._id, seller.slug);
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  return (
    <tr
      className={deleting ? "product-row product-row--deleting" : "product-row"}
    >
      {/* Изображение */}
      <td className="product-row__img-cell">
        <div className="product-row__img-wrap">
          {product.image ? (
            <img src={getImageUrl(product.image)} alt={product.name} />
          ) : (
            <div className="product-row__img-empty">
              <Package size={16} />
            </div>
          )}
          <div className="product-row__img-overlay">
            <label className="product-row__img-btn" title="Загрузить фото">
              <Upload size={12} />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.append("image", f);
                  handleImageUpload(fd, !!product.image);
                  e.target.value = "";
                }}
              />
            </label>
            {product.image && (
              <button
                className="product-row__img-btn product-row__img-btn--del"
                onClick={handleImageDelete}
                title="Удалить фото"
                disabled={imgLoading}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </td>

      {/* Название + код */}
      <td>
        <Link
          href={`${basePath}/${seller.slug}/products/${product.slug}`}
          className="product-row__name product-row__name--link"
        >
          {product.name}
        </Link>
        {product.code && (
          <div className="product-row__meta">#{product.code}</div>
        )}
      </td>

      {/* Категория */}
      <td className="product-row__cat">
        {product.category?.name || <span className="product-row__none">—</span>}
      </td>

      {/* Цена */}
      <td className="product-row__price">
        {product.price != null ? (
          `${product.price} ₽`
        ) : (
          <span className="product-row__none">—</span>
        )}
      </td>

      {/* Наличие */}
      <td>
        {product.isAvailable !== false ? (
          <span className="sellers-badge sellers-badge--active">В наличии</span>
        ) : (
          <span className="sellers-badge sellers-badge--inactive">Нет</span>
        )}
      </td>

      {/* Действия */}
      <td>
        <div className="sellers-actions">
          <button
            className="sellers-btn sellers-btn--ghost sellers-btn--sm"
            onClick={() => onEdit(product)}
          >
            <Edit size={13} />
          </button>
          <button
            className="sellers-btn sellers-btn--danger sellers-btn--sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
}

// ══════════════════════════════════════════════════════
// ЛОКАЛЬНЫЕ КАТЕГОРИИ
// ══════════════════════════════════════════════════════

const CAT_INIT = { success: null, message: "" };

function LocalCategoryModal({ seller, category, onClose }) {
  const isEdit = !!category;
  const action = isEdit
    ? updateSellerCategoryAction
    : createSellerCategoryAction;
  const [state, formAction, pending] = useActionState(action, CAT_INIT);

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
      onClose();
    }
  }, [state.success]);

  return (
    <Modal
      title={isEdit ? "Редактировать категорию" : "Новая категория"}
      onClose={onClose}
    >
      <form action={formAction} className="sellers-modal__form">
        <input type="hidden" name="sellerId" value={seller._id} />
        <input type="hidden" name="sellerSlug" value={seller.slug} />
        {isEdit && <input type="hidden" name="id" value={category._id} />}

        {state.success === false && (
          <div className="sellers-modal__error">{state.message}</div>
        )}

        <div className="sellers-modal__field">
          <label>Название *</label>
          <input
            name="name"
            type="text"
            defaultValue={category?.name || ""}
            placeholder="Например: Конфеты, Торты, Наборы..."
            required
            autoFocus
          />
        </div>

        <div className="sellers-modal__footer">
          <button
            type="button"
            className="sellers-btn sellers-btn--ghost"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            type="submit"
            className="sellers-btn sellers-btn--primary"
            disabled={pending}
          >
            {pending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function LocalCategoriesSection({ seller, categories }) {
  const [catModal, setCatModal] = useState(null); // null | 'create' | category
  const [deleting, startDelete] = useTransition();

  async function handleDelete(cat) {
    if (
      !confirm(
        `Удалить категорию "${cat.name}"?\nВсе товары этой категории потеряют привязку.`,
      )
    )
      return;
    startDelete(async () => {
      const res = await deleteSellerCategoryAction(
        cat._id,
        seller._id,
        seller.slug,
      );
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  return (
    <>
      <section className="detail-card detail-card--full">
        <div className="detail-card__head">
          <h2 className="detail-card__title">
            Локальные категории{" "}
            <span className="detail-card__count">
              {categories?.length || 0}
            </span>
          </h2>
          <button
            className="sellers-btn sellers-btn--primary sellers-btn--sm"
            onClick={() => setCatModal("create")}
          >
            <Plus size={14} /> Добавить категорию
          </button>
        </div>

        {categories?.length > 0 ? (
          <div className="local-cats">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`local-cat ${!cat.isActive ? "local-cat--inactive" : ""}`}
              >
                <div className="local-cat__info">
                  <Tag size={13} />
                  <span className="local-cat__name">{cat.name}</span>
                  {!cat.isActive && (
                    <span className="local-cat__badge">неактивна</span>
                  )}
                </div>
                <div className="sellers-actions">
                  <button
                    className="sellers-btn sellers-btn--ghost sellers-btn--sm"
                    onClick={() => setCatModal(cat)}
                    title="Редактировать"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    className="sellers-btn sellers-btn--danger sellers-btn--sm"
                    onClick={() => handleDelete(cat)}
                    disabled={deleting}
                    title="Удалить"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="detail-page__empty">
            <Tag size={28} />
            <p>Локальных категорий пока нет</p>
          </div>
        )}
      </section>

      {catModal && (
        <LocalCategoryModal
          seller={seller}
          category={catModal !== "create" ? catModal : null}
          onClose={() => setCatModal(null)}
        />
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════
// СЕКЦИЯ ТОВАРОВ С ФИЛЬТРАЦИЕЙ ПО КАТЕГОРИЯМ
// ══════════════════════════════════════════════════════

function ProductsSection({
  products,
  categories,
  seller,
  basePath,
  onAddProduct,
  onEditProduct,
}) {
  const [activeCat, setActiveCat] = useState("all");

  const filtered =
    activeCat === "all"
      ? products
      : activeCat === "none"
        ? products.filter((p) => !p.category)
        : products.filter((p) => p.category?._id === activeCat);

  // Считаем кол-во товаров по каждой категории
  const counts = {};
  products.forEach((p) => {
    const key = p.category?._id || "none";
    counts[key] = (counts[key] || 0) + 1;
  });

  return (
    <section className="detail-card detail-card--full">
      <div className="detail-card__head">
        <h2 className="detail-card__title">
          Товары{" "}
          <span className="detail-card__count">{products?.length || 0}</span>
        </h2>
        <button
          className="sellers-btn sellers-btn--primary sellers-btn--sm"
          onClick={onAddProduct}
        >
          <Plus size={14} /> Добавить товар
        </button>
      </div>

      {/* Фильтры по категориям */}
      {categories?.length > 0 && products?.length > 0 && (
        <div className="products-filter">
          <button
            className={`products-filter__btn ${activeCat === "all" ? "products-filter__btn--active" : ""}`}
            onClick={() => setActiveCat("all")}
          >
            Все
            <span className="products-filter__count">{products.length}</span>
          </button>

          {categories.map(
            (cat) =>
              counts[cat._id] > 0 && (
                <button
                  key={cat._id}
                  className={`products-filter__btn ${activeCat === cat._id ? "products-filter__btn--active" : ""}`}
                  onClick={() => setActiveCat(cat._id)}
                >
                  {cat.name}
                  <span className="products-filter__count">
                    {counts[cat._id] || 0}
                  </span>
                </button>
              ),
          )}

          {counts["none"] > 0 && (
            <button
              className={`products-filter__btn ${activeCat === "none" ? "products-filter__btn--active" : ""}`}
              onClick={() => setActiveCat("none")}
            >
              Без категории
              <span className="products-filter__count">{counts["none"]}</span>
            </button>
          )}
        </div>
      )}

      {filtered?.length > 0 ? (
        <div className="detail-page__table-wrap">
          <table className="detail-page__table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Название</th>
                <th>Категория</th>
                <th>Цена</th>
                <th>Наличие</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <ProductRow
                  key={p._id}
                  product={p}
                  seller={seller}
                  basePath={basePath}
                  onEdit={onEditProduct}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="detail-page__empty">
          <Package size={32} />
          <p>
            {activeCat === "all"
              ? "Товаров пока нет"
              : "Нет товаров в этой категории"}
          </p>
        </div>
      )}
    </section>
  );
}

// ══════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ══════════════════════════════════════════════════════

export default function SellerDetailPage({
  seller,
  products,
  categories,
  basePath = "/admins-piruza/owner/sellers",
  managerMode = false,
}) {
  const [activateModal, setActivateModal] = useState(null);
  const [productModal, setProductModal] = useState(null);
  const [imgLoading, startImgTransition] = useTransition();
  const [statusLoading, startStatusTransition] = useTransition();

  // ── Управление статусом ──

  function handleDeactivate() {
    if (!confirm(`Деактивировать "${seller.name}"?`)) return;
    startStatusTransition(async () => {
      const res = await deactivateSellerAction(seller._id, seller.slug);
      res.success ? toast.success("Деактивирован") : toast.error(res.message);
    });
  }

  function handleDraft() {
    if (!confirm(`Перевести "${seller.name}" в черновик?`)) return;
    startStatusTransition(async () => {
      const res = await moveToDraftAction(seller._id, seller.slug);
      res.success
        ? toast.success("Переведён в черновик")
        : toast.error(res.message);
    });
  }

  // ── Изображения продавца ──

  async function handleLogoUpload(fd, hasLogo) {
    startImgTransition(async () => {
      const res = await uploadSellerLogoAction(
        seller._id,
        seller.slug,
        fd,
        hasLogo,
      );
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  async function handleLogoDelete() {
    if (!confirm("Удалить лого?")) return;
    startImgTransition(async () => {
      const res = await deleteSellerLogoAction(seller._id, seller.slug);
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  async function handleCoverUpload(fd, hasCover) {
    startImgTransition(async () => {
      const res = await uploadSellerCoverAction(
        seller._id,
        seller.slug,
        fd,
        hasCover,
      );
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  async function handleCoverDelete() {
    if (!confirm("Удалить обложку?")) return;
    startImgTransition(async () => {
      const res = await deleteSellerCoverAction(seller._id, seller.slug);
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  const canActivate = ["draft", "expired", "inactive"].includes(seller.status);
  const canExtend = seller.status === "active";
  const canDeactivate = ["active", "expired"].includes(seller.status);
  const canDraft = seller.status !== "draft";

  return (
    <div className="detail-page">
      {/* ── Навигация ── */}
      <div className="detail-page__nav">
        <Link href={basePath} className="detail-page__back">
          <ArrowLeft size={16} />
          Все продавцы
        </Link>
        <Link
          href={`${basePath}/${seller.slug}/edit`}
          className="sellers-btn sellers-btn--primary sellers-btn--sm"
        >
          <Edit size={14} />
          Редактировать
        </Link>
      </div>

      {/* ── Обложка + шапка ── */}
      <div className="detail-page__hero">
        <div className="detail-page__cover">
          {seller.coverImage ? (
            <img
              src={getImageUrl(seller.coverImage)}
              alt="Обложка"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div className="detail-page__cover-empty">Нет обложки</div>
          )}
          {/* ── Рейтинг ── */}
          <div className="detail-page__rating">
            <Star size={14} className="detail-page__rating-star" />
            <span className="detail-page__rating-value">
              {seller.rating?.average ? seller.rating.average.toFixed(1) : "—"}
            </span>
            {seller.rating?.count > 0 && (
              <span className="detail-page__rating-count">
                ({seller.rating.count})
              </span>
            )}
          </div>
        </div>
        <div className="detail-page__hero-content">
          <div className="detail-page__logo">
            {seller.logo ? (
              <img
                src={getImageUrl(seller.logo)}
                alt="Лого"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 12,
                }}
              />
            ) : (
              <Building2 size={32} />
            )}
          </div>
          <div className="detail-page__hero-info">
            <h1 className="detail-page__name">{seller.name}</h1>
            <div className="detail-page__hero-meta">
              <StatusBadge status={seller.status} />
              <span className="detail-page__type">{seller.businessType}</span>
              {seller.city && (
                <span className="detail-page__city">
                  <MapPin size={13} /> {seller.city.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Основная сетка ── */}
      <div className="detail-page__body">
        {/* ── Колонка: инфо ── */}
        <div className="detail-page__col detail-page__col--main">
          {/* Управление статусом — только Owner/Admin */}
          {!managerMode && (
            <section className="detail-card">
              <h2 className="detail-card__title">Управление статусом</h2>
              <div className="detail-card__status-row">
                <StatusBadge status={seller.status} />
                <div className="sellers-actions">
                  {canActivate && (
                    <button
                      className="sellers-btn sellers-btn--success sellers-btn--sm"
                      onClick={() => setActivateModal("activate")}
                      disabled={statusLoading}
                    >
                      <CheckCircle size={14} /> Активировать
                    </button>
                  )}
                  {canExtend && (
                    <button
                      className="sellers-btn sellers-btn--info sellers-btn--sm"
                      onClick={() => setActivateModal("extend")}
                      disabled={statusLoading}
                    >
                      <Clock size={14} /> Продлить
                    </button>
                  )}
                  {canDeactivate && (
                    <button
                      className="sellers-btn sellers-btn--warning sellers-btn--sm"
                      onClick={handleDeactivate}
                      disabled={statusLoading}
                    >
                      <XCircle size={14} /> Деактивировать
                    </button>
                  )}
                  {canDraft && (
                    <button
                      className="sellers-btn sellers-btn--ghost sellers-btn--sm"
                      onClick={handleDraft}
                      disabled={statusLoading}
                    >
                      <FileText size={14} /> В черновик
                    </button>
                  )}
                </div>
              </div>
              {(seller.activationStartDate || seller.activationEndDate) && (
                <div className="detail-card__dates">
                  <span>
                    <Calendar size={13} /> Начало:{" "}
                    {formatDate(seller.activationStartDate)}
                  </span>
                  <span>
                    <Calendar size={13} /> Конец:{" "}
                    <span
                      className={
                        seller.status === "expired"
                          ? "detail-card__date--expired"
                          : ""
                      }
                    >
                      {formatDate(seller.activationEndDate)}
                    </span>
                  </span>
                </div>
              )}
            </section>
          )}

          {/* Контактная информация */}
          <section className="detail-card">
            <h2 className="detail-card__title">Контакты</h2>
            <div className="detail-card__info-list">
              <div className="detail-card__info-row">
                <Phone size={14} />
                <span>{seller.phone || "—"}</span>
              </div>
              <div className="detail-card__info-row">
                <MessageCircle size={14} />
                <span>{seller.whatsapp || "—"}</span>
              </div>
              <div className="detail-card__info-row">
                <Mail size={14} />
                <span>{seller.email || "—"}</span>
              </div>
              <div className="detail-card__info-row">
                <MapPin size={14} />
                <span>{seller.address || "—"}</span>
              </div>
            </div>
          </section>

          {/* Описание */}
          {seller.description && (
            <section className="detail-card">
              <h2 className="detail-card__title">Описание</h2>
              <p className="detail-card__text">{seller.description}</p>
            </section>
          )}

          {/* Юридическая информация */}
          {seller.legalInfo && (
            <section className="detail-card">
              <h2 className="detail-card__title">Юридическая информация</h2>
              <p className="detail-card__text detail-card__text--mono">
                {seller.legalInfo}
              </p>
            </section>
          )}

          {/* Глобальные категории */}
          <section className="detail-card">
            <h2 className="detail-card__title">Глобальные категории</h2>
            {seller.globalCategories?.length > 0 ? (
              <div className="detail-card__tags">
                {seller.globalCategories.map((cat) => (
                  <span key={cat._id} className="detail-card__tag">
                    <Tag size={11} /> {cat.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="detail-card__empty">Не указаны</p>
            )}
          </section>
        </div>

        {/* ── Колонка: медиа ── */}
        <div className="detail-page__col detail-page__col--side">
          {/* Мета */}
          <section className="detail-card">
            <h2 className="detail-card__title">Информация</h2>
            <div className="detail-card__meta-list">
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Slug</span>
                <span className="detail-card__meta-value detail-card__meta-value--mono">
                  {seller.slug}
                </span>
              </div>
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Тип бизнеса</span>
                <span className="detail-card__meta-value">
                  {seller.businessType}
                </span>
              </div>
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Город</span>
                <span className="detail-card__meta-value">
                  {seller.city?.name || "—"}
                </span>
              </div>
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Создан</span>
                <span className="detail-card__meta-value">
                  {formatDate(seller.createdAt)}
                </span>
              </div>
            </div>
          </section>

          {/* Загрузка изображений */}
          <section className="detail-card">
            <h2 className="detail-card__title">Медиа</h2>
            <div className="detail-card__images">
              <ImageUploader
                label="Логотип"
                currentImage={seller.logo}
                onUpload={handleLogoUpload}
                onDelete={handleLogoDelete}
                loading={imgLoading}
              />
              <ImageUploader
                label="Обложка"
                currentImage={seller.coverImage}
                onUpload={handleCoverUpload}
                onDelete={handleCoverDelete}
                loading={imgLoading}
              />
            </div>
          </section>
        </div>
      </div>

      {/* ── Локальные категории ── */}
      <LocalCategoriesSection seller={seller} categories={categories} />

      {/* ── Товары ── */}
      <ProductsSection
        products={products}
        categories={categories}
        seller={seller}
        basePath={basePath}
        onAddProduct={() => setProductModal("create")}
        onEditProduct={(p) => setProductModal(p)}
      />

      {/* ── Модальные окна ── */}
      {activateModal && (
        <ActivateModal
          seller={seller}
          mode={activateModal}
          onClose={() => setActivateModal(null)}
        />
      )}

      {productModal && (
        <ProductModal
          seller={seller}
          product={productModal !== "create" ? productModal : null}
          categories={categories || []}
          onClose={() => setProductModal(null)}
        />
      )}
    </div>
  );
}
