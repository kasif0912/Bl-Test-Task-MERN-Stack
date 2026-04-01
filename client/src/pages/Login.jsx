import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);
      // console.log(res);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Login successful");

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>

        <p>
          Don&apos;t have an account? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
