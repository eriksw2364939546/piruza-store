"use client";
import "./HowToOrder.scss";
import { useState } from "react";
import OrderModal from "@/components/OrderModal/OrderModal";
import toast from "react-hot-toast";

const HowToOrder = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = () => {
    // Показываем toast ТОЛЬКО после успешной отправки формы
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

          <button
            className="how-to__order-btn btn open-modal"
            onClick={() => setIsModalOpen(true)}
          >
            Commander
          </button>
        </div>
      </div>

      {/* Модальное окно */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </section>
  );
};

export default HowToOrder;
