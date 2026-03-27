"use client";

// ═══════════════════════════════════════════════════════
// SellerFormPage — создание и редактирование продавца
// /owner/sellers/create
// /owner/sellers/[slug]/edit
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

import {
  createSellerAction,
  updateSellerAction,
} from "@/app/actions/seller.actions";
import "./SellerFormPage.scss";

const INIT_STATE = { success: null, message: "" };

// ════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ════════════════════════════════════════════════════

export default function SellerFormPage({
  seller = null,
  cities = [],
  categories = [],
  basePath = "/admins-piruza/owner/sellers",
  showInactive = false,
}) {
  const isEdit = !!seller;
  const action = isEdit ? updateSellerAction : createSellerAction;

  const [state, formAction, pending] = useActionState(action, INIT_STATE);

  // Рефы для скролла
  const categoriesSectionRef = useRef(null);
  const categoriesContainerRef = useRef(null);

  // Локальная ошибка валидации
  const [localError, setLocalError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Чекбоксы глобальных категорий
  const initCats = seller?.globalCategories?.map((c) => c._id || c) || [];
  const [selectedCats, setSelectedCats] = useState(initCats);

  const toggleCat = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
    // Очищаем ошибку валидации при выборе категории
    if (validationError === "categories") {
      setValidationError(null);
      setLocalError(null);
    }
  };

  // Валидация перед отправкой
  const handleSubmit = (e) => {
    // Проверяем, выбраны ли глобальные категории
    if (selectedCats.length === 0) {
      e.preventDefault(); // Отменяем отправку формы
      setValidationError("categories");
      setLocalError("Выберите хотя бы одну глобальную категорию");

      // Скроллим к секции категорий
      if (categoriesSectionRef.current) {
        categoriesSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Добавляем подсветку
        categoriesSectionRef.current.classList.add(
          "seller-form-page__section--error",
        );
        setTimeout(() => {
          categoriesSectionRef.current?.classList.remove(
            "seller-form-page__section--error",
          );
        }, 2000);
      }

      return false;
    }

    // Если валидация прошла, форма отправится
    return true;
  };

  // Показываем ошибку через toast
  useEffect(() => {
    if (state.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state.success, state.message]);

  const backHref = isEdit ? `${basePath}/${seller.slug}` : basePath;

  return (
    <div className="seller-form-page">
      {/* ── Навигация ── */}
      <div className="seller-form-page__nav">
        <Link href={backHref} className="seller-form-page__back">
          <ArrowLeft size={16} />
          {isEdit ? "Назад к продавцу" : "Все продавцы"}
        </Link>
        <h1 className="seller-form-page__title">
          {isEdit ? `Редактирование: ${seller.name}` : "Новый продавец"}
        </h1>
      </div>

      {/* ── Форма ── */}
      <form
        action={formAction}
        onSubmit={handleSubmit}
        className="seller-form-page__form"
      >
        {/* Скрытые поля */}
        {isEdit && <input type="hidden" name="id" value={seller._id} />}
        {isEdit && <input type="hidden" name="slug" value={seller.slug} />}
        <input type="hidden" name="basePath" value={basePath} />

        {/* Глобальная ошибка */}
        {state.success === false && (
          <div className="seller-form-page__error">
            <AlertCircle size={16} />
            {state.message}
          </div>
        )}

        {/* Локальная ошибка валидации */}
        {localError && (
          <div className="seller-form-page__error seller-form-page__error--validation">
            <AlertCircle size={16} />
            {localError}
          </div>
        )}

        {/* ── Секция: основная информация ── */}
        <section className="seller-form-page__section">
          <h2 className="seller-form-page__section-title">
            Основная информация
          </h2>
          <div className="seller-form-page__grid">
            <div className="seller-form-page__field seller-form-page__field--full">
              <label>Название *</label>
              <input
                name="name"
                type="text"
                defaultValue={seller?.name || ""}
                placeholder="Название продавца"
                required
                autoFocus
              />
            </div>

            <div className="seller-form-page__field">
              <label>Тип бизнеса *</label>
              <input
                name="businessType"
                type="text"
                defaultValue={seller?.businessType || ""}
                placeholder="pâtisserie, магазин, кафе..."
                required
              />
            </div>

            <div className="seller-form-page__field">
              <label>Город *</label>
              <select
                name="city"
                defaultValue={seller?.city?._id || seller?.city || ""}
                required
              >
                <option value="">— Выберите город —</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                    {showInactive && !city.isActive ? " ⚠ неактивен" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="seller-form-page__field seller-form-page__field--full">
              <label>Описание *</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={seller?.description || ""}
                placeholder="Опишите продавца..."
                required
              />
            </div>

            <div className="seller-form-page__field seller-form-page__field--full">
              <label>Адрес *</label>
              <input
                name="address"
                type="text"
                defaultValue={seller?.address || ""}
                placeholder="Полный адрес"
                required
              />
            </div>
          </div>
        </section>

        {/* ── Секция: контакты ── */}
        <section className="seller-form-page__section">
          <h2 className="seller-form-page__section-title">Контакты</h2>
          <div className="seller-form-page__grid">
            <div className="seller-form-page__field">
              <label>Телефон *</label>
              <input
                name="phone"
                type="text"
                defaultValue={seller?.phone || ""}
                placeholder="+7 999 999-99-99"
                required
              />
            </div>

            <div className="seller-form-page__field">
              <label>WhatsApp *</label>
              <input
                name="whatsapp"
                type="text"
                defaultValue={seller?.whatsapp || ""}
                placeholder="+7 999 999-99-99"
                required
              />
            </div>

            <div className="seller-form-page__field">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                defaultValue={seller?.email || ""}
                placeholder="example@mail.com"
                required
              />
            </div>

            <div className="seller-form-page__field">
              <label>Юридическая информация</label>
              <input
                name="legalInfo"
                type="text"
                defaultValue={seller?.legalInfo || ""}
                placeholder="ИНН, название юр. лица..."
              />
            </div>
          </div>
        </section>

        {/* ── Секция: категории ── */}
        <section
          ref={categoriesSectionRef}
          className={`seller-form-page__section ${validationError === "categories" ? "seller-form-page__section--error" : ""}`}
        >
          <h2 className="seller-form-page__section-title">
            Глобальные категории
            <span className="seller-form-page__required-star">*</span>
          </h2>
          <p className="seller-form-page__hint">
            Выберите к каким глобальным категориям относится продавец
          </p>

          {/* Скрытые инпуты для выбранных категорий */}
          {selectedCats.map((id) => (
            <input key={id} type="hidden" name="globalCategories" value={id} />
          ))}

          <div
            ref={categoriesContainerRef}
            className={`seller-form-page__cats ${validationError === "categories" ? "seller-form-page__cats--error" : ""}`}
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <label
                  key={cat._id}
                  className={`seller-form-page__cat-item ${selectedCats.includes(cat._id) ? "seller-form-page__cat-item--selected" : ""} ${showInactive && !cat.isActive ? "seller-form-page__cat-item--inactive" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedCats.includes(cat._id)}
                    onChange={() => toggleCat(cat._id)}
                  />
                  <span>{cat.name}</span>
                  {showInactive && !cat.isActive && (
                    <span className="seller-form-page__cat-badge">
                      неактивна
                    </span>
                  )}
                </label>
              ))
            ) : (
              <p className="seller-form-page__empty">Нет доступных категорий</p>
            )}
          </div>

          {/* Сообщение об ошибке под категориями */}
          {validationError === "categories" && (
            <div className="seller-form-page__field-error">
              <AlertCircle size={14} />
              Выберите хотя бы одну глобальную категорию
            </div>
          )}
        </section>

        {/* ── Кнопки ── */}
        <div className="seller-form-page__footer">
          <Link href={backHref} className="sellers-btn sellers-btn--ghost">
            Отмена
          </Link>
          <button
            type="submit"
            className="sellers-btn sellers-btn--primary"
            disabled={pending}
          >
            <Save size={15} />
            {pending
              ? "Сохранение..."
              : isEdit
                ? "Сохранить изменения"
                : "Создать продавца"}
          </button>
        </div>
      </form>
    </div>
  );
}
