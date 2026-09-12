import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "BUYER",
  });

  const [showPassword, setShowPassword] = useState(false);
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

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5050/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "SUPPLIER") {
        navigate("/supplier-marketplace");
      } else {
        navigate("/buyer-dashboard");
      }
    } catch (err) {
      console.error("REGISTRATION ERROR:", err);
      setError(err.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg">
              R
            </div>

            <span className="text-2xl font-bold">
              RFQ<span className="text-blue-500">Market</span>
            </span>
          </div>
        </Link>

        {/* Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Create your account
            </h1>

            <p className="text-slate-400">
              Join the B2B RFQ marketplace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Business Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@company.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pr-20 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-blue-500 transition"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-400 hover:text-blue-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">
                I want to
              </label>

              <div className="grid grid-cols-2 gap-3">

                {/* Buyer */}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "BUYER",
                    })
                  }
                  className={`p-4 rounded-xl border text-left transition ${
                    form.role === "BUYER"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800"
                  }`}
                >
                  <div className="text-lg mb-1">
                    🛒
                  </div>

                  <div className="font-semibold">
                    Buy
                  </div>

                  <div className="text-xs text-slate-400">
                    Create RFQs
                  </div>
                </button>

                {/* Supplier */}
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      role: "SUPPLIER",
                    })
                  }
                  className={`p-4 rounded-xl border text-left transition ${
                    form.role === "SUPPLIER"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-800"
                  }`}
                >
                  <div className="text-lg mb-1">
                    🏭
                  </div>

                  <div className="font-semibold">
                    Sell
                  </div>

                  <div className="text-xs text-slate-400">
                    Submit quotations
                  </div>
                </button>

              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          {/* Login */}
          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign in
            </Link>
          </p>

        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By creating an account, you agree to our Terms & Privacy Policy.
        </p>

      </div>
    </div>
  );
}