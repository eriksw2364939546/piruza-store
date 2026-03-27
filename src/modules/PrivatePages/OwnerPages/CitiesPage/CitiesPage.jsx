"use client";

// ═══════════════════════════════════════════════════════
// CitiesPage — клиентский компонент
// Таблица городов + создание + редактирование + удаление
// ═══════════════════════════════════════════════════════

import { useState, useActionState } from "react";
import {
  createCityAction,
  updateCityAction,
  toggleCityStatusAction,
  deleteCityAction,
} from "@/app/actions/city.actions";
import "./CitiesPage.scss";

const initialState = { success: false, message: "" };

// ─── Модальное окно ───
const Modal = ({ title, onClose, children }) => (
  <div className="cities-modal__overlay" onClick={onClose}>
    <div className="cities-modal__box" onClick={(e) => e.stopPropagation()}>
      <div className="cities-modal__header">
        <h2 className="cities-modal__title">{title}</h2>
        <button className="cities-modal__close" onClick={onClose}>
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
    createCityAction,
    initialState,
  );

  // Закрываем модалку после успеха
  if (state.success) {
    onClose();
  }

  return (
    <form action={action} className="cities-modal__form">
      {state.message && !state.success && (
        <div className="cities-modal__error">{state.message}</div>
      )}
      <div className="cities-modal__field">
        <label>Название города</label>
        <input
          name="name"
          type="text"
          placeholder="Например: Paris"
          required
          autoFocus
        />
      </div>
      <div className="cities-modal__actions">
        <button
          type="button"
          className="cities-btn cities-btn--ghost"
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="cities-btn cities-btn--primary"
          disabled={pending}
        >
          {pending ? "Создание..." : "Создать"}
        </button>
      </div>
    </form>
  );
};

// ─── Форма редактирования ───
const EditForm = ({ city, onClose }) => {
  const [state, action, pending] = useActionState(
    updateCityAction,
    initialState,
  );

  if (state.success) {
    onClose();
  }

  return (
    <form action={action} className="cities-modal__form">
      <input type="hidden" name="id" value={city._id} />
      {state.message && !state.success && (
        <div className="cities-modal__error">{state.message}</div>
      )}
      <div className="cities-modal__field">
        <label>Название города</label>
        <input
          name="name"
          type="text"
          defaultValue={city.name}
          required
          autoFocus
        />
      </div>
      <div className="cities-modal__actions">
        <button
          type="button"
          className="cities-btn cities-btn--ghost"
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          type="submit"
          className="cities-btn cities-btn--primary"
          disabled={pending}
        >
          {pending ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </form>
  );
};

// ─── Строка таблицы ───
const CityRow = ({ city, onEdit }) => {
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleCityStatusAction(city._id);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Удалить город "${city.name}"?`)) return;
    setDeleteLoading(true);
    const result = await deleteCityAction(city._id);
    if (!result.success) {
      alert(result.message);
    }
    setDeleteLoading(false);
  };

  return (
    <tr>
      <td>{city.name}</td>
      <td>
        <span className="cities-badge cities-badge--slug">{city.slug}</span>
      </td>
      <td>
        <span
          className={`cities-badge cities-badge--${city.isActive ? "active" : "inactive"}`}
        >
          {city.isActive ? "Активен" : "Неактивен"}
        </span>
      </td>
      <td>{city.createdBy?.name || "—"}</td>
      <td>{new Date(city.createdAt).toLocaleDateString("ru-RU")}</td>
      <td>
        <div className="cities-actions">
          <button
            className="cities-btn cities-btn--sm cities-btn--ghost"
            onClick={() => onEdit(city)}
          >
            ✏️
          </button>
          <button
            className={`cities-btn cities-btn--sm ${city.isActive ? "cities-btn--warning" : "cities-btn--success"}`}
            onClick={handleToggle}
            disabled={loading}
          >
            {loading ? "..." : city.isActive ? "🔴" : "🟢"}
          </button>
          <button
            className="cities-btn cities-btn--sm cities-btn--danger"
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
const CitiesPage = ({ cities, pagination }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [editCity, setEditCity] = useState(null);

  return (
    <div className="cities-page">
      {/* ── Шапка ── */}
      <div className="cities-page__head">
        <div>
          <h2 className="cities-page__title">Города</h2>
          <p className="cities-page__subtitle">
            Всего: {pagination?.total ?? cities.length}
          </p>
        </div>
        <button
          className="cities-btn cities-btn--primary"
          onClick={() => setShowCreate(true)}
        >
          + Добавить город
        </button>
      </div>

      {/* ── Таблица ── */}
      {cities.length === 0 ? (
        <div className="cities-page__empty">Городов пока нет</div>
      ) : (
        <div className="cities-page__table-wrap">
          <table className="cities-page__table">
            <thead>
              <tr>
                <th>Название</th>
                <th>Slug</th>
                <th>Статус</th>
                <th>Создал</th>
                <th>Дата</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {cities.map((city) => (
                <CityRow key={city._id} city={city} onEdit={setEditCity} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Модалка создания ── */}
      {showCreate && (
        <Modal title="Новый город" onClose={() => setShowCreate(false)}>
          <CreateForm onClose={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* ── Модалка редактирования ── */}
      {editCity && (
        <Modal title="Редактировать город" onClose={() => setEditCity(null)}>
          <EditForm city={editCity} onClose={() => setEditCity(null)} />
        </Modal>
      )}
    </div>
  );
};

export default CitiesPage;
