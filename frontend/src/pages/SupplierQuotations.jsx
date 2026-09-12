import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050";

function SupplierQuotations() {
  const navigate = useNavigate();

  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!token) {
        navigate("/login");
        return;
      }

      if (user?.role !== "SUPPLIER") {
        navigate("/");
        return;
      }

      const response = await fetch(`${API_URL}/api/quotations/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load quotations");
      }

      setQuotations(data.quotations || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (quotation) => {
    const unitPrice = Number(quotation.unitPrice || 0);
    const tax = Number(quotation.tax || 0);
    const shipping = Number(quotation.shipping || 0);

    const quantity = Number(quotation.rfq?.quantity || 1);

    return unitPrice * quantity + tax + shipping;
  };

  const filteredQuotations = useMemo(() => {
    return quotations.filter((quotation) => {
      const title = quotation.rfq?.title || "";
      const company =
        quotation.rfq?.buyer?.companyName ||
        quotation.rfq?.buyer?.name ||
        "";

      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        company.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" ||
        quotation.status?.toUpperCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotations, search, statusFilter]);

  const totalValue = quotations.reduce(
    (sum, quotation) => sum + calculateTotal(quotation),
    0
  );

  const pendingCount = quotations.filter(
    (quotation) => quotation.status === "PENDING"
  ).length;

  const acceptedCount = quotations.filter(
    (quotation) => quotation.status === "ACCEPTED"
  ).length;

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusStyle = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">
            Loading your quotations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/supplier-marketplace"
            className="text-2xl font-extrabold text-blue-600"
          >
            RFQMarket
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/supplier-marketplace"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Marketplace
            </Link>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
              }}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            SUPPLIER PORTAL
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            My Quotations
          </h1>

          <p className="text-slate-500 mt-2">
            Track every quotation you have submitted on RFQMarket.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <p className="font-semibold">Unable to load quotations</p>
            <p className="text-sm mt-1">{error}</p>

            <button
              onClick={() => {
                setLoading(true);
                setError("");
                fetchQuotations();
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Total Quotations
            </p>

            <p className="text-3xl font-extrabold text-slate-900 mt-2">
              {quotations.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Pending
            </p>

            <p className="text-3xl font-extrabold text-yellow-600 mt-2">
              {pendingCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Accepted
            </p>

            <p className="text-3xl font-extrabold text-green-600 mt-2">
              {acceptedCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <p className="text-sm text-slate-500 font-medium">
              Quoted Value
            </p>

            <p className="text-2xl font-extrabold text-blue-600 mt-2">
              {formatCurrency(totalValue)}
            </p>
          </div>
        </div>

        {/* SEARCH + FILTER */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by RFQ title or buyer..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:w-56">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredQuotations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">📋</div>

            <h2 className="text-xl font-bold text-slate-900">
              No quotations found
            </h2>

            <p className="text-slate-500 mt-2 mb-6">
              {quotations.length === 0
                ? "You have not submitted any quotations yet."
                : "Try changing your search or status filter."}
            </p>

            {quotations.length === 0 && (
              <Link
                to="/supplier-marketplace"
                className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Browse RFQs
              </Link>
            )}
          </div>
        ) : (
          /* QUOTATIONS */
          <div className="space-y-5">
            {filteredQuotations.map((quotation) => {
              const rfq = quotation.rfq;
              const buyer =
                rfq?.buyer?.companyName || rfq?.buyer?.name || "Unknown Buyer";

              const quantity = Number(rfq?.quantity || 1);
              const subtotal =
                Number(quotation.unitPrice || 0) * quantity;

              const total = calculateTotal(quotation);

              return (
                <div
                  key={quotation.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                      {/* LEFT */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                              quotation.status
                            )}`}
                          >
                            {quotation.status || "PENDING"}
                          </span>

                          <span className="text-xs text-slate-400">
                            Submitted {formatDate(quotation.createdAt)}
                          </span>
                        </div>

                        <h2 className="text-xl font-bold text-slate-900">
                          {rfq?.title || "Untitled RFQ"}
                        </h2>

                        <p className="text-slate-500 mt-1">
                          Buyer:{" "}
                          <span className="font-semibold text-slate-700">
                            {buyer}
                          </span>
                        </p>
                      </div>

                      {/* TOTAL */}
                      <div className="lg:text-right">
                        <p className="text-sm text-slate-500">
                          Total Quotation
                        </p>

                        <p className="text-2xl font-extrabold text-blue-600">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500">
                          Quantity
                        </p>

                        <p className="font-bold text-slate-900 mt-1">
                          {quantity}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500">
                          Unit Price
                        </p>

                        <p className="font-bold text-slate-900 mt-1">
                          {formatCurrency(quotation.unitPrice)}
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500">
                          Delivery
                        </p>

                        <p className="font-bold text-slate-900 mt-1">
                          {quotation.deliveryDays} days
                        </p>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-4">
                        <p className="text-xs text-slate-500">
                          Validity
                        </p>

                        <p className="font-bold text-slate-900 mt-1">
                          {quotation.validityDays} days
                        </p>
                      </div>
                    </div>

                    {/* COST BREAKDOWN */}
                    <div className="mt-6 pt-5 border-t border-slate-200">
                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <div>
                          <span className="text-slate-500">
                            Subtotal:
                          </span>{" "}
                          <span className="font-semibold text-slate-800">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500">
                            Tax:
                          </span>{" "}
                          <span className="font-semibold text-slate-800">
                            {formatCurrency(quotation.tax)}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-500">
                            Shipping:
                          </span>{" "}
                          <span className="font-semibold text-slate-800">
                            {formatCurrency(quotation.shipping)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* NOTES */}
                    {quotation.notes && (
                      <div className="mt-5 p-4 bg-blue-50 rounded-xl">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                          Your Notes
                        </p>

                        <p className="text-sm text-slate-700 mt-1">
                          {quotation.notes}
                        </p>
                      </div>
                    )}

                    {/* ACTIONS */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {rfq?.id && (
                        <Link
                          to={`/supplier-rfq/${rfq.id}`}
                          className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                        >
                          View RFQ
                        </Link>
                      )}

                      <Link
                        to="/supplier-marketplace"
                        className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
                      >
                        Browse More RFQs
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default SupplierQuotations;