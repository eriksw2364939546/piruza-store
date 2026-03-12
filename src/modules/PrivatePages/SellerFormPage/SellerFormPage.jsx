"use client";

// ═══════════════════════════════════════════════════════
// SellerFormPage — создание и редактирование продавца
// /owner/sellers/create
// /owner/sellers/[slug]/edit
// ═══════════════════════════════════════════════════════

import { useState, useActionState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Save } from "lucide-react";

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

  // Чекбоксы глобальных категорий
  const initCats = seller?.globalCategories?.map((c) => c._id || c) || [];
  const [selectedCats, setSelectedCats] = useState(initCats);

  const toggleCat = (id) => {
    setSelectedCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
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
      <form action={formAction} className="seller-form-page__form">
        {/* Скрытые поля */}
        {isEdit && <input type="hidden" name="id" value={seller._id} />}
        {isEdit && <input type="hidden" name="slug" value={seller.slug} />}
        <input type="hidden" name="basePath" value={basePath} />

        {/* Ошибка */}
        {state.success === false && (
          <div className="seller-form-page__error">{state.message}</div>
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
        <section className="seller-form-page__section">
          <h2 className="seller-form-page__section-title">
            Глобальные категории
          </h2>
          <p className="seller-form-page__hint">
            Выберите к каким глобальным категориям относится продавец
          </p>

          {/* Скрытые инпуты для выбранных категорий */}
          {selectedCats.map((id) => (
            <input key={id} type="hidden" name="globalCategories" value={id} />
          ))}

          <div className="seller-form-page__cats">
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
