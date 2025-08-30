import { useState } from "react";
import axios from "axios";
import "../styles/Signup.css";

function Signup({ setToken, setPage }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Signup request
      const signupRes = await axios.post("https://chotu-link.vercel.app/signup", {
        username,
        email,
        password,
      });

      // Auto login after signup
      const loginRes = await axios.post("https://chotu-link.vercel.app/login", {
        email,
        password,
      });

      localStorage.setItem("token", loginRes.data.token);
      setToken(loginRes.data.token);
      setPage("dashboard");
    } catch (err) {
      // Handle backend validation errors
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.map(e => e.msg));
      } else if (err.response?.data?.error) {
        setErrors([err.response.data.error]);
      } else {
        setErrors(["Signup failed"]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-split-container">
      <div className="signup-split-left">
        <h1>Join ChotuLink!</h1>
        <p>Create your account to shorten links, generate QR codes, and unlock premium features 🚀</p>
      </div>

      <div className="signup-split-right">
        <div className="signup-split-card">
          <h2>Create Account</h2>

          {/* Display errors */}
          {errors.length > 0 && (
            <div className="signup-errors">
              {errors.map((err, idx) => (
                <p key={idx} className="error-text">⚠️ {err}</p>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="login-text">
            Already have an account?{" "}
            <span onClick={() => setPage("login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
