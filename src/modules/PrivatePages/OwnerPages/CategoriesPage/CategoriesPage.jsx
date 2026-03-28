"use client";

// ═══════════════════════════════════════════════════════
// CategoriesPage — клиентский компонент
// Таблица глобальных категорий + создание + редактирование + удаление
// Owner only
// ═══════════════════════════════════════════════════════

import { useState, useActionState } from "react";
import { useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Pagination from "@/components/Pagination/Pagination";
import {
  createGlobalCategoryAction,
  updateCategoryAction,
  toggleCategoryStatusAction,
  deleteCategoryAction,
} from "@/app/actions/category.actions";
import "./CategoriesPage.scss";

const initialState = { success: false, message: "" };

// ─── Модальное окно ───
const Modal = ({ title, onClose, children }) => (
  <div className="categories-modal__overlay" onClick={onClose}>
    <div className="categories-modal__box" onClick={(e) => e.stopPropagation()}>
      <div className="categories-modal__header">
        <h2 className="categories-modal__title">{title}</h2>
        <button className="categories-modal__close" onClick={onClose}>
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Форма создания ───
const CreateForm = ({ onClose }) => {
  const [state, action, pending] = useActionState(
    createGlobalCategoryAction,
    initialState,
  );

  if (state.success) onClose();

  return (
    <form action={action} className="categories-modal__form">
      {state.message && !state.success && (
        <div className="categories-modal__error">{state.message}</div>
      )}
      <div className="categories-modal__field">
        <label>Название категории</label>
        <input
          name="name"
          type="text"
          placeholder="Например: Выпечка"
          required
          autoFocus
        />
      </div>
      <div className="categories-modal__actions">
        <button
          type="button"
          className="categories-btn categories-btn--ghost"
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="categories-btn categories-btn--primary"
          disabled={pending}
        >
          {pending ? "Создание..." : "Создать"}
        </button>
      </div>
    </form>
  );
};

// ─── Форма редактирования ───
const EditForm = ({ category, onClose }) => {
  const [state, action, pending] = useActionState(
    updateCategoryAction,
    initialState,
  );

  if (state.success) onClose();

  return (
    <form action={action} className="categories-modal__form">
      <input type="hidden" name="id" value={category._id} />
      {state.message && !state.success && (
        <div className="categories-modal__error">{state.message}</div>
      )}
      <div className="categories-modal__field">
        <label>Название категории</label>
        <input
          name="name"
          type="text"
          defaultValue={category.name}
          required
          autoFocus
        />
      </div>
      <div className="categories-modal__actions">
        <button
          type="button"
          className="categories-btn categories-btn--ghost"
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="categories-btn categories-btn--primary"
          disabled={pending}
        >
          {pending ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
};

// ─── Строка таблицы ───
const CategoryRow = ({ category, onEdit }) => {
  const [toggleLoading, setToggleLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleToggle = async () => {
    setToggleLoading(true);
    const result = await toggleCategoryStatusAction(
      category._id,
      category.isActive,
    );
    if (!result.success) alert(result.message);
    setToggleLoading(false);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Удалить категорию "${category.name}"?\n\nВсе продавцы с этой категорией будут переведены в draft.`,
      )
    )
      return;
    setDeleteLoading(true);
    const result = await deleteCategoryAction(category._id);
    if (!result.success) alert(result.message);
    setDeleteLoading(false);
  };

  return (
    <tr>
      <td>{category.name}</td>
      <td>
        <span className="categories-badge categories-badge--slug">
          {category.slug}
        </span>
      </td>
      <td>
        <span
          className={`categories-badge categories-badge--${category.isActive ? "active" : "inactive"}`}
        >
          {category.isActive ? "Активна" : "Неактивна"}
        </span>
      </td>
      <td>
        <div className="categories-actions">
          <button
            className="categories-btn categories-btn--sm categories-btn--ghost"
            onClick={() => onEdit(category)}
          >
            ✏️
          </button>
          <button
            className={`categories-btn categories-btn--sm ${category.isActive ? "categories-btn--warning" : "categories-btn--success"}`}
            onClick={handleToggle}
            disabled={toggleLoading}
            title={category.isActive ? "Деактивировать" : "Активировать"}
          >
            {toggleLoading ? "..." : category.isActive ? "🔴" : "🟢"}
          </button>
          <button
            className="categories-btn categories-btn--sm categories-btn--danger"
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? "..." : "🗑️"}
          </button>
        </div>
      </td>
    </tr>
  );
};

// ─── Главный компонент ───
const CategoriesPage = ({ categories, pagination, initialFilters = {} }) => {
  const router = useRouter();
  const pathname = usePathname();
  const timerRef = useRef(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [queryInput, setQueryInput] = useState(initialFilters.query || "");

  const pushUrl = useCallback(
    (query, status, page = 1) => {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (status) params.set("status", status);
      if (page > 1) params.set("page", page);
      const qs = params.toString();
      router.push(`${pathname}${qs ? "?" + qs : ""}`);
    },
    [router, pathname],
  );

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQueryInput(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => pushUrl(val, initialFilters.status),
      400,
    );
  };

  const handleStatus = (status) => pushUrl(queryInput, status);
  const handlePage = (page) => pushUrl(queryInput, initialFilters.status, page);

  const activeStatus = initialFilters.status || "";
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? 1;

  return (
    <div className="categories-page">
      {/* ── Шапка ── */}
      <div className="categories-page__head">
        <div>
          <h2 className="categories-page__title">Глобальные категории</h2>
          <p className="categories-page__subtitle">
            Всего: {pagination?.total ?? categories.length}
          </p>
        </div>
        <button
          className="categories-btn categories-btn--primary"
          onClick={() => setShowCreate(true)}
        >
          + Добавить категорию
        </button>
      </div>

      {/* ── Поиск + фильтр ── */}
      <div className="categories-page__filters">
        <input
          className="categories-page__search"
          type="text"
          placeholder="Поиск по названию..."
          value={queryInput}
          onChange={handleQueryChange}
        />
        <div className="categories-page__status-filter">
          {[
            { value: "", label: "Все" },
            { value: "active", label: "Активные" },
            { value: "inactive", label: "Неактивные" },
          ].map(({ value, label }) => (
            <button
              key={value}
              className={`categories-btn categories-btn--sm ${activeStatus === value ? "categories-btn--primary" : "categories-btn--ghost"}`}
              onClick={() => handleStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Таблица ── */}
      {categories.length === 0 ? (
        <div className="categories-page__empty">Категорий пока нет</div>
      ) : (
        <div className="categories-page__table-wrap">
          <table className="categories-page__table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Slug</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <CategoryRow
                  key={category._id}
                  category={category}
                  onEdit={setEditCategory}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Пагинация ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePage}
      />

      {/* ── Модалка создания ── */}
      {showCreate && (
        <Modal title="Новая категория" onClose={() => setShowCreate(false)}>
          <CreateForm onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* ── Модалка редактирования ── */}
      {editCategory && (
        <Modal
          title="Редактировать категорию"
          onClose={() => setEditCategory(null)}
        >
          <EditForm
            category={editCategory}
            onClose={() => setEditCategory(null)}
          />
        </Modal>
      )}
    </div>
  );
};

export default CategoriesPage;
