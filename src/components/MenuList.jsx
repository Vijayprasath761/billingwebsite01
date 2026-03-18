import React from "react";

export function MenuList({ menu, onAddToCart }) {
  const activeItems = menu.filter((item) => item.isActive);

  return (
    <section className="card">
      <h2 className="section-title">Menu</h2>
      <div className="menu-grid">
        {activeItems.map((item) => (
          <article key={item.id} className="menu-card">
            <div className="menu-image-wrapper">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="menu-image"
              />
            </div>
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p className="menu-category">{item.category}</p>
              <p className="menu-price">₹ {item.price}</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => onAddToCart(item)}
            >
              Add to Cart
            </button>
          </article>
        ))}
        {activeItems.length === 0 && (
          <p className="empty-state">No active menu items. Please add some.</p>
        )}
      </div>
    </section>
  );
}

