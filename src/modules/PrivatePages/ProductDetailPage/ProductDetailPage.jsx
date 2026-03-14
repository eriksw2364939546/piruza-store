"use client";

// ═══════════════════════════════════════════════════════
// ProductDetailPage — детальная страница товара
// /admins-piruza/[role]/sellers/[slug]/products/[productSlug]
// ═══════════════════════════════════════════════════════

import {
  useState,
  useTransition,
  useActionState,
  useEffect,
  useRef,
} from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Upload,
  X,
  Tag,
  Package,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import {
  updateProductAction,
  deleteProductAction,
  uploadProductImageAction,
  deleteProductImageAction,
} from "@/app/actions/product.actions";
import "./ProductDetailPage.scss";

const INIT = { success: null, message: "" };

function formatPrice(price) {
  if (price == null) return "—";
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "EUR",
  }).format(price);
}

// ── Модалка редактирования ────────────────────────────

function EditProductModal({
  product,
  categories,
  sellerSlug,
  basePath,
  onClose,
}) {
  const action = updateProductAction;
  const [state, formAction, pending] = useActionState(action, INIT);

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message || "Товар обновлён");
      // Если slug изменился — редиректим на новый URL
      if (state.slug && state.slug !== product.slug) {
        window.location.href = `${basePath}/${sellerSlug}/products/${state.slug}`;
      } else {
        onClose();
      }
    }
  }, [state.success]);

  return (
    <div
      className="sellers-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sellers-modal__box">
        <div className="sellers-modal__header">
          <span className="sellers-modal__title">Редактировать товар</span>
          <button className="sellers-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form action={formAction} className="sellers-modal__form">
          <input type="hidden" name="id" value={product._id} />
          <input type="hidden" name="sellerSlug" value={sellerSlug} />
          <input type="hidden" name="basePath" value={basePath} />

          {state.success === false && (
            <div className="sellers-modal__error">{state.message}</div>
          )}

          <div className="sellers-modal__grid">
            <div className="sellers-modal__field sellers-modal__field--full">
              <label>Название *</label>
              <input name="name" defaultValue={product.name} required />
            </div>

            <div className="sellers-modal__field">
              <label>Цена (€)</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product.price ?? ""}
              />
            </div>

            <div className="sellers-modal__field">
              <label>Код артикула</label>
              <input name="code" defaultValue={product.code || ""} />
            </div>

            <div className="sellers-modal__field sellers-modal__field--full">
              <label>Категория</label>
              <select
                name="category"
                defaultValue={product.category?._id || ""}
              >
                <option value="">— Без категории —</option>
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
                rows={4}
                defaultValue={product.description || ""}
              />
            </div>

            <div className="sellers-modal__field">
              <label>Доступность</label>
              <select
                name="isAvailable"
                defaultValue={product.isAvailable !== false ? "true" : "false"}
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
              {pending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Главный компонент ─────────────────────────────────

export default function ProductDetailPage({
  product,
  categories = [],
  sellerSlug,
  basePath,
}) {
  const [showEdit, setShowEdit] = useState(false);
  const [imgLoading, startImgTransition] = useTransition();
  const [deleting, startDeleteTransition] = useTransition();
  const inputRef = useRef();

  const backHref = `${basePath}/${sellerSlug}`;

  // ── Изображение ──

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("image", file);
    startImgTransition(async () => {
      const res = await uploadProductImageAction(
        product._id,
        sellerSlug,
        fd,
        !!product.image,
      );
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
    e.target.value = "";
  }

  async function handleImageDelete() {
    if (!confirm("Удалить изображение?")) return;
    startImgTransition(async () => {
      const res = await deleteProductImageAction(product._id, sellerSlug);
      res.success ? toast.success(res.message) : toast.error(res.message);
    });
  }

  // ── Удаление товара ──

  function handleDelete() {
    if (!confirm(`Удалить товар "${product.name}"?\nЭто действие необратимо.`))
      return;
    startDeleteTransition(async () => {
      const res = await deleteProductAction(product._id, sellerSlug);
      if (res.success) {
        toast.success(res.message);
        window.location.href = backHref;
      } else {
        toast.error(res.message);
      }
    });
  }

  return (
    <div className="product-detail">
      {/* ── Навигация ── */}
      <div className="product-detail__nav">
        <Link href={backHref} className="product-detail__back">
          <ArrowLeft size={16} /> Назад к продавцу
        </Link>
        <div className="sellers-actions">
          <button
            className="sellers-btn sellers-btn--ghost sellers-btn--sm"
            onClick={() => setShowEdit(true)}
          >
            <Edit size={14} /> Редактировать
          </button>
          <button
            className="sellers-btn sellers-btn--danger sellers-btn--sm"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 size={14} /> {deleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>

      {/* ── Основной контент ── */}
      <div className="product-detail__body">
        {/* ── Изображение ── */}
        <div className="product-detail__img-col">
          <div className="product-detail__img-wrap">
            {product.image ? (
              <img src={getImageUrl(product.image)} alt={product.name} />
            ) : (
              <div className="product-detail__img-empty">
                <Package size={48} />
                <span>Нет фото</span>
              </div>
            )}
            <div className="product-detail__img-actions">
              <button
                className="sellers-btn sellers-btn--ghost sellers-btn--sm"
                onClick={() => inputRef.current?.click()}
                disabled={imgLoading}
              >
                <Upload size={14} />
                {product.image ? "Заменить фото" : "Загрузить фото"}
              </button>
              {product.image && (
                <button
                  className="sellers-btn sellers-btn--danger sellers-btn--sm"
                  onClick={handleImageDelete}
                  disabled={imgLoading}
                >
                  <X size={14} /> Удалить фото
                </button>
              )}
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </div>
        </div>

        {/* ── Информация ── */}
        <div className="product-detail__info-col">
          <div className="detail-card">
            <h1 className="product-detail__name">{product.name}</h1>

            {product.code && (
              <div className="product-detail__code">
                Артикул: #{product.code}
              </div>
            )}

            <div className="product-detail__price">
              {formatPrice(product.price)}
            </div>

            <div className="product-detail__availability">
              {product.isAvailable !== false ? (
                <span className="sellers-badge sellers-badge--active">
                  <CheckCircle size={12} /> В наличии
                </span>
              ) : (
                <span className="sellers-badge sellers-badge--inactive">
                  <XCircle size={12} /> Нет в наличии
                </span>
              )}
            </div>

            {product.category && (
              <div className="product-detail__category">
                <Tag size={14} />
                <span>{product.category.name}</span>
              </div>
            )}
          </div>

          {product.description && (
            <div className="detail-card">
              <h2 className="detail-card__title">Описание</h2>
              <p className="product-detail__description">
                {product.description}
              </p>
            </div>
          )}

          <div className="detail-card">
            <h2 className="detail-card__title">Информация</h2>
            <div className="detail-card__meta-list">
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Slug</span>
                <span className="detail-card__meta-value detail-card__meta-value--mono">
                  {product.slug}
                </span>
              </div>
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Создан</span>
                <span className="detail-card__meta-value">
                  {new Date(product.createdAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
              <div className="detail-card__meta-row">
                <span className="detail-card__meta-label">Обновлён</span>
                <span className="detail-card__meta-value">
                  {new Date(product.updatedAt).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Модалка редактирования ── */}
      {showEdit && (
        <EditProductModal
          product={product}
          categories={categories}
          sellerSlug={sellerSlug}
          basePath={basePath}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}
