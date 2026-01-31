"use client";

import "./Piruza.scss";
import Image from "next/image";

const Piruza = () => {
  return (
    <section className="piruza" id="about">
      <div className="container">
        <div className="piruza-content">
          {/* Image */}
          <div className="piruza-image__wrapper">
            <Image
              src="/images/piruza.png"
              alt="Grand-mère Piruza"
              width={500}
              height={800}
              priority
            />
          </div>

          {/* Text */}
          <div className="piruza-text__wrapper">
            <h2>Piruza</h2>

            <p className="piruza-description">
              Je m'appelle Piruza. Je prépare des douceurs maison depuis plus de
              25 ans, comme on me l’a appris autrefois dans ma famille.
            </p>

            <p>
              Je confectionne à la main des douceurs arméniennes sans produits
              chimiques ni additifs, en utilisant uniquement des ingrédients
              naturels et des recettes traditionnelles éprouvées.
            </p>

            <ul className="piruza-features">
              <li>Fabrication artisanale</li>
              <li>Sans conservateurs ni additifs</li>
              <li>Produits faits main</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Piruza;
