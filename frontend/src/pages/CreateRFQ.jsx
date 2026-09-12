import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateRFQ() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    budget: "",
    deliveryDate: "",
    location: "",
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

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to create an RFQ.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5050/api/rfqs",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            category: form.category,
            quantity: form.quantity
              ? Number(form.quantity)
              : undefined,
            budget: form.budget
              ? Number(form.budget)
              : undefined,
            deliveryDate: form.deliveryDate || undefined,
            location: form.location,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create RFQ"
        );
      }

      alert("RFQ created successfully!");

      navigate("/buyer-dashboard");

    } catch (err) {
      console.error("CREATE RFQ ERROR:", err);

      setError(
        err.message || "Unable to create RFQ."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950/95">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-black tracking-tight"
          >
            RFQ<span className="text-blue-500">Market</span>
          </Link>

          <Link
            to="/buyer-dashboard"
            className="text-sm text-slate-400 hover:text-white transition"
          >
            ← Back to Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-12">

        <div className="mb-10">
          <p className="text-blue-400 font-semibold text-sm mb-2">
            BUYER
          </p>

          <h1 className="text-4xl font-black">
            Create a Request for Quotation
          </h1>

          <p className="text-slate-400 mt-3">
            Tell suppliers what you need and receive competitive quotations.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 space-y-7"
        >

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              RFQ Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. 500 Office Chairs"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the product or service you need..."
              rows="5"
              required
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Category
            </label>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Office Furniture"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Quantity + Budget */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-semibold mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 500"
                min="1"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Budget
              </label>

              <input
                type="number"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. 500000"
                min="0"
                step="0.01"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

          </div>

          {/* Delivery + Location */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-semibold mb-2">
                Required Delivery Date
              </label>

              <input
                type="date"
                name="deliveryDate"
                value={form.deliveryDate}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Delivery Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

          </div>

          {/* Submit */}
          <div className="pt-4">

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-4 font-bold text-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Creating RFQ..."
                : "Publish RFQ"}
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}