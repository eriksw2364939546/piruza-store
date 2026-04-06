"use client";
import "./AboutPage.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";

const AboutPage = () => {
  const t = useTranslations("about");

  const values = [
    { icon: "🏠", titleKey: "value1Title", textKey: "value1Text" },
    { icon: "🤝", titleKey: "value2Title", textKey: "value2Text" },
    { icon: "❤️", titleKey: "value3Title", textKey: "value3Text" },
    { icon: "🌍", titleKey: "value4Title", textKey: "value4Text" },
  ];

  return (
    <main className="about">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__content">
            <span className="about-hero__eyebrow">{t("heroEyebrow")}</span>
            <h1 className="about-hero__title">
              {t("heroTitle")} <br />
              <em>{t("heroTitleEm")}</em>
            </h1>
          </div>
        </div>
      </section>

      <section className="about-piruza">
        <div className="container">
          <div className="about-piruza__grid">
            <div className="about-piruza__image-wrap">
              <Image
                src="/icon/header-logo.png"
                width={220}
                height={165}
                alt="Piruza"
                className="about-piruza__logo"
              />
            </div>
            <div className="about-piruza__text">
              <h2 className="about-piruza__title">{t("piruzaTitle")}</h2>
              <p>{t("piruzaText")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission">
        <div className="container">
          <div className="about-mission__content">
            <h2 className="about-mission__title">{t("missionTitle")}</h2>
            <p className="about-mission__text">{t("missionText1")}</p>
            <p className="about-mission__text">{t("missionText2")}</p>
            <p className="about-mission__quote">{t("missionQuote")}</p>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <h2 className="about-values__title">{t("valuesTitle")}</h2>
          <div className="about-values__grid">
            {values.map((v, i) => (
              <div key={i} className="about-values__card">
                <span className="about-values__icon">{v.icon}</span>
                <h3>{t(v.titleKey)}</h3>
                <p>{t(v.textKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
