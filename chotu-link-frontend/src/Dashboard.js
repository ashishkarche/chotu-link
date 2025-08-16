import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard({ token }) {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [links, setLinks] = useState([]);

  const fetchLinks = async () => {
    try {
      const res = await axios.get("https://chotu-link.vercel.app/mylinks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLinks(res.data.links);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://chotu-link.vercel.app/shorten", { url }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShortUrl(res.data.shortUrl);
      setUrl("");
      fetchLinks();
    } catch (err) {
      alert(err.response?.data?.error || "Shortening failed");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">🔗 Shorten Your URL</h2>
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="input-group">
          <input type="url" placeholder="Paste your long URL..." value={url} onChange={e => setUrl(e.target.value)} className="form-control" required />
          <button type="submit" className="btn btn-primary">Shorten</button>
        </div>
      </form>

      {shortUrl && (
        <div className="mb-4">
          <p>Your short link:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
        </div>
      )}

      <h3 className="mt-5">Your Links</h3>
      <ul className="list-group">
        {links.map(link => (
          <li key={link.short_code} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <a href={`/${link.short_code}`} target="_blank" rel="noopener noreferrer">{link.short_code}</a> → {link.original_url}
            </div>
            <span className="badge bg-primary rounded-pill">{link.click_count} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
