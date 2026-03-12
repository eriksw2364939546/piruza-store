"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/actions/admin-auth.actions";
import "./PrivateLoginPage.scss";

// useActionState — хук React 19, работает с Server Actions
// state  — результат последнего вызова action { success, message }
// action — функция которую вешаем на форму
// pending — true пока идёт запрос
const initialState = { success: false, message: "" };

const PrivateLoginPage = () => {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <main className="private-login">
      <div className="private-login__card">
        <h1 className="private-login__title">Piruza Admin</h1>
        <p className="private-login__subtitle">Войдите в панель управления</p>

        {/* Показываем ошибку если бэкенд вернул её */}
        {state?.message && !state?.success && (
          <div className="private-login__error">{state.message}</div>
        )}

        <form action={action}>
          <div className="private-login__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="private-login__field">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="private-login__btn"
            disabled={pending}
          >
            {pending ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default PrivateLoginPage;
