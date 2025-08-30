import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import "../styles/Navbar.css";

function Navbar({ token, setPage, handleLogout }) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username || decoded.email || "User"); // depends on your backend payload
      } catch (err) {
        console.error("Invalid token", err);
      }
    } else {
      setUsername("");
    }
  }, [token]);

  return (
    <nav className="navbar navbar-expand-lg premium-navbar px-4 py-2 sticky-top">
      <a
        className="navbar-brand fw-bold fs-4 d-flex align-items-center gap-2"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage("home");
        }}
      >
        <FaLink className="brand-icon" />
        <span className="brand-text">ChotuLink</span>
      </a>

      {/* Mobile Toggle */}
      <button
        className="navbar-toggler custom-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarContent">
        <div className="ms-auto d-flex align-items-center gap-3 flex-wrap">
          {!token ? (
            <>
              <button
                className="btn btn-nav-outline"
                onClick={() => setPage("login")}
              >
                Login
              </button>
              <button
                className="btn btn-nav-filled"
                onClick={() => setPage("signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <span className="fw-semibold text-white">
                👋 Hi, {username}
              </span>
              <button
                className="btn btn-nav-success"
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>
              <button className="btn btn-nav-danger" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
