import React, { useEffect, useState } from "react";
import { FaLink, FaQrcode, FaChartLine, FaLock } from "react-icons/fa";
import "../styles/PremiumPopup.css";

function PremiumPopup({ token, setPage }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      const timer = setTimeout(() => setShow(true), 2500);
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
      <div className="premium-popup animate-popup">
        {/* Close Button */}
        <button
          className="popup-close"
          onClick={() => setShow(false)}
          disabled={loading}
        >
          ✖
        </button>

        <h3 className="popup-title">🚀 Unlock Premium</h3>
        <p className="popup-sub">Take your link game to the next level!</p>

        {/* Benefits List */}
        <ul className="popup-benefits">
          <li><FaLink className="icon" /> Unlimited Links</li>
          <li><FaChartLine className="icon" /> Analytics & History</li>
          <li><FaQrcode className="icon" /> QR Code Generator</li>
          <li><FaLock className="icon" /> Password-Protected Links</li>
        </ul>

        <p className="popup-note">✨ Don’t miss out — maximize every click!</p>

        <div className="popup-actions">
          <button
            className="btn btn-upgrade"
            onClick={handleBuyPremium}
            disabled={loading}
          >
            {loading ? <span className="loader"></span> : "Upgrade Now 🚀"}
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
