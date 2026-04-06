"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import "./LanguageButton.scss";

const LanguageButton = ({ locale }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(null); // локаль куда переходим

  const switchLocale = (newLocale) => {
    if (newLocale === locale || pending) return;
    setPending(newLocale);

    setTimeout(() => {
      const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
      router.push(newPath);
    }, 300); // 300ms — время анимации индикатора
  };

  const activeLocale = pending || locale;

  return (
    <div className="lang-btn">
      <div className="lang-btn__track">
        <div
          className={`lang-btn__indicator ${activeLocale === "ru" ? "lang-btn__indicator--ru" : ""}`}
        />
        <button
          className={`lang-btn__item ${activeLocale === "fr" ? "lang-btn__item--active" : ""}`}
          onClick={() => switchLocale("fr")}
        >
          FR
        </button>
        <button
          className={`lang-btn__item ${activeLocale === "ru" ? "lang-btn__item--active" : ""}`}
          onClick={() => switchLocale("ru")}
        >
          RU
        </button>
      </div>
    </div>
  );
};

export default LanguageButton;
