"use client";

import { useState } from "react";
import Image from "next/image";
import { validateLeadForm } from "@/lib/validation/welcomeForm.schema";
import { sendToTelegram } from "@/app/actions/sendToTelegram";
import "./WelcomePage.scss";

const CONTENT = {
  fr: {
    eyebrow: "Bientôt disponible",
    title: "Le marché local",
    titleEm: "de votre ville",
    subtitle:
      "En France, les saveurs de l'ex-URSS sont introuvables. Piruza Store change ça — une plateforme qui connecte les vendeurs locaux avec ceux qui ont grandi avec ces goûts.",
    sellerTitle: "Vous cuisinez comme à la maison ?",
    sellerSubtitle:
      "Des milliers de personnes en France cherchent ces saveurs introuvables en supermarché — pelmeni, manti, varéniki, pâtisseries orientales, confitures de grand-mère. Piruza Store les connecte directement avec vous.",
    benefit1:
      "✓ Vos clients vous cherchent déjà — ils n'ont nulle part où aller",
    benefit2: "✓ Commande directe via WhatsApp, sans intermédiaire",
    benefit3:
      "✓ La seule plateforme dédiée aux spécialités de l'ex-URSS en France",
    formTitle: "Laisser une demande",
    name: "Nom *",
    namePlaceholder: "Votre nom",
    phone: "Téléphone *",
    phonePlaceholder: "+33 6 12 34 56 78",
    city: "Ville *",
    cityPlaceholder: "Votre ville",
    message: "Message *",
    messagePlaceholder:
      "Décrivez vos produits (ex: pelmeni faits maison, baklava, confitures...).",
    submit: "Envoyer la demande",
    submitting: "Envoi...",
    success: "✅ Votre demande a été envoyée ! Nous vous contacterons bientôt.",
    contactTitle: "Nous contacter",
    privacy:
      "En envoyant ce formulaire, vous acceptez notre politique de confidentialité.",
    required: "Ce champ est obligatoire",
  },
  ru: {
    eyebrow: "Скоро открытие",
    title: "Местный рынок",
    titleEm: "вашего города",
    subtitle:
      "Во Франции не найти борщ, манты или лаваш как дома. Piruza Store это меняет — платформа где местные продавцы встречают тех, кто вырос с этими вкусами.",
    sellerTitle: "Вы готовите как дома?",
    sellerSubtitle:
      "Во Франции сотни тысяч русскоязычных людей, которые не могут найти в магазинах манты, пельмени, вареники, самсу, пахлаву или варенье как у бабушки. Piruza Store соединяет их напрямую с вами.",
    benefit1: "✓ Ваши клиенты уже ищут вас — им просто некуда пойти",
    benefit2: "✓ Прямой заказ через WhatsApp, без посредников",
    benefit3:
      "✓ Единственная платформа домашних продуктов из бывшего СССР во Франции",
    formTitle: "Оставить заявку",
    name: "Имя *",
    namePlaceholder: "Ваше имя",
    phone: "Телефон *",
    phonePlaceholder: "+33 6 12 34 56 78",
    city: "Город *",
    cityPlaceholder: "Ваш город",
    message: "Сообщение *",
    messagePlaceholder:
      "Опишите ваши товары (например: домашние пельмени, пахлава, варенье...).",
    submit: "Отправить заявку",
    submitting: "Отправка...",
    success: "✅ Ваша заявка отправлена! Мы скоро свяжемся с вами.",
    contactTitle: "Связаться с нами",
    privacy: "Отправляя форму, вы принимаете нашу политику конфиденциальности.",
    required: "Это поле обязательно",
  },
};

export default function WelcomePage({ cities = [] }) {
  const [lang, setLang] = useState("fr");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const c = CONTENT[lang];

  const validate = () => {
    const newErrors = validateLeadForm(formData, lang);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const result = await sendToTelegram(formData);
      if (!result.success) throw new Error(result.error);
      setIsSuccess(true);
      setFormData({ name: "", phone: "", city: "", message: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="welcome">
      {/* ── Переключатель языка ── */}
      <div className="welcome__lang">
        <button
          className={`welcome__lang-btn ${lang === "fr" ? "welcome__lang-btn--active" : ""}`}
          onClick={() => setLang("fr")}
        >
          FR
        </button>
        <button
          className={`welcome__lang-btn ${lang === "ru" ? "welcome__lang-btn--active" : ""}`}
          onClick={() => setLang("ru")}
        >
          RU
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="welcome__hero">
        <div className="welcome__container">
          <Image
            src="/icon/header-logo.png"
            width={140}
            height={105}
            alt="Piruza Store"
            className="welcome__logo"
          />
          <span className="welcome__eyebrow">{c.eyebrow}</span>
          <h1 className="welcome__title">
            {c.title} <br />
            <em>{c.titleEm}</em>
          </h1>
          <p className="welcome__subtitle">{c.subtitle}</p>
        </div>
      </section>

      {/* ── Для продавцов ── */}
      <section className="welcome__sellers">
        <div className="welcome__container">
          <h2 className="welcome__sellers-title">{c.sellerTitle}</h2>
          <p className="welcome__sellers-subtitle">{c.sellerSubtitle}</p>
          <div className="welcome__benefits">
            <div className="welcome__benefit">{c.benefit1}</div>
            <div className="welcome__benefit">{c.benefit2}</div>
            <div className="welcome__benefit">{c.benefit3}</div>
          </div>
        </div>
      </section>

      {/* ── Форма ── */}
      <section className="welcome__form-section">
        <div className="welcome__container">
          <h2 className="welcome__form-title">{c.formTitle}</h2>

          {isSuccess ? (
            <div className="welcome__success">{c.success}</div>
          ) : (
            <form className="welcome__form" onSubmit={handleSubmit}>
              <div className="welcome__field">
                <label>{c.name}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={c.namePlaceholder}
                  className={errors.name ? "welcome__input--error" : ""}
                />
                {errors.name && (
                  <span className="welcome__error">{errors.name}</span>
                )}
              </div>

              <div className="welcome__field">
                <label>{c.phone}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={c.phonePlaceholder}
                  className={errors.phone ? "welcome__input--error" : ""}
                />
                {errors.phone && (
                  <span className="welcome__error">{errors.phone}</span>
                )}
              </div>

              <div className="welcome__field">
                <label>{c.city}</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? "welcome__input--error" : ""}
                >
                  <option value="">{c.cityPlaceholder}</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <span className="welcome__error">{errors.city}</span>
                )}
              </div>

              <div className="welcome__field">
                <label>{c.message}</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={c.messagePlaceholder}
                  rows={4}
                  className={errors.message ? "welcome__input--error" : ""}
                />
                {errors.message && (
                  <span className="welcome__error">{errors.message}</span>
                )}
              </div>

              <button
                type="submit"
                className="welcome__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? c.submitting : c.submit}
              </button>

              <p className="welcome__privacy">{c.privacy}</p>
            </form>
          )}
        </div>
      </section>

      {/* ── Контакты ── */}
      <section className="welcome__contacts">
        <div className="welcome__container">
          <h2 className="welcome__contacts-title">{c.contactTitle}</h2>
          <div className="welcome__contacts-links">
            <a
              href="https://wa.me/14434628696"
              target="_blank"
              rel="noopener noreferrer"
              className="welcome__contact-btn welcome__contact-btn--wa"
            >
              <Image
                src="/icon/whatsapp-icon.svg"
                width={24}
                height={24}
                alt="WhatsApp"
              />
              WhatsApp
            </a>
            <a
              href="https://t.me/piruza_store"
              target="_blank"
              rel="noopener noreferrer"
              className="welcome__contact-btn welcome__contact-btn--tg"
            >
              <Image
                src="/icon/telegram-icon.svg"
                width={24}
                height={24}
                alt="Telegram"
              />
              Telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
