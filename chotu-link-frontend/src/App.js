import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from "./componets/Dashboard";
import Login from "./componets/Login";
import Signup from "./componets/Signup";
import Home from "./componets/Home";
import Navbar from "./componets/Navbar";
import Footer from "./componets/Footer";
import PremiumPopup from "./componets/PremiumPopup";
import "./App.css";

function App() {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken);
  const [page, setPage] = useState(storedToken ? "dashboard" : "home");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("home");
    toast.info("Logged out successfully!");
  };

  useEffect(() => {
    // Prevent accessing Dashboard without login
    if (!token && page === "dashboard") {
      toast.warning("⚠️ Please log in to access Dashboard.");
      setPage("home");
    }

    // Disable right-click
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    // Disable common dev tools keys (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        toast.error("⚠️ This action is disabled!");
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
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

      <PremiumPopup token={token} setPage={setPage} />
      <Footer />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover
      />
    </div>
  );
}

export default App;
