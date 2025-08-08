import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      await register(form);
      setSuccess("Registration successful! You can now login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError("Registration failed. " + (err.message || ""));
    }
    setLoading(false);
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-white dark:bg-gray-900 transition-colors">
      <form className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 w-full max-w-sm border border-gray-200 dark:border-gray-800"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700 dark:text-purple-300 flex items-center justify-center gap-2">
          <span className="text-3xl">📝</span> Register
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4 text-center border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800">{success}</div>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
            autoComplete="username"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="block w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold shadow hover:bg-purple-700 transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="text-center mt-6 text-gray-500 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-600 hover:underline dark:text-purple-300">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
