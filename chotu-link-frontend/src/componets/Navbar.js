import React from "react";
import "../styles/Navbar.css"; // custom styles

function Navbar({ token, setPage, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg premium-navbar shadow-sm px-4 py-2 sticky-top">
      <a
        className="navbar-brand fw-bold fs-4"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setPage("home");
        }}
      >
        🚀 <span className="brand-text">ChotuLink</span>
      </a>

      {/* Toggle button for mobile */}
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
        <div className="ms-auto d-flex align-items-center gap-2">
          {!token ? (
            <>
              <button
                className="btn btn-premium-outline"
                onClick={() => setPage("login")}
              >
                Login
              </button>
              <button
                className="btn btn-premium-filled"
                onClick={() => setPage("signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-premium-success"
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>
              <button className="btn btn-premium-danger" onClick={handleLogout}>
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
