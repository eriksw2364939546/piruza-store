"use client";
import { useState, useEffect } from "react";
import "./OrderModal.scss";

const OrderModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [selectedFlavors, setSelectedFlavors] = useState([
    { flavor: "", quantity: 5 },
  ]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const pricePerUnit = 2.5;
  const minQuantity = 5;

  const flavors = [
    "Розовая смородина - 2,50€",
    "Клубника - 2,50€",
    "Абрикос - 2,50€",
    "Грецкий орех - 2,50€",
    "Миндаль - 2,50€",
  ];

  // Вычисление общей стоимости
  const totalPrice = selectedFlavors
    .reduce((sum, item) => {
      return item.flavor ? sum + item.quantity * pricePerUnit : sum;
    }, 0)
    .toFixed(2);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !showVideo) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, showVideo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFlavorChange = (index, field, value) => {
    const newFlavors = [...selectedFlavors];
    newFlavors[index][field] = value;
    setSelectedFlavors(newFlavors);

    // Убираем ошибку при изменении
    if (errors[`flavor-${index}`] || errors[`quantity-${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`flavor-${index}`];
        delete newErrors[`quantity-${index}`];
        return newErrors;
      });
    }
  };

  const addFlavor = () => {
    setSelectedFlavors([
      ...selectedFlavors,
      { flavor: "", quantity: minQuantity },
    ]);
  };

  const removeFlavor = (index) => {
    if (selectedFlavors.length > 1) {
      const newFlavors = selectedFlavors.filter((_, i) => i !== index);
      setSelectedFlavors(newFlavors);
    }
  };

  // Получить доступные вкусы (не выбранные)
  const getAvailableFlavors = (currentIndex) => {
    const selectedFlavorNames = selectedFlavors
      .map((item, index) => (index !== currentIndex ? item.flavor : null))
      .filter(Boolean);
    return flavors.filter((flavor) => !selectedFlavorNames.includes(flavor));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Введите ваше имя";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Введите телефон";
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = "Неверный формат телефона";
    }

    // Проверяем, что выбран хотя бы один вкус
    const hasValidFlavor = selectedFlavors.some((item) => item.flavor);
    if (!hasValidFlavor) {
      newErrors[`flavor-0`] = "Выберите хотя бы один вкус";
    }

    // Проверяем каждый выбранный вкус
    selectedFlavors.forEach((item, index) => {
      if (item.flavor && item.quantity < minQuantity) {
        newErrors[`quantity-${index}`] = `Минимум ${minQuantity} штук`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Фильтруем только заполненные вкусы
      const validFlavors = selectedFlavors.filter((item) => item.flavor);

      await sendToTelegram(formData, validFlavors, totalPrice);

      setShowVideo(true);

      setTimeout(() => {
        onClose();
        setShowVideo(false);
        setFormData({ name: "", phone: "" });
        setSelectedFlavors([{ flavor: "", quantity: minQuantity }]);
        setIsSubmitting(false);

        if (onSuccess) {
          onSuccess();
        }
      }, 5000);
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setIsSubmitting(false);
    }
  };

  const sendToTelegram = async (data, flavors, total) => {
    console.log("Отправка в Telegram:", {
      ...data,
      flavors,
      totalPrice: total,
    });
    return new Promise((resolve) => setTimeout(resolve, 500));
  };

  const handleClose = () => {
    if (!showVideo) {
      setFormData({ name: "", phone: "" });
      setSelectedFlavors([{ flavor: "", quantity: minQuantity }]);
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="order-modal-overlay"
      onClick={!showVideo ? handleClose : null}
    >
      <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
        {!showVideo ? (
          <>
            <button className="order-modal-close" onClick={handleClose}>
              ✕
            </button>

            <h2>Оформление заказа</h2>

            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="name">Имя *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  placeholder="Введите ваше имя"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Телефон *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "error" : ""}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              <div className="flavors-section">
                <label className="section-label">
                  Выбор вкусов *{" "}
                  <span className="min-info">
                    (мин. {minQuantity} шт. каждого)
                  </span>
                </label>

                {selectedFlavors.map((item, index) => (
                  <div key={index} className="flavor-item">
                    <div className="flavor-row">
                      <div className="flavor-select-group">
                        <select
                          value={item.flavor}
                          onChange={(e) =>
                            handleFlavorChange(index, "flavor", e.target.value)
                          }
                          className={errors[`flavor-${index}`] ? "error" : ""}
                        >
                          <option value="">Выберите вкус</option>
                          {getAvailableFlavors(index).map((flavor) => (
                            <option key={flavor} value={flavor}>
                              {flavor}
                            </option>
                          ))}
                          {item.flavor &&
                            !getAvailableFlavors(index).includes(
                              item.flavor,
                            ) && (
                              <option value={item.flavor}>{item.flavor}</option>
                            )}
                        </select>
                        {errors[`flavor-${index}`] && (
                          <span className="error-message">
                            {errors[`flavor-${index}`]}
                          </span>
                        )}
                      </div>

                      <div className="quantity-group">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleFlavorChange(
                              index,
                              "quantity",
                              parseInt(e.target.value) || minQuantity,
                            )
                          }
                          min={minQuantity}
                          className={errors[`quantity-${index}`] ? "error" : ""}
                        />
                        {errors[`quantity-${index}`] && (
                          <span className="error-message">
                            {errors[`quantity-${index}`]}
                          </span>
                        )}
                      </div>

                      {selectedFlavors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFlavor(index)}
                          className="remove-flavor-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {item.flavor && (
                      <div className="flavor-price">
                        {item.quantity} × {pricePerUnit}€ ={" "}
                        {(item.quantity * pricePerUnit).toFixed(2)}€
                      </div>
                    )}
                  </div>
                ))}

                {selectedFlavors.length < flavors.length && (
                  <button
                    type="button"
                    onClick={addFlavor}
                    className="add-flavor-btn"
                  >
                    + Добавить ещё вкус
                  </button>
                )}
              </div>

              <div className="total-price">
                <span>Общая стоимость:</span>
                <strong>{totalPrice}€</strong>
              </div>

              <button
                type="submit"
                className="btn submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить заказ"}
              </button>

              <p className="privacy-notice">
                При отправке формы вы автоматически соглашаетесь на сбор данных
              </p>
            </form>
          </>
        ) : (
          <div className="video-container">
            <video autoPlay muted playsInline className="order-video">
              <source src="/video/Piruza-work.mp4" type="video/mp4" />
            </video>
            <p className="video-text">Пируза готовит ваш заказ...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
