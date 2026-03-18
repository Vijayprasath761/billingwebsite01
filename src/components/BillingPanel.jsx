import React from "react";
import QRCode from "qrcode";

export function BillingPanel({ cart, totals, onClearCart, onPaymentInitiated }) {
  const hasItems = cart.length > 0;

  const handlePayNow = async () => {
    if (!hasItems) return;
    const billId = `BILL-${Date.now()}`;
    const bill = {
      id: billId,
      items: cart,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      createdAt: new Date().toISOString(),
    };

    const qrText = `BILL:${bill.id};TOTAL:${bill.total}`;
    try {
      const qrDataUrl = await QRCode.toDataURL(qrText, { margin: 1 });
      onPaymentInitiated(bill, qrDataUrl);
    } catch (err) {
      alert("Failed to generate QR code");
      console.error(err);
    }
  };

  const handlePrint = () => {
    if (!hasItems) return;
    window.print();
  };

  return (
    <section className="card billing-card">
      <h2 className="section-title">Billing</h2>
      <div className="billing-summary">
        <div className="billing-row">
          <span>Subtotal</span>
          <span>₹ {totals.subtotal}</span>
        </div>
        <div className="billing-row">
          <span>Tax (5%)</span>
          <span>₹ {totals.tax}</span>
        </div>
        <div className="billing-row billing-total">
          <span>Total</span>
          <span>₹ {totals.total}</span>
        </div>
      </div>
      <div className="billing-actions">
        <button
          className="btn btn-primary"
          disabled={!hasItems}
          onClick={handlePayNow}
        >
          Pay Now (QR)
        </button>
        <button
          className="btn btn-secondary"
          disabled={!hasItems}
          onClick={handlePrint}
        >
          Print Bill
        </button>
        <button
          className="btn btn-danger"
          disabled={!hasItems}
          onClick={onClearCart}
        >
          Clear Cart
        </button>
      </div>
      {!hasItems && (
        <p className="empty-state">Add items to cart to generate a bill.</p>
      )}
    </section>
  );
}

