import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SupplierMarketplace() {
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5050/api/rfqs/open",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch RFQs"
        );
      }

      setRfqs(data.rfqs || []);
    } catch (err) {
      console.error("FETCH OPEN RFQS ERROR:", err);

      setError(
        err.message || "Unable to load marketplace."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const categories = [
    "ALL",
    ...new Set(
      rfqs
        .map((rfq) => rfq.category)
        .filter(Boolean)
    ),
  ];

  const filteredRFQs = rfqs.filter((rfq) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      rfq.title?.toLowerCase().includes(searchText) ||
      rfq.description?.toLowerCase().includes(searchText) ||
      rfq.category?.toLowerCase().includes(searchText) ||
      rfq.location?.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "ALL" ||
      rfq.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link
            to="/"
            className="text-2xl font-black tracking-tight"
          >
            RFQ<span className="text-blue-500">Market</span>
          </Link>

          <div className="flex items-center gap-5">

            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold">
                {user?.name || "Supplier"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.companyName || "Supplier Account"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg border border-slate-700 text-sm font-semibold hover:bg-slate-800 transition"
            >
              Logout
            </button>

          </div>

        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">

          <p className="text-blue-400 font-semibold text-sm mb-2">
            SUPPLIER MARKETPLACE
          </p>

          <h1 className="text-4xl font-black">
            Find opportunities
          </h1>

          <p className="text-slate-400 mt-2">
            Browse open RFQs from buyers and submit competitive quotations.
          </p>

        </div>

        {/* Search + Filter */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">

          <div className="grid md:grid-cols-3 gap-4">

            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-500 mb-2">
                Search RFQs
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by product, category or location..."
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-blue-500 transition"
              >
                {categories.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "ALL"
                      ? "All Categories"
                      : item}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold">
              Open RFQs
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              {loading
                ? "Loading opportunities..."
                : `${filteredRFQs.length} opportunities available`}
            </p>
          </div>

          <button
            onClick={fetchRFQs}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-700 text-sm hover:bg-slate-800 transition disabled:opacity-50"
          >
            Refresh
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
            <p className="text-slate-400">
              Loading available RFQs...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredRFQs.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-5">
              🔎
            </div>

            <h3 className="text-xl font-bold mb-2">
              No RFQs found
            </h3>

            <p className="text-slate-400">
              Try changing your search or category filter.
            </p>

          </div>
        )}

        {/* RFQ Cards */}
        {!loading && filteredRFQs.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-5">

            {filteredRFQs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition"
              >

                {/* Top */}
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h3 className="text-xl font-bold">
                      {rfq.title}
                    </h3>

                    {rfq.category && (
                      <p className="text-blue-400 text-sm mt-1">
                        {rfq.category}
                      </p>
                    )}
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                    OPEN
                  </span>

                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mt-4 line-clamp-3">
                  {rfq.description}
                </p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mt-6">

                  <div>
                    <p className="text-xs text-slate-500">
                      Quantity
                    </p>

                    <p className="font-semibold mt-1">
                      {rfq.quantity ?? "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Budget
                    </p>

                    <p className="font-semibold mt-1">
                      {rfq.budget
                        ? `₹${Number(
                            rfq.budget
                          ).toLocaleString("en-IN")}`
                        : "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Delivery
                    </p>

                    <p className="font-semibold mt-1">
                      {formatDate(rfq.deliveryDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Buyer
                    </p>

                    <p className="font-semibold mt-1">
                      {rfq.buyer?.companyName ||
                        rfq.buyer?.name ||
                        "Buyer"}
                    </p>
                  </div>

                </div>

                {/* Location */}
                {rfq.location && (
                  <div className="mt-5 text-sm text-slate-400">
                    📍 {rfq.location}
                  </div>
                )}

                {/* Action */}
                <div className="mt-6 pt-5 border-t border-slate-800">

                  <Link
                    to={`/supplier-rfq/${rfq.id}`}
                    className="block w-full text-center py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
                  >
                    View RFQ & Submit Quote
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}