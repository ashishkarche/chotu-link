import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand fw-bold" href="/">🌐 Chotu.link</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {token ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <a className="btn btn-outline-light" href="/login">Login</a>
                </li>
                <li className="nav-item">
                  <a className="btn btn-primary" href="/signup">Signup</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  );
}

export default App;
