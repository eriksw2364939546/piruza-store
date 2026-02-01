"use client";
import "./Products.scss";
import Image from "next/image";
import ProductCard from "@/components/ProductCard/ProductCard";
import OrderModal from "@/components/OrderModal/OrderModal";
import { useState } from "react";
import toast from "react-hot-toast";

const Products = () => {
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

  const products = [
    {
      id: 1,
      name: "Sudjouke",
      description: "Délicieux sudjouke à la groseille rose, 25cm",
      imageSrc: "/images/product-pink_currant.jpeg",
      price: "2.50€",
      imageText: "Groseille rose",
    },
    {
      id: 2,
      name: "Sudjouke",
      description: "Délicieux sudjouke à la fraise, 25cm",
      imageSrc: "/images/product-strawberry.jpeg",
      price: "2.50€",
      imageText: "Fraise",
    },
    {
      id: 3,
      name: "Sudjouke",
      description: "Délicieux sudjouke à l'abricot, 25cm",
      imageSrc: "/images/product-apricot.jpeg",
      price: "2.50€",
      imageText: "Abricot",
    },
  ];

  return (
    <section id="flavors" className="products">
      <div className="container">
        <div className="products-content">
          <h2>Sudjouke arménien</h2>
          <div className="products-list">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                image={
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    width={270}
                    height={354}
                  />
                }
                imageSrc={product.imageSrc}
                price={product.price}
                imageText={product.imageText}
              />
            ))}
          </div>

          <button
            className="products-btn btn open-modal"
            onClick={() => setIsModalOpen(true)}
          >
            Commande
          </button>
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

export default Products;
