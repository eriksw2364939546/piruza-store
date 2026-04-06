"use client";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { clientApi } from "@/lib/clientApi";
import { toast } from "react-hot-toast";
import { useTranslations } from "next-intl";
import Link from "next/link";
import "./LoginPage.scss";

const LoginContent = () => {
  const t = useTranslations("login");

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
          } catch {}
        }
      }

      toast.success(t("successToast"));
      setTimeout(() => {
        window.location.replace("/cabinet");
      }, 1000);
    } catch (error) {
      toast.error(error.message || t("errorToast"));
    }
  };

  const handleError = () => {
    toast.error(t("errorToast"));
  };

  const features = [
    { icon: "❤️", text: t("feature1") },
    { icon: "⭐", text: t("feature2") },
    { icon: "⭐", text: t("feature3") },
    { icon: "📍", text: t("feature4") },
  ];

  return (
    <main className="login-page">
      <div className="container">
        <div className="login-card">
          <h1 className="login-card__title">{t("title")}</h1>
          <p className="login-card__subtitle">{t("subtitle")}</p>

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

          <div className="features">
            <p className="features__title">{t("featuresTitle")}</p>
            <ul className="features__list">
              {features.map((f, i) => (
                <li key={i} className="features__item">
                  <span className="features__icon">{f.icon}</span>
                  <span>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="login-card__legal">
            {t("legal")}{" "}
            <Link href="/conditions-generales">{t("legalTerms")}</Link>{" "}
            {t("legalAnd")}{" "}
            <Link href="/politique-de-confidentialite">
              {t("legalPrivacy")}
            </Link>
          </p>
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
