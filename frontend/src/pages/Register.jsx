import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import { BrainCircuit, User, Mail, Lock } from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Registration failed. Please try again.",
      );
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

        <h1 className="text-3xl font-bold text-center">Create Account</h1>

        <p className="text-gray-400 text-center mt-2 mb-8">
          Join your AI-AgentHub workspace
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name
            </label>

            <div className="flex items-center gap-3 bg-[#080d19] border border-white/10 rounded-lg px-4">
              <User size={18} className="text-gray-400" />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                minLength={2}
                maxLength={80}
                required
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

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
                placeholder="Minimum 8 characters"
                minLength={8}
                maxLength={128}
                required
                className="w-full bg-transparent py-3 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          {success && <p className="text-green-400 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
