import React from "react";

export function QrCodeModal({ qrDataUrl, bill, onClose, onConfirmPayment }) {
  if (!qrDataUrl || !bill) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2 className="section-title">Scan to Pay</h2>
        <p className="modal-text">
          Bill ID: <strong>{bill.id}</strong>
        </p>
        <p className="modal-text">
          Amount: <strong>₹ {bill.total}</strong>
        </p>
        <img src="vijay prasath.png" alt="Payment QR" className="qr-image" />
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={onConfirmPayment}>
            Payment Received
          </button>
        </div>
      </div>
    </div>
  );
}

