"use client";
import "./HomePage.scss";
import Hero from "./Hero/Hero";
import Piruza from "./Piruza/Piruza";
import Products from "./Products/Products";
import HowToOrder from "./HowToOrder/HowToOrder";

const HomePage = () => {
  return (
    <main>
      <Hero />
      <Piruza />
      <Products />
      <HowToOrder />
    </main>
  );
};

export default HomePage;
