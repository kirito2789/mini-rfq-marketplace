import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5050/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      // Save authentication data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect according to role
      if (data.user.role === "SUPPLIER") {
        navigate("/supplier-marketplace");
      } else {
        navigate("/buyer-dashboard");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err);
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left */}
        <div className="hidden lg:block">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight"
          >
            RFQ<span className="text-cyan-400">Market</span>
          </Link>

          <div className="mt-12 max-w-lg">
            <p className="text-cyan-400 font-semibold mb-3">
              B2B PROCUREMENT PLATFORM
            </p>

            <h1 className="text-5xl font-black leading-tight mb-6">
              Welcome back to smarter procurement.
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed">
              Manage RFQs, connect with suppliers, compare quotations,
              and make better purchasing decisions.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-8 md:p-10 text-slate-900 shadow-2xl">

          <div className="lg:hidden mb-6">
            <Link
              to="/"
              className="text-2xl font-black"
            >
              RFQ<span className="text-cyan-500">Market</span>
            </Link>
          </div>

          <h2 className="text-3xl font-black">
            Welcome back
          </h2>

          <p className="text-slate-500 mt-2 mb-7">
            Sign in to continue to your RFQMarket account.
          </p>

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-950 text-white py-3.5 font-bold hover:bg-cyan-600 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-cyan-600 hover:text-cyan-700"
            >
              Create account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}