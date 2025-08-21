import { useState, useEffect } from "react";
import Dashboard from "./componets/Dashboard";
import Login from "./componets/Login";
import Signup from "./componets/Signup";
import Home from "./componets/Home";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("home");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("home");
  };

  useEffect(() => {
    // 🔹 If user tries to access Dashboard without login
    if (!token && page === "dashboard") {
      alert("⚠️ Please log in to access Dashboard.");
      setPage("home");
    }
  }, [token, page]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar token={token} setPage={setPage} handleLogout={handleLogout} />

      <main className="flex-grow-1">
        {page === "home" && <Home />}
        {page === "login" && <Login setToken={setToken} setPage={setPage} />}
        {page === "signup" && <Signup setToken={setToken} setPage={setPage} />}
        {page === "dashboard" && token && (
          <Dashboard token={token} handleLogout={handleLogout} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
