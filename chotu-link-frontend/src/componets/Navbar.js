import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import {jwtDecode} from "jwt-decode";
import "../styles/Navbar.css";

function Navbar({ token, setPage, handleLogout }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || decoded.email || "User");
      } catch (err) {
        console.error("Invalid token", err);
      }
    } else {
      setUsername("");
    }
  }, [token]);

  return (
    <nav className="navbar-modern">
      <div className="navbar-brand" onClick={() => setPage("home")}>
        <FaLink className="brand-icon" />
        <span>ChotuLink</span>
      </div>

      <div className="navbar-links">
        {!token ? (
          <>
            <button className="btn-outline-modern" onClick={() => setPage("login")}>
              Login
            </button>
            <button className="btn-gradient-modern" onClick={() => setPage("signup")}>
              Signup
            </button>
          </>
        ) : (
          <>
            <span className="navbar-greeting">👋 Hi, {username}</span>
            <button className="btn-gradient-modern" onClick={() => setPage("dashboard")}>
              Dashboard
            </button>
            <button className="btn-outline-modern danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
