"use client";
import "./HowToOrder.scss";

const HowToOrder = () => {
  return (
    <section className="how-to__order">
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
        </div>
      </div>
    </section>
  );
};

export default HowToOrder;
