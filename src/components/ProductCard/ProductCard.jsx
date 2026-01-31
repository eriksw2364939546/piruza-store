"use client";
import "./ProductCard.scss";
import { useState } from "react";

const ProductCard = ({
  id,
  description,
  image,
  price,
  imageText,
  imageSrc,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Блокируем скролл
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Возвращаем скролл
  };

  return (
    <>
      <div className="product-card" key={id} onClick={openModal}>
        <div className="product-card__img">
          {image}
          <p className="product-card__img-text">{imageText}</p>
        </div>

        <div className="product-card__content">
          <p className="product-card__descr">{description}</p>
          <p className="product-card__price">{price} par pièce</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <img src={imageSrc} alt={description} className="modal-image" />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
