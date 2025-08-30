require('dotenv').config();
const express = require('express');
const pool = require('./Databases/db');
const { nanoid } = require('nanoid');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const { body, validationResult } = require("express-validator");


// ------------------- Middlewares -------------------
app.use(express.json());
app.use(cors({ origin: "*" })); // 🔒 Can restrict to frontend domain in production
app.use(helmet());              // Adds security headers
app.use(morgan("dev"));         // Logs requests

// Rate limiter for guests only
const guestLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,              // 5 requests/minute for guests
  message: { error: "Too many requests as guest, please login for unlimited shortening." },
});

// ------------------- Rate Limiter -------------------
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: { error: "Too many login attempts. Try again in 1 minute." },
});

const signupLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: { error: "Too many signup attempts. Try again in 1 minute." },
});

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET not set in .env! Using fallback key.");
}

// ------------------- Helper: Auth Middleware -------------------
const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET || "fallback_secret_key");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// ------------------- Root -------------------
app.get("/", (req, res) => {
  res.send("✅ Chotu Link Backend is running 🚀");
});

// ------------------- AUTH -------------------

// ------------------- Signup Route -------------------
app.post(
  "/signup",
  signupLimiter,
  [
    body("username").trim().isLength({ min: 3 }).withMessage("Username must be at least 3 characters."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    try {
      // Check for duplicate email
      const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
      if (existing.length > 0) return res.status(400).json({ error: "Email already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
        [username, email, hashed]
      );

      // Auto-login after signup
      const token = jwt.sign(
        { id: result.insertId, email, username },
        JWT_SECRET || "fallback_secret_key",
        { expiresIn: "7d" }
      );

      res.json({ message: "Signup successful", token });
    } catch (err) {
      console.error("❌ Signup error:", err);
      res.status(500).json({ error: "Signup failed" });
    }
  }
);

// ------------------- Login Route -------------------
app.post(
  "/login",
  loginLimiter,
  [
    body("email").isEmail().withMessage("Invalid email address."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      if (rows.length === 0) return res.status(400).json({ error: "User not found" });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(400).json({ error: "Incorrect password" });

      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        JWT_SECRET || "fallback_secret_key",
        { expiresIn: "7d" }
      );

      res.json({ message: "Login successful", token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
      console.error("❌ Login error:", err);
      res.status(500).json({ error: "Login failed" });
    }
  }
);


// ------------------- URL SHORTENER -------------------

// Shorten URL
app.post("/shorten", async (req, res, next) => {
  const { url, expiryMinutes } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  const baseUrl = "https://chotu-link.vercel.app";

  // Check auth
  let userId = null;
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET || "fallback_secret_key");
      userId = decoded.id;
    } catch (err) {
      userId = null;
    }
  }

  // ✅ Guests → enforce limiter
  if (!userId) {
    return guestLimiter(req, res, async () => {
      const shortUrl = `${baseUrl}/${nanoid(6)}`;
      return res.json({
        shortUrl,
        note: "Guest links are temporary (not stored)",
      });
    });
  }

  // ✅ Premium user → unlimited
  try {
    let shortCode;
    while (true) {
      shortCode = nanoid(6);
      const [rows] = await pool.query("SELECT id FROM links WHERE short_code = ?", [shortCode]);
      if (rows.length === 0) break;
    }

    const shortUrl = `${baseUrl}/${shortCode}`;
    const expiresAt = new Date(Date.now() + (expiryMinutes || 10080) * 60000);

    await pool.query(
      "INSERT INTO links (short_code, short_url, original_url, user_id, expires_at) VALUES (?, ?, ?, ?, ?)",
      [shortCode, shortUrl, url, userId, expiresAt]
    );

    res.json({ shortUrl, expiresAt });
  } catch (err) {
    console.error("❌ DB Insert error:", err);
    res.status(500).json({ error: "DB error" });
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
    console.error("❌ Fetch links error:", err);
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
    console.error("❌ Click count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Redirect + check expiry + update clicks
app.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT original_url, expires_at FROM links WHERE short_code = ?",
      [code]
    );

    if (rows.length === 0) return res.status(404).send("Link not found");

    if (rows[0].expires_at && new Date(rows[0].expires_at) < new Date()) {
      return res.status(410).send("⏰ Link expired");
    }

    await pool.query(
      "UPDATE links SET click_count = click_count + 1 WHERE short_code = ?",
      [code]
    );

    res.redirect(rows[0].original_url);
  } catch (err) {
    console.error("❌ Redirect error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = app;
