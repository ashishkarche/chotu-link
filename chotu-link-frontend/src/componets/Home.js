import { useState } from "react";
import axios from "axios";
import "../styles/Home.css"; // custom styles

function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://chotu-link.vercel.app/shorten", { url });
      setShortUrl(res.data.shortUrl);
      setUrl("");
    } catch (err) {
      alert(err.response?.data?.error || "Shortening failed");
    }
  };

  return (
    <div>
      {/* ✅ Hero + Shortener Combined */}
      <section className="hero d-flex align-items-center text-center">
        <div className="container">
          <h1 className="display-4 fw-bold text-light mb-3">Shrink Links, Grow Reach.</h1>
          <p className="lead text-light mb-4">
            Free & Premium URL Shortener with Analytics + QR Codes
          </p>

          {/* URL Shortener directly inside hero */}
          <div className="shortener-card shadow-lg p-4 col-lg-8 mx-auto bg-white rounded-4">
            <h3 className="mb-4 text-center fw-bold text-gradient">🔗 Shorten a Long Link</h3>
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
                ✅ Your short link:{" "}
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ✅ Why Choose Us */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold text-gradient">✨ Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <h4>⚡ Fast & Free</h4>
                <p className="text-muted">Instant link shortening without login for free users.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <h4>📊 Analytics</h4>
                <p className="text-muted">Premium users get detailed click tracking and history.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card shadow-sm p-4 text-center">
                <h4>📱 QR Codes</h4>
                <p className="text-muted">Generate QR codes for easy sharing (Premium).</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
