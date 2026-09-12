import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function BuyerDashboard() {
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        "http://localhost:5050/api/rfqs/my",
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
      console.error("FETCH RFQS ERROR:", err);
      setError(
        err.message || "Unable to load your RFQs."
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

  const totalRFQs = rfqs.length;

  const openRFQs = rfqs.filter(
    (rfq) => rfq.status === "OPEN"
  ).length;

  const totalQuotations = rfqs.reduce(
    (total, rfq) =>
      total + (rfq.quotations?.length || 0),
    0
  );

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
                {user?.name || "Buyer"}
              </p>

              <p className="text-xs text-slate-500">
                {user?.companyName || "Buyer Account"}
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>
            <p className="text-blue-400 font-semibold text-sm mb-2">
              BUYER DASHBOARD
            </p>

            <h1 className="text-4xl font-black">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your RFQs and supplier quotations.
            </p>
          </div>

          <Link
            to="/create-rfq"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition"
          >
            + Create RFQ
          </Link>

        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Total RFQs
            </p>

            <p className="text-3xl font-black mt-2">
              {loading ? "—" : totalRFQs}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Open RFQs
            </p>

            <p className="text-3xl font-black mt-2 text-blue-400">
              {loading ? "—" : openRFQs}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-slate-400 text-sm">
              Quotations Received
            </p>

            <p className="text-3xl font-black mt-2 text-green-400">
              {loading ? "—" : totalQuotations}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400">
            {error}
          </div>
        )}

        {/* RFQ Section */}
        <div className="flex items-center justify-between mb-5">

          <div>
            <h2 className="text-2xl font-bold">
              Your RFQs
            </h2>

            <p className="text-slate-500 text-sm mt-1">
              RFQs created by your account
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
            <div className="text-slate-400">
              Loading your RFQs...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && rfqs.length === 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">

            <div className="text-5xl mb-5">
              📋
            </div>

            <h3 className="text-xl font-bold mb-2">
              No RFQs yet
            </h3>

            <p className="text-slate-400 mb-6">
              Create your first RFQ and start receiving supplier quotations.
            </p>

            <Link
              to="/create-rfq"
              className="inline-flex px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition"
            >
              Create Your First RFQ
            </Link>

          </div>
        )}

        {/* RFQ Cards */}
        {!loading && rfqs.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-5">

            {rfqs.map((rfq) => (
              <div
                key={rfq.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition"
              >

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

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rfq.status === "OPEN"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : rfq.status === "CLOSED"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}
                  >
                    {rfq.status}
                  </span>

                </div>

                <p className="text-slate-400 text-sm mt-4 line-clamp-3">
                  {rfq.description}
                </p>

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
                        : "—"}
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
                      Quotations
                    </p>

                    <p className="font-semibold mt-1 text-blue-400">
                      {rfq.quotations?.length || 0}
                    </p>
                  </div>

                </div>

                {rfq.location && (
                  <div className="mt-5 text-sm text-slate-400">
                    📍 {rfq.location}
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-slate-800">

                  <Link
                    to={`/rfq/${rfq.id}`}
                    className="block w-full text-center py-3 rounded-xl bg-slate-800 hover:bg-blue-600 font-semibold transition"
                  >
                    View RFQ
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