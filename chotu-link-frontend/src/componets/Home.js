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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ If user is logged in, send request with token
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

      // ✅ If free user hits limit → show premium popup
      if (res.data.limitReached) {
        setShowPremiumPopup(true);
      }

      // ✅ If guest (no token) → show popup after first shorten
      if (!token) {
        setShowPremiumPopup(true);
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

          {/* Glow particles */}
          <span className="glow-particle" style={{ top: "30%", left: "20%", width: "6px", height: "6px" }}></span>
          <span className="glow-particle" style={{ top: "60%", left: "70%", width: "10px", height: "10px" }}></span>
          <span className="glow-particle" style={{ top: "40%", left: "50%", width: "8px", height: "8px" }}></span>

          <h1 className="display-4 fw-bold text-light mb-3 animate-fade">
            Shrink Links, Grow Reach
          </h1>
          <p className="lead text-light mb-4 animate-fade-delayed">
            Free & Premium URL Shortener with Analytics + QR Codes
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
              />
              <button type="submit" className="btn btn-premium rounded-pill px-4">
                Shorten
              </button>
            </form>

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
