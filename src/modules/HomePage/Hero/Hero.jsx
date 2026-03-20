"use client";

import "./Hero.scss";
import { useRouter } from "next/navigation";

const Hero = ({ categories = [] }) => {
  const router = useRouter();

  const handleCategory = (slug) => {
    router.push(`/sellers?category=${slug}`);
  };

  return (
    <section className="hero">
      <div className="hero__bg" />

      <div className="container">
        <div className="hero__content">
          {/* Заголовок + описание */}
          <div className="hero__text">
            <span className="hero__eyebrow">Bienvenue sur Piruza Store</span>
            <h1 className="hero__title">
              Le marché local
              <br />
              <em>de votre ville</em>
            </h1>
            <p className="hero__subtitle">
              Découvrez des artisans et vendeurs locaux authentiques — produits
              faits maison, commande directe via WhatsApp.
            </p>
          </div>

          {/* Категории */}
          {categories.length > 0 && (
            <div className="hero__categories">
              <p className="hero__categories-label">Catégories</p>
              <div className="hero__categories-list">
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    className="hero__cat-btn"
                    onClick={() => handleCategory(cat.slug)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
