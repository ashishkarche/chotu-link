import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/shorten`,
        { url }
      );
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      alert("Error shortening URL");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Chotu.link</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="Paste your long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Shorten
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6">
            <p className="text-gray-700">Your short link:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold break-all"
            >
              {shortUrl}
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(shortUrl)}
              className="ml-3 text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
