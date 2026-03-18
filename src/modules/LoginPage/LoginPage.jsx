"use client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./LoginPage.scss";

const LoginContent = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      // credentialResponse.credential - это ID Token (JWT)
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/google-login`,
        {
          idToken: credentialResponse.credential, // ✅ Правильный ID Token
        },
      );

      // Сохраняем JWT токен от твоего бэкенда
      const token = res.data.data.token;
      localStorage.setItem("token", token);

      // ✅ ВЫВОДИМ ТОКЕН В КОНСОЛЬ
      console.log("=".repeat(60));
      console.log("🔑 CLIENT TOKEN ДЛЯ POSTMAN:");
      console.log(token);
      console.log("=".repeat(60));
      console.log("📋 Скопируй токен выше для использования в Postman!");
      console.log("=".repeat(60));

      toast.success("Успешный вход!");
      console.log("Данные клиента:", res.data.data.client);

      // Редирект на главную через 3 секунды (чтобы успеть скопировать токен)
      setTimeout(() => {
        window.location.href = "/cabinet";
      }, 6000);
    } catch (error) {
      console.error("Ошибка при логине:", error);
      toast.error(error.response?.data?.message || "Ошибка входа");
    }
  };

  const handleError = () => {
    console.log("Login Failed");
    toast.error("Ошибка входа через Google");
  };

  return (
    <main className="login-page">
      <div className="container">
        <div className="login-card">
          <h1 className="login-card__title">Bienvenue</h1>
          <p className="login-card__subtitle">
            Connectez-vous для доступа к функциям
          </p>

          {/* ✅ Используем GoogleLogin компонент */}
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            locale="fr"
          />
        </div>
      </div>
    </main>
  );
};

const LoginPage = () => (
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
    <LoginContent />
  </GoogleOAuthProvider>
);

export default LoginPage;
