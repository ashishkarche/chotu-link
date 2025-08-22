import React, { useEffect, useState } from "react";
import "../styles/PremiumPopup.css";

function PremiumPopup({ token, setPage }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  if (token || !show) return null;

  const handleBuyPremium = () => {
    setLoading(true);
    setTimeout(() => {
      setShow(false);
      setPage("login");
    }, 1500);
  };

  return (
    <div className="premium-popup-overlay">
      <div className="premium-popup">
        {/* Close Button */}
        <button
          className="popup-close"
          onClick={() => setShow(false)}
          disabled={loading}
        >
          ✖
        </button>

        <h3>🚀 Unlock Premium Features</h3>
        <p>You're just one step away from a better experience!</p>
        <p>
          <strong>Login now</strong> to access your link history, generate QR
          codes instantly, and explore exclusive tools designed for you.
        </p>
        <p>✨ Don’t miss out — make the most of every click.</p>

        <div className="popup-actions">
          <button
            className="btn btn-primary"
            onClick={handleBuyPremium}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : "Login"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShow(false)}
            disabled={loading}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

export default PremiumPopup;
