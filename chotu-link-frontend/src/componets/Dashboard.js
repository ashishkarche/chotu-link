import { useState, useEffect } from "react";
import axios from "axios";
// ✅ Correct import
import { QRCodeCanvas } from "qrcode.react";
import "../styles/Dashboard.css";

function Dashboard({ token }) {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTokenExpiry = () => {
    alert("⚠️ Session expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://chotu-link.vercel.app/mylinks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLinks(res.data.links);
    } catch (err) {
      if (err.response?.status === 401) {
        handleTokenExpiry();
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://chotu-link.vercel.app/shorten",
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShortUrl(res.data.shortUrl);
      setUrl("");
      fetchLinks();
    } catch (err) {
      if (err.response?.status === 401) {
        handleTokenExpiry();
      } else {
        alert(err.response?.data?.error || "Shortening failed");
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage("✅ Link copied to clipboard!");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="container my-5 position-relative">
      {/* Shorten Box */}
      <div className="card premium-card shadow-lg p-4">
        <h2 className="mb-3 fw-bold text-gradient">🔗 Shorten Your URL</h2>
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
          <div className="alert alert-success mt-4 d-flex justify-content-between align-items-center">
            <div>
              ✅ Your short link:{" "}
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-sm btn-outline-light rounded-pill"
                onClick={() => copyToClipboard(shortUrl)}
              >
                Copy
              </button>
              <button
                className="btn btn-sm btn-outline-dark rounded-pill"
                data-bs-toggle="modal"
                data-bs-target="#qrModal"
              >
                QR Code
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Links List */}
      <div className="mt-5">
        <h3 className="fw-bold mb-3">📂 Your Links</h3>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : links.length === 0 ? (
          <p className="text-muted">No links yet. Start shortening!</p>
        ) : (
          <ul className="list-group premium-list">
            {links.map((link) => {
              const shortLink = `${window.location.origin}/${link.short_code}`;
              return (
                <li
                  key={link.short_code}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <a
                      href={shortLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fw-semibold text-decoration-none short-link"
                    >
                      {shortLink}
                    </a>
                    <br />
                    <small className="text-muted">{link.original_url}</small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary rounded-pill">
                      {link.click_count} clicks
                    </span>
                    <button
                      className="btn btn-sm btn-outline-primary rounded-pill"
                      onClick={() => copyToClipboard(shortLink)}
                    >
                      Copy
                    </button>
                    <button
                      className="btn btn-sm btn-outline-dark rounded-pill"
                      data-bs-toggle="modal"
                      data-bs-target="#qrModal"
                      onClick={() => setShortUrl(shortLink)}
                    >
                      QR
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ✅ QR Code Modal */}
      <div
        className="modal fade"
        id="qrModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center p-4">
            <h5 className="fw-bold mb-3">📱 QR Code</h5>
            {shortUrl && <QRCodeCanvas value={shortUrl} size={200} />}
            <p className="mt-3">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
              </a>
            </p>
            <button
              className="btn btn-secondary mt-2"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Bootstrap Toast */}
      {showToast && (
        <div
          className="toast-container position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          <div className="toast show align-items-center text-bg-success border-0">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setShowToast(false)}
              ></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
