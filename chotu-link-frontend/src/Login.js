import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://chotu-link.vercel.app/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Login</h2>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control mb-3" required />
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}

export default Login;
