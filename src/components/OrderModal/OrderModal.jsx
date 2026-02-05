"use client";
import { useState, useEffect } from "react";
import "./OrderModal.scss";
import {
  validateName,
  validatePhone,
  validateQuantity,
  formatPhoneForDisplay,
} from "@/lib/validation/orderForm.fr.schema";
import { sendToTelegram } from "@/app/actions/sendToTelegram";

const OrderModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    metroStation: "",
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
    "Groseille rose - 2,50€",
    "Fraise - 2,50€",
    "Abricot - 2,50€",
    "Cerises - 2,50€",
    "Raisin - 2,50€",
  ];

  // Список станций метро Марселя
  const metroStations = [
    // Ligne M1 – La Rose ↔ La Fourragère
    "La Rose",
    "Frais Vallon",
    "Malpassé",
    "Saint-Just",
    "Chartreux",
    "Cinq-Avenues - Longchamp",
    "Réformés - Canebière",
    "Colbert",
    "Vieux-Port",
    "Estrangin",
    "Baille",
    "La Timone",
    "La Blancarde",
    "Louis Armand",
    "Saint-Barnabé",
    "La Fourragère",

    "Saint-Charles",
    "Castellane",

    "Gèze",
    "Bougainville",
    "National",
    "Désirée Clary",
    "Joliette",
    "Jules Guesde",
    "Noailles",
    "Notre-Dame-du-Mont",
    "Périer",
    "Rond-point du Prado",
    "Sainte-Marguerite Dromel",
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

    // Валидация имени
    const nameError = validateName(formData.name);
    if (nameError) {
      newErrors.name = nameError;
    }

    // Валидация телефона
    const phoneError = validatePhone(formData.phone);
    if (phoneError) {
      newErrors.phone = phoneError;
    }

    // Валидация станции метро
    if (!formData.metroStation.trim()) {
      newErrors.metroStation = "Veuillez choisir une station de métro";
    }

    // Проверяем, что выбран хотя бы один вкус
    const hasValidFlavor = selectedFlavors.some((item) => item.flavor);
    if (!hasValidFlavor) {
      newErrors[`flavor-0`] = "Veuillez choisir au moins un goût";
    }

    // Проверяем каждый выбранный вкус
    selectedFlavors.forEach((item, index) => {
      if (item.flavor) {
        const quantityError = validateQuantity(item.quantity, minQuantity);
        if (quantityError) {
          newErrors[`quantity-${index}`] = quantityError;
        }
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
      const validFlavors = selectedFlavors
        .filter((item) => item.flavor && item.quantity >= minQuantity)
        .map((item) => ({
          flavor: item.flavor,
          quantity: item.quantity,
        }));

      // Проверяем, что есть хотя бы один вкус
      if (validFlavors.length === 0) {
        throw new Error("No valid flavors selected");
      }

      // Форматируем телефон для отправки в телеграм
      const formattedPhone = formatPhoneForDisplay(formData.phone);

      // Создаем объект данных для отправки
      const orderData = {
        name: formData.name.trim(),
        phone: formattedPhone.trim(),
        metroStation: formData.metroStation || "Не указано",
      };

      console.log("Order data:", {
        orderData,
        validFlavors,
        totalPrice,
      });

      // Отправляем в Telegram через Server Action
      const result = await sendToTelegram(orderData, validFlavors, totalPrice);

      console.log("Telegram result:", result);

      if (!result.success) {
        throw new Error(result.error || "Erreur d'envoi");
      }

      // Показываем видео
      setShowVideo(true);

      setTimeout(() => {
        onClose();
        setShowVideo(false);
        setFormData({ name: "", phone: "", metroStation: "" });
        setSelectedFlavors([{ flavor: "", quantity: minQuantity }]);
        setIsSubmitting(false);

        if (onSuccess) {
          onSuccess();
        }
      }, 5000);
    } catch (error) {
      console.error("Complete error in handleSubmit:", error);
      setIsSubmitting(false);
      alert(
        `Erreur lors de l'envoi de la commande: ${error.message}. Veuillez réessayer.`,
      );
    }
  };

  const handleClose = () => {
    if (!showVideo) {
      setFormData({ name: "", phone: "", metroStation: "" });
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

            <h2>Passer une commande</h2>

            <form onSubmit={handleSubmit} className="order-form">
              <div className="form-group">
                <label htmlFor="name">Nom *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? "error" : ""}
                  placeholder="Entrez votre nom"
                />
                {errors.name && (
                  <span className="error-message">{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone *</label>
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

              <div className="form-group">
                <label htmlFor="metroStation">
                  Station de métro à Marseille *
                </label>
                <select
                  id="metroStation"
                  name="metroStation"
                  value={formData.metroStation}
                  onChange={handleChange}
                  className={errors.metroStation ? "error" : ""}
                >
                  <option value="">Sélectionnez une station</option>
                  <option disabled>────────────</option>
                  {metroStations.map((station, index) => (
                    <option key={index} value={station}>
                      {station}
                    </option>
                  ))}
                </select>
                {errors.metroStation && (
                  <span className="error-message">{errors.metroStation}</span>
                )}
                <div className="metro-hint">
                  <small>Pour la remise en main propre</small>
                </div>
              </div>

              <div className="flavors-section">
                <label className="section-label">
                  Choix des goûts *{" "}
                  <span className="min-info">
                    (min. {minQuantity} pcs chacun)
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
                          <option value="">Choisir un goût</option>
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
                    + Ajouter un autre goût
                  </button>
                )}
              </div>

              <div className="total-price">
                <span>Coût total:</span>
                <strong>{totalPrice}€</strong>
              </div>

              <button
                type="submit"
                className="btn submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer la commande"}
              </button>

              <p className="privacy-notice">
                En envoyant ce formulaire, vous acceptez automatiquement la
                collecte de données et indiquez où vous souhaitez récupérer
                votre commande.
              </p>
            </form>
          </>
        ) : (
          <div className="video-container">
            <video autoPlay muted playsInline className="order-video">
              <source src="/video/Piruza-work.mp4" type="video/mp4" />
            </video>
            <p className="video-text">Piruza prépare votre commande...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderModal;
