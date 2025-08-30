require('dotenv').config();
const express = require('express');
const pool = require('./Databases/db');
const { nanoid } = require('nanoid');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key";

// ------------------- Middleware -------------------
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ------------------- Root -------------------
app.get("/", (req, res) => {
  res.send("Chotu Link Backend is running 🚀");
});

// ------------------- AUTH -------------------

// Signup
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: "All fields required" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [username, email, hashed]
    );
    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(400).json({ error: "Wrong password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ------------------- URL SHORTENER -------------------

// Shorten URL (authenticated or guest)
app.post('/shorten', async (req, res) => {
  const { url, expiryMinutes } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const baseUrl = "https://chotu-link.vercel.app"; // frontend domain

  // Check if user is authenticated
  let userId = null;
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id;
    } catch (err) {
      userId = null;
    }
  }

  // Guests → just return temp link, don’t save
  if (!userId) {
    const shortUrl = `${baseUrl}/${nanoid(6)}`;
    return res.json({ shortUrl, note: "Guest links are temporary (not stored)" });
  }

  try {
    let shortCode;

    // Ensure unique short code
    while (true) {
      shortCode = nanoid(6);
      const [rows] = await pool.query("SELECT id FROM links WHERE short_code = ?", [shortCode]);
      if (rows.length === 0) break;
    }

    const shortUrl = `${baseUrl}/${shortCode}`;
    const expiresAt = new Date(Date.now() + (expiryMinutes || 10080) * 60000); // default 7 days

    await pool.query(
      "INSERT INTO links (short_code, short_url, original_url, user_id, expires_at) VALUES (?, ?, ?, ?, ?)",
      [shortCode, shortUrl, url, userId, expiresAt]
    );

    res.json({ shortUrl, expiresAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Fetch user links
app.get("/mylinks", authMiddleware, async (req, res) => {
  try {
    const [links] = await pool.query(
      "SELECT short_code, short_url, original_url, click_count, created_at, expires_at FROM links WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch links" });
  }
});

// Get live click count
app.get("/clicks/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT click_count FROM links WHERE short_code = ?",
      [code]
    );

    if (rows.length === 0) return res.status(404).json({ error: "Link not found" });

    res.json({ short_code: code, click_count: rows[0].click_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect + check expiry + update clicks
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT original_url, expires_at FROM links WHERE short_code = ?",
      [code]
    );

    if (rows.length === 0) return res.status(404).send("Link not found");

    if (rows[0].expires_at && new Date(rows[0].expires_at) < new Date()) {
      return res.status(410).send("Link expired");
    }

    await pool.query(
      "UPDATE links SET click_count = click_count + 1 WHERE short_code = ?",
      [code]
    );

    res.redirect(rows[0].original_url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = app;
