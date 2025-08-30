import { useState } from "react";
import axios from "axios";
import "../styles/Login.css";

function Login({ setToken, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const res = await axios.post("https://chotu-link.vercel.app/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setPage("dashboard");
    } catch (err) {
      if (err.response?.data?.error) {
        setErrors([err.response.data.error]);
      } else {
        setErrors(["Login failed"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      <div className="login-split-left">
        <h1>Welcome Back!</h1>
        <p>Sign in to manage your links and unlock premium features 🚀</p>
      </div>

      <div className="login-split-right">
        <div className="login-split-card">
          <h2>Login</h2>

          {/* Display errors */}
          {errors.length > 0 && (
            <div className="login-errors">
              {errors.map((err, idx) => (
                <p key={idx} className="error-text">⚠️ {err}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-text">
            Don’t have an account? <span onClick={() => setPage("signup")}>Sign Up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
