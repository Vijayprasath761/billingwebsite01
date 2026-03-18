import React from "react";

export function Cart({ cart, onUpdateQuantity, onRemoveItem }) {
  const handleChange = (menuItemId, value) => {
    const qty = parseInt(value, 10);
    if (Number.isNaN(qty) || qty < 0) return;
    onUpdateQuantity(menuItemId, qty);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="card cart-card">
      <h2 className="section-title">Cart ({totalItems} items)</h2>
      {cart.length === 0 ? (
        <p className="empty-state">No items in cart. Add something from menu.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.menuItemId}>
                <td>{item.name}</td>
                <td>₹ {item.price}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(item.menuItemId, e.target.value)
                    }
                    className="qty-input"
                  />
                </td>
                <td>₹ {item.price * item.quantity}</td>
                <td>
                  <button
                    className="btn btn-ghost"
                    onClick={() => onRemoveItem(item.menuItemId)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}

