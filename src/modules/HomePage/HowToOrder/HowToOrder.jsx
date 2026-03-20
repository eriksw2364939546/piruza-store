"use client";

import "./HowToOrder.scss";
import { Search, MessageCircle, Package } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    num: "01",
    icon: <Search size={28} />,
    title: "Trouvez un vendeur",
    text: "Parcourez les boutiques locales par ville ou catégorie et trouvez ce qui vous plaît.",
    color: "#f0ede8",
  },
  {
    num: "02",
    icon: <MessageCircle size={28} />,
    title: "Commandez via WhatsApp",
    text: "Choisissez vos produits, ajoutez les quantités souhaitées et envoyez votre commande directement.",
    color: "#e8f5e9",
  },
  {
    num: "03",
    icon: <Package size={28} />,
    title: "Recevez votre commande",
    text: "Le vendeur vous contactera pour confirmer les détails de livraison ou de retrait.",
    color: "#e8f0ff",
  },
];

const HowToOrder = () => {
  return (
    <section id="how-to__order" className="how-to__order">
      <div className="container">
        <div className="how-to__order-content">
          <div className="how-to__head">
            <span className="how-to__eyebrow">Simple & rapide</span>
            <h2>
              Comment <em>commander</em>
            </h2>
            <p className="how-to__desc">
              En 3 étapes simples, trouvez vos artisans locaux préférés et
              passez commande sans intermédiaire.
            </p>
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
              Découvrir les vendeurs
            </Link>
            <p className="how-to__note">
              Commande directe · Sans frais · 100% local
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
