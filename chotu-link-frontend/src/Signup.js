import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup({ setToken }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://chotu-link.vercel.app/signup", { username, email, password });
      // Auto login after signup
      const res = await axios.post("https://chotu-link.vercel.app/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <form onSubmit={handleSubmit} className="w-100" style={{ maxWidth: "400px" }}>
        <h2 className="mb-4 text-center">Signup</h2>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="form-control mb-3" required />
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="form-control mb-3" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control mb-3" required />
        <button type="submit" className="btn btn-primary w-100">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
