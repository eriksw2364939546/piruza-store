"use client";

import "./HowToOrder.scss";
import { Search, MessageCircle, Package } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const HowToOrder = () => {
  const t = useTranslations("howToOrder");

  const steps = [
    {
      num: "01",
      icon: <Search size={28} />,
      title: t("step1Title"),
      text: t("step1Text"),
      color: "#f0ede8",
    },
    {
      num: "02",
      icon: <MessageCircle size={28} />,
      title: t("step2Title"),
      text: t("step2Text"),
      color: "#e8f5e9",
    },
    {
      num: "03",
      icon: <Package size={28} />,
      title: t("step3Title"),
      text: t("step3Text"),
      color: "#e8f0ff",
    },
  ];

  return (
    <section id="how-to__order" className="how-to__order">
      <div className="container">
        <div className="how-to__order-content">
          <div className="how-to__head">
            <span className="how-to__eyebrow">{t("eyebrow")}</span>
            <h2>
              {t.rich("title", {
                em: (chunks) => <em key="em">{chunks}</em>,
              })}
            </h2>
            <p className="how-to__desc">{t("desc")}</p>
          </div>

          <div className="how-to__order-items">
            {steps.map((step, i) => (
              <div
                key={i}
                className="how-to__order-item"
                style={{ "--step-bg": step.color }}
              >
                <div className="how-to__step-icon">{step.icon}</div>
                <div className="how-to__step-num">{step.num}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>

          <div className="how-to__cta">
            <Link href="/sellers" className="how-to__order-btn btn">
              {t("cta")}
            </Link>
            <p className="how-to__note">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
