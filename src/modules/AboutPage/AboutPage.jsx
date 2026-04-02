"use client";
import "./AboutPage.scss";
import Image from "next/image";

const AboutPage = () => {
  return (
    <main className="about">
      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__content">
            <span className="about-hero__eyebrow">Notre histoire</span>
            <h1 className="about-hero__title">
              La France est belle. <br />
              <em>Mais parfois, on a juste envie d'un goût de maison.</em>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Piruza ── */}
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
              <h2 className="about-piruza__title">Qui est Piruza ?</h2>
              <p>
                Piruza, c'est cette grand-mère qui cuisine pour tout le monde —
                ses petits-enfants, ses voisins, ses amis. Celle dont la cuisine
                sent toujours bon, dont les mains transforment des ingrédients
                simples en souvenirs inoubliables. Elle représente tout ce que
                nous cherchons quand nous sommes loin de chez nous — cette
                chaleur, cette odeur, ce moment suspendu où l'on se sent enfin à
                sa place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-mission">
        <div className="container">
          <div className="about-mission__content">
            <h2 className="about-mission__title">Notre mission</h2>
            <p className="about-mission__text">
              Piruza Store est une plateforme qui rassemble des vendeurs locaux
              en France proposant des spécialités faites main des pays de
              l'ex-URSS. Des producteurs passionnés qui perpétuent des recettes
              transmises de génération en génération, préparées avec les mêmes
              gestes, les mêmes ingrédients, le même amour que celui de votre
              famille. Des saveurs authentiques, faites à la main, pour ceux qui
              savent ce que signifie vraiment le mot « maison ».
            </p>
            <p className="about-mission__text">
              Nous ne faisons pas de livraison, nous ne prenons pas de
              commandes. Nous faisons quelque chose de plus simple et de plus
              précieux — nous vous connectons directement avec ceux qui
              cuisinent comme à la maison, pour que chaque bouchée vous rappelle
              d'où vous venez.
            </p>
            <p className="about-mission__quote">
              Parce que la nostalgie, ça se mange aussi.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-values">
        <div className="container">
          <h2 className="about-values__title">Nos valeurs</h2>
          <div className="about-values__grid">
            <div className="about-values__card">
              <span className="about-values__icon">🏠</span>
              <h3>Authenticité</h3>
              <p>
                Chaque vendeur propose des recettes authentiques, transmises de
                génération en génération, sans compromis sur le goût.
              </p>
            </div>
            <div className="about-values__card">
              <span className="about-values__icon">🤝</span>
              <h3>Connexion</h3>
              <p>
                Nous créons un lien direct entre vous et les producteurs locaux,
                sans intermédiaires, sans barrières.
              </p>
            </div>
            <div className="about-values__card">
              <span className="about-values__icon">❤️</span>
              <h3>Amour du fait maison</h3>
              <p>
                Tout est préparé à la main, avec amour, comme le faisait votre
                famille — parce que certaines choses ne s'industrialisent pas.
              </p>
            </div>
            <div className="about-values__card">
              <span className="about-values__icon">🌍</span>
              <h3>Communauté</h3>
              <p>
                Piruza Store est avant tout une communauté de personnes qui
                partagent les mêmes racines, les mêmes souvenirs, les mêmes
                envies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
