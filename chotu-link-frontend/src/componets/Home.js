import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBolt, FaChartLine, FaQrcode, FaLock, FaShareAlt,
  FaPaste, FaLink, FaPaperPlane
} from "react-icons/fa";
import PremiumPopup from "./PremiumPopup";
import "../styles/Home.css";

function Home({ token, setPage }) {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [floatingUrls, setFloatingUrls] = useState([]);
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [guestCount, setGuestCount] = useState(
    parseInt(localStorage.getItem("guestCount") || "0")
  );
  const [disabled, setDisabled] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Guest limit check before API call
    if (!token && guestCount >= 5) {
      alert("🚫 Guest limit reached (5). Please buy Premium for unlimited shortening.");
      setShowPremiumPopup(true);
      setDisabled(true);
      return;
    }

    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const res = await axios.post(
        "https://chotu-link.vercel.app/shorten",
        { url },
        config
      );

      setShortUrl(res.data.shortUrl);
      setUrl("");

      // ✅ Guest: increase counter
      if (!token) {
        const newCount = guestCount + 1;
        setGuestCount(newCount);
        localStorage.setItem("guestCount", newCount);

        // Show upsell popup on first shorten
        if (newCount === 1) {
          setShowPremiumPopup(true);
        }

        // Lock input after reaching 5
        if (newCount >= 5) {
          alert("⚠️ You’ve hit the guest limit. Upgrade to Premium for unlimited shortens!");
          setShowPremiumPopup(true);
          setDisabled(true);
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || "Shortening failed");
    }
  };

  // Floating random demo URLs
  useEffect(() => {
    const urls = [
      "https://Chotu.ly/abc123",
      "http://Chotu.cc/xyz89",
      "https://Chotu.ly/hello",
      "http://chotu.io/9hd8",
      "https://Chotu.link/fast",
    ];

    const randomUrls = Array.from({ length: 4 }, () => {
      const randomUrl = urls[Math.floor(Math.random() * urls.length)];
      const top = `${Math.floor(Math.random() * 70) + 10}%`;
      const left = `${Math.floor(Math.random() * 80) + 5}%`;
      return { text: randomUrl, top, left };
    });

    setFloatingUrls(randomUrls);
  }, []);

  return (
    <div>
      {/* Premium Popup */}
      {showPremiumPopup && (
        <PremiumPopup token={token} setPage={setPage} />
      )}

      {/* Hero + Shortener */}
      <section className="hero d-flex align-items-center text-center">
        <div className="container position-relative">
          {floatingUrls.map((item, index) => (
            <span
              key={index}
              className="floating-url"
              style={{ top: item.top, left: item.left }}
            >
              {item.text}
            </span>
          ))}

          <h1 className="display-4 fw-bold text-light mb-3 animate-fade">
            Shrink Links, Grow Reach
          </h1>
          <p className="lead text-light mb-4 animate-fade-delayed">
            Free (5 links for Guests) & Premium (Unlimited) with Analytics + QR Codes
          </p>

          <div className="shortener-card shadow-lg p-4 col-lg-8 mx-auto bg-white rounded-4">
            <h3 className="mb-4 text-center fw-bold text-gradient">Shorten a Long Link</h3>
            <form onSubmit={handleSubmit} className="d-flex gap-2">
              <input
                type="url"
                placeholder="Paste your long URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="form-control rounded-pill"
                required
                disabled={disabled}
              />
              <button
                type="submit"
                className="btn btn-premium rounded-pill px-4"
                disabled={disabled}
              >
                Shorten
              </button>
            </form>

            {/* Guest counter info */}
            {!token && (
              <p className="mt-3 text-muted small">
                {disabled
                  ? "🚫 Limit reached (5). Please buy Premium for unlimited shortens."
                  : `You have used ${guestCount}/5 free shortens.`}
              </p>
            )}

            {shortUrl && (
              <div className="alert alert-success mt-4 text-center">
                Your short link:{" "}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Plans & Benefits */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-gradient">🎉 Plans & Benefits</h2>

          <div className="row justify-content-center g-4">

            {/* Free Plan */}
            <div className="col-md-5">
              <div className="plan-card shadow-sm p-4 bg-white rounded-4 text-center h-100">
                <h3 className="fw-bold text-primary mb-3">Free Users</h3>
                <p className="small text-muted mb-4">Great for quick, casual link sharing</p>
                <ul className="list-unstyled text-muted text-start d-inline-block">
                  <li><FaLink className="me-2 text-primary" /> Shorten up to <b>5 links</b></li>
                  <li><FaBolt className="me-2 text-primary" /> Instant shortening (no login needed)</li>
                  <li><FaLock className="me-2 text-primary" /> Secure & spam-protected links</li>
                  <li><FaShareAlt className="me-2 text-primary" /> Easy copy & share</li>
                </ul>
                <button className="btn btn-outline-primary rounded-pill mt-3 px-4 fw-bold" disabled>
                  Free Forever ✅
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="col-md-5">
              <div className="plan-card premium-card shadow-lg p-4 bg-white rounded-4 text-center h-100 position-relative">
                <span className="badge-premium">Most Popular</span>
                <h3 className="fw-bold text-warning mb-3">Premium Users</h3>
                <p className="small text-muted mb-4">For professionals & businesses 🚀</p>
                <ul className="list-unstyled text-muted text-start d-inline-block">
                  <li><FaLink className="me-2 text-warning" /> Unlimited link shortening</li>
                  <li><FaChartLine className="me-2 text-warning" /> Detailed analytics & history</li>
                  <li><FaQrcode className="me-2 text-warning" /> Custom QR Codes</li>
                  <li><FaPaste className="me-2 text-warning" /> Custom aliases for branding</li>
                  <li><FaLock className="me-2 text-warning" /> Password-protected links</li>
                  <li><FaBolt className="me-2 text-warning" /> Priority performance</li>
                </ul>
                {/* Safe click handler */}
                <button
                  className="btn btn-warning rounded-pill mt-3 px-4 fw-bold"
                  onClick={() => {
                    if (!token) {
                      setShowPremiumPopup(true); // Show popup if user is not logged in
                    } else {
                      setPage?.("login"); // Or redirect to premium dashboard if logged in
                    }
                  }}
                >
                  {token ? "Go to Premium 🚀" : "Upgrade to Premium 🚀"}
                </button>

              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-gradient">✨ Our Features</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <FaBolt size={40} className="text-gradient mb-3" />
                <h4>Fast & Free</h4>
                <p className="text-muted">Instant link shortening without login for free users.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <FaChartLine size={40} className="text-gradient mb-3" />
                <h4>Analytics</h4>
                <p className="text-muted">Track clicks, performance & history (Premium only).</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <FaQrcode size={40} className="text-gradient mb-3" />
                <h4>QR Codes</h4>
                <p className="text-muted">Generate QR codes for easy sharing (Premium).</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <FaLock size={40} className="text-gradient mb-3" />
                <h4>Secure Links</h4>
                <p className="text-muted">Safe & encrypted shortening with spam protection.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <FaShareAlt size={40} className="text-gradient mb-3" />
                <h4>Easy Sharing</h4>
                <p className="text-muted">One-click share across platforms & social media.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-gradient">⚡ How It Works</h2>
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4">
                <FaPaste size={40} className="text-gradient mb-3" />
                <h4>1. Paste Link</h4>
                <p className="text-muted">Drop your long, messy link in our box.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4">
                <FaLink size={40} className="text-gradient mb-3" />
                <h4>2. Get Short URL</h4>
                <p className="text-muted">Click shorten & get a clean short link instantly.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4">
                <FaPaperPlane size={40} className="text-gradient mb-3" />
                <h4>3. Share Anywhere</h4>
                <p className="text-muted">Share via social, QR code or anywhere online.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
