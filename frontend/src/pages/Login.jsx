import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { Mail, Lock, BrainCircuit } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(formData);

      // Store token and user information
      sessionStorage.setItem("access_token", data.access_token);
      sessionStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d19] flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-[#101827] border border-white/10 rounded-2xl p-8 shadow-2xl">
        <div className="flex justify-center mb-5">
          <div className="bg-cyan-500/10 p-4 rounded-xl">
            <BrainCircuit size={38} className="text-cyan-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Sign in to your AI-AgentHub workspace
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address
            </label>

            <div className="flex items-center gap-3 bg-[#080d19] border border-white/10 rounded-lg px-4">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>

            <div className="flex items-center gap-3 bg-[#080d19] border border-white/10 rounded-lg px-4">
              <Lock size={18} className="text-gray-400" />

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
