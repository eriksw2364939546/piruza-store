"use client";
import "./HowToOrder.scss";
import { useState } from "react";
import OrderModal from "@/components/OrderModal/OrderModal";
import toast from "react-hot-toast";
import { Train, Truck, Star } from "lucide-react"; // Исправлено: Train вместо Metro

const HowToOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    toast.success(
      "Piruza a déjà commencé à préparer votre sudjouke ❤️\nNous vous appellerons ou vous enverrons un SMS pour confirmer votre commande !",
      {
        duration: 6000,
      },
    );
  };

  return (
    <section id="how-to__order" className="how-to__order">
      <div className="container">
        <div className="how-to__order-content">
          <h2>Comment commander</h2>

          <div className="delivery-info">
            <div className="delivery-badge">
              <Truck className="delivery-icon" />
              <span>Livraison gratuite</span>
            </div>
            <p className="delivery-description">
              Nous vous rencontrerons à la station de métro de votre choix à
              Marseille pour vous remettre votre commande en main propre.
            </p>
          </div>

          <div className="how-to__order-items">
            <div className="how-to__order-item row">
              <p>1</p>
              <p>Choisissez une saveur.</p>
            </div>
            <div className="how-to__order-item row">
              <p>2</p>
              <p>Laissez vos coordonnées.</p>
            </div>
            <div className="how-to__order-item row">
              <p>3</p>
              <p>Piruza va commencer à cuisiner.</p>
            </div>
          </div>

          <div className="how-to__order-features">
            <div className="feature-item">
              <Train className="feature-icon" /> {/* Исправлено на Train */}
              <div>
                <h3>Rencontre au métro</h3>
                <p>Choisissez votre station préférée à Marseille</p>
              </div>
            </div>
            <div className="feature-item">
              <Truck className="feature-icon" />
              <div>
                <h3>Gratuit</h3>
                <p>Livraison offerte sans frais supplémentaires</p>
              </div>
            </div>
            <div className="feature-item">
              <Star className="feature-icon" />
              <div>
                <h3>Frais et fait main</h3>
                <p>Préparé le jour même par Piruza</p>
              </div>
            </div>
          </div>

          <button
            className="how-to__order-btn btn open-modal"
            onClick={() => setIsModalOpen(true)}
          >
            Commander maintenant
          </button>

          <div className="order-note">
            <p>
              📞 <strong>Comment ça marche ?</strong> Après votre commande,
              Piruza vous contactera pour confirmer le lieu et l'heure de
              rencontre à la station choisie.
            </p>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </section>
  );
};

export default HowToOrder;
