"use client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { clientApi } from "@/lib/clientApi";
import { toast } from "react-hot-toast";
import "./LoginPage.scss";

const LoginContent = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      await clientApi.post("/clients/google-login", {
        idToken: credentialResponse.credential,
      });

      const saved = localStorage.getItem("piruza_city");
      if (saved) {
        const localCity = JSON.parse(saved);
        if (localCity?._id) {
          try {
            await clientApi.patch("/clients/city", { city: localCity._id });
          } catch {
            // молча игнорируем
          }
        }
      }

      toast.success("Connexion réussie!");
      setTimeout(() => {
        window.location.replace("/cabinet");
      }, 1000);
    } catch (error) {
      toast.error(error.message || "Erreur de connexion");
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
