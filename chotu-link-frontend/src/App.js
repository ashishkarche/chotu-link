import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`https://chotu-link.vercel.app/shorten`, {
        url,
      });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert("Error shortening URL");
    }
  };

  return (
    <div>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top shadow custom-navbar">
        <div className="container">
          <a className="navbar-brand fw-bold fs-4" href="#shortener">
            🌐 Chotu.link
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#shortener">
                  Shortener
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#whyuse">
                  Why Use Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Shortener Section */}
      <section id="shortener" className="shortener-section d-flex flex-column align-items-center justify-content-center">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-white display-5">🔗 Shorten Your URL</h2>
          <form onSubmit={handleSubmit} className="mb-3 w-100" style={{ maxWidth: "600px", margin: "0 auto" }}>
            <div className="input-group">
              <input
                type="url"
                placeholder="Paste your long URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="form-control rounded-start"
                required
              />
              <button
                type="submit"
                className="btn btn-primary px-4 fw-semibold"
              >
                Shorten
              </button>
            </div>
          </form>
          {shortUrl && (
            <div className="mt-3">
              <p className="text-white mb-1">Your short link:</p>
              <div className="d-flex justify-content-center align-items-center flex-wrap">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-bold text-decoration-none text-warning me-2"
                >
                  {shortUrl}
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(shortUrl)}
                  className="btn btn-outline-light btn-sm mt-2"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Use Us Section */}
      <section id="whyuse" className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="fw-bold mb-5">Why Use Chotu.link?</h2>
          <div className="row">
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold text-primary">⚡ Fast & Easy</h4>
              <p>Shorten links instantly with one click. No sign-up required!</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold text-success">🌍 Share Anywhere</h4>
              <p>Perfect for social media, messaging, blogs, and global use.</p>
            </div>
            <div className="col-md-4 mb-4">
              <h4 className="fw-bold text-danger">🔒 Secure</h4>
              <p>Your links are safe and encrypted for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0 small">
          © {new Date().getFullYear()} Chotu.link | Built with ❤️ for the Web
        </p>
      </footer>
    </div>
  );
}

export default App;
