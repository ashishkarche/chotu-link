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

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key"; // ⚠️ Use .env in production

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

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ------------------- URL SHORTENER -------------------

// Shorten URL (authenticated or guest)
app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  const shortCode = nanoid(6);
  const baseUrl = "https://chotu-link.vercel.app"; // Your frontend domain
  const shortUrl = `${baseUrl}/${shortCode}`;

  // Check if user is authenticated
  let userId = null;
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.id; // store user id if logged in
    } catch (err) {
      // Token invalid, treat as guest
      userId = null;
    }
  }

  try {
    // Store link in DB, user_id can be null for guests
    await pool.query(
      "INSERT INTO links (short_code, short_url, original_url, user_id) VALUES (?, ?, ?, ?)",
      [shortCode, shortUrl, url, userId]
    );

    res.json({ shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get("/mylinks", authMiddleware, async (req, res) => {
  try {
    const [links] = await pool.query(
      "SELECT short_code, short_url, original_url, click_count, created_at FROM links WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json({ links });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Cannot fetch links" });
  }
});


// Get live click count for a single link
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

// Redirect + update click count
app.get('/:code', async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT original_url FROM links WHERE short_code = ?",
      [code]
    );

    if (rows.length === 0) return res.status(404).send("Link not found");

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
