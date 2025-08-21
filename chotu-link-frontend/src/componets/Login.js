import { useState } from "react";
import axios from "axios";

function Login({ setToken, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://chotu-link.vercel.app/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setPage("dashboard"); // ✅ redirect after login
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-bg">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ maxWidth: "420px", width: "100%" }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold">🔑 Welcome Back</h2>
          <p className="text-muted">Login to access premium features 🚀</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control form-control-lg rounded-3"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control form-control-lg rounded-3"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 rounded-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center small">
          Don’t have an account?{" "}
          <span
            className="text-primary fw-semibold"
            role="button"
            onClick={() => setPage("signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
