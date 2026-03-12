"use client";

// ═══════════════════════════════════════════════════════
// ProfilePage — профиль текущего пользователя
// Общий компонент: owner/profile + admin-panel/profile
// ═══════════════════════════════════════════════════════

import { useState, useActionState } from "react";
import toast from "react-hot-toast";
import { User, Mail, Shield, Calendar, Lock } from "lucide-react";
import { updateOwnProfileAction } from "@/app/actions/admin-auth.actions";
import "./ProfilePage.scss";

const INIT = { success: null, message: "" };

const ROLE_LABELS = {
  owner: "Owner",
  admin: "Администратор",
  manager: "Менеджер",
};

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ════════════════════════════════════════════════════
// МОДАЛКА РЕДАКТИРОВАНИЯ
// ════════════════════════════════════════════════════

function EditModal({ profile, onClose }) {
  const [state, formAction, pending] = useActionState(
    updateOwnProfileAction,
    INIT,
  );
  const [showPassword, setShowPassword] = useState(false);

  if (state.success === true) {
    toast.success(state.message);
    onClose();
  }

  return (
    <div
      className="profile-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="profile-modal__box">
        <div className="profile-modal__header">
          <span className="profile-modal__title">Редактировать профиль</span>
          <button className="profile-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form action={formAction} className="profile-modal__form">
          {state.success === false && (
            <div className="profile-modal__error">{state.message}</div>
          )}

          <div className="profile-modal__field">
            <label>
              <User size={13} /> Имя
            </label>
            <input
              name="name"
              type="text"
              defaultValue={profile.name}
              placeholder="Ваше имя"
              autoFocus
            />
          </div>

          <div className="profile-modal__field">
            <label>
              <Mail size={13} /> Email
            </label>
            <input
              name="email"
              type="email"
              defaultValue={profile.email}
              placeholder="email@example.com"
            />
          </div>

          <div className="profile-modal__field">
            <label>
              <Lock size={13} /> Новый пароль
            </label>
            <div className="profile-modal__password-wrap">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Оставьте пустым чтобы не менять"
                minLength={6}
              />
              <button
                type="button"
                className="profile-modal__toggle-pw"
                onClick={() => setShowPassword((p) => !p)}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
            <span className="profile-modal__hint">Минимум 6 символов</span>
          </div>

          <div className="profile-modal__actions">
            <button
              type="button"
              className="profile-btn profile-btn--ghost"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="profile-btn profile-btn--primary"
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

// ════════════════════════════════════════════════════
// ГЛАВНЫЙ КОМПОНЕНТ
// ════════════════════════════════════════════════════

export default function ProfilePage({ profile }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <div className="profile-page">
      {/* ── Шапка ── */}
      <div className="profile-page__head">
        <h2 className="profile-page__title">Профиль</h2>
      </div>

      {/* ── Карточка профиля ── */}
      <div className="profile-card">
        {/* Аватар + имя */}
        <div className="profile-card__hero">
          <div className="profile-card__avatar">
            {profile.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="profile-card__hero-info">
            <h3 className="profile-card__name">{profile.name}</h3>
            <span className={`profile-role profile-role--${profile.role}`}>
              {ROLE_LABELS[profile.role] || profile.role}
            </span>
          </div>
          <button
            className="profile-btn profile-btn--ghost"
            onClick={() => setShowEdit(true)}
          >
            ✏️ Редактировать
          </button>
        </div>

        {/* Поля */}
        <div className="profile-card__fields">
          <div className="profile-card__field">
            <div className="profile-card__field-label">
              <Mail size={14} /> Email
            </div>
            <div className="profile-card__field-value">{profile.email}</div>
          </div>

          <div className="profile-card__field">
            <div className="profile-card__field-label">
              <Shield size={14} /> Роль
            </div>
            <div className="profile-card__field-value">
              <span className={`profile-role profile-role--${profile.role}`}>
                {ROLE_LABELS[profile.role] || profile.role}
              </span>
            </div>
          </div>

          <div className="profile-card__field">
            <div className="profile-card__field-label">
              <Lock size={14} /> Пароль
            </div>
            <div className="profile-card__field-value profile-card__field-value--muted">
              ••••••••
              <button
                className="profile-card__change-pw"
                onClick={() => setShowEdit(true)}
              >
                Изменить
              </button>
            </div>
          </div>

          <div className="profile-card__field">
            <div className="profile-card__field-label">
              <Calendar size={14} /> Дата создания
            </div>
            <div className="profile-card__field-value profile-card__field-value--muted">
              {formatDate(profile.createdAt)}
            </div>
          </div>
        </div>
      </div>

      {/* ── Модалка ── */}
      {showEdit && (
        <EditModal profile={profile} onClose={() => setShowEdit(false)} />
      )}
    </div>
  );
}
