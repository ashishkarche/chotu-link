const express = require('express');
const pool = require('./Databases/db');
const { nanoid } = require('nanoid');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Root check
app.get("/", (req, res) => {
  res.send("Chotu Link Backend is running 🚀");
});

// Route: Shorten URL
app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const shortCode = nanoid(6);

  try {
    await pool.query("INSERT INTO links (short_code, original_url) VALUES (?, ?)", [shortCode, url]);

    // Use environment variable for base URL
    const baseUrl = "https://chotu-link.vercel.app/";
    res.json({ shortUrl: `${baseUrl}/${shortCode}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Route: Redirect
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT original_url, click_count FROM links WHERE short_code = ?",
      [code]
    );

    if (rows.length === 0) return res.status(404).send("Link not found");

    // Update click count
    await pool.query("UPDATE links SET click_count = click_count + 1 WHERE short_code = ?", [code]);

    res.redirect(rows[0].original_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = app;
