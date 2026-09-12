import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

const API_URL = "http://localhost:5050";

function BuyerQuotations() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [rfqs, setRfqs] = useState([]);
  const [quotations, setQuotations] = useState([]);

  const [selectedRFQ, setSelectedRFQ] = useState(
    searchParams.get("rfqId") || ""
  );

  const [loadingRFQs, setLoadingRFQs] = useState(true);
  const [loadingQuotations, setLoadingQuotations] = useState(false);

  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const [sortBy, setSortBy] = useState("price");

  useEffect(() => {
    loadRFQs();
  }, []);

  useEffect(() => {
    if (selectedRFQ) {
      loadQuotations(selectedRFQ);
    }
  }, [selectedRFQ]);

  const getToken = () => localStorage.getItem("token");

  const loadRFQs = async () => {
    try {
      const token = getToken();
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      if (user?.role !== "BUYER") {
        navigate("/");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/rfqs/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load RFQs"
        );
      }

      const loadedRFQs = data.rfqs || [];

      setRfqs(loadedRFQs);

      if (loadedRFQs.length > 0) {
        const requestedRFQ = searchParams.get("rfqId");

        const exists = loadedRFQs.some(
          (rfq) => rfq.id === requestedRFQ
        );

        if (!requestedRFQ || !exists) {
          setSelectedRFQ(loadedRFQs[0].id);
          setSearchParams({
            rfqId: loadedRFQs[0].id,
          });
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load RFQs");
    } finally {
      setLoadingRFQs(false);
    }
  };

  const loadQuotations = async (rfqId) => {
    try {
      setLoadingQuotations(true);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/quotations/rfq/${rfqId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load quotations"
        );
      }

      setQuotations(data.quotations || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load quotations");
      setQuotations([]);
    } finally {
      setLoadingQuotations(false);
    }
  };

  const handleRFQChange = (rfqId) => {
    setSelectedRFQ(rfqId);

    setSearchParams({
      rfqId,
    });
  };

  const handleAccept = async (quotationId) => {
    const confirmed = window.confirm(
      "Accept this quotation? This will close the RFQ and reject all other pending quotations."
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(quotationId);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/quotations/${quotationId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to accept quotation"
        );
      }

      await loadQuotations(selectedRFQ);
      await loadRFQs();

      alert(
        "Quotation accepted successfully. The RFQ is now closed."
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to accept quotation");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (quotationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this quotation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(quotationId);
      setError("");

      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/quotations/${quotationId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reject quotation"
        );
      }

      await loadQuotations(selectedRFQ);

      alert("Quotation rejected successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to reject quotation");
    } finally {
      setActionLoading("");
    }
  };

  const currentRFQ = rfqs.find(
    (rfq) => rfq.id === selectedRFQ
  );

  const sortedQuotations = useMemo(() => {
    const copy = [...quotations];

    if (sortBy === "price") {
      copy.sort(
        (a, b) =>
          Number(a.unitPrice) - Number(b.unitPrice)
      );
    }

    if (sortBy === "delivery") {
      copy.sort(
        (a, b) =>
          Number(a.deliveryDays) -
          Number(b.deliveryDays)
      );
    }

    if (sortBy === "validity") {
      copy.sort(
        (a, b) =>
          Number(b.validityDays) -
          Number(a.validityDays)
      );
    }

    return copy;
  }, [quotations, sortBy]);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const totalQuotationValue = quotations.reduce(
    (sum, quotation) => {
      const quantity = Number(
        currentRFQ?.quantity || 1
      );

      const subtotal =
        Number(quotation.unitPrice || 0) *
        quantity;

      return (
        sum +
        subtotal +
        Number(quotation.tax || 0) +
        Number(quotation.shipping || 0)
      );
    },
    0
  );

  if (loadingRFQs) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-slate-600 font-medium">
            Loading your RFQs...
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
            to="/buyer-dashboard"
            className="text-2xl font-extrabold text-blue-600"
          >
            RFQMarket
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/buyer-dashboard"
              className="text-sm font-semibold text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/create-rfq"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Create RFQ
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
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600 mb-2">
            BUYER PORTAL
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Supplier Quotations
          </h1>

          <p className="text-slate-500 mt-2">
            Compare supplier offers and choose the best quotation for your RFQ.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <p className="font-semibold">
              Something went wrong
            </p>

            <p className="text-sm mt-1">
              {error}
            </p>
          </div>
        )}

        {/* NO RFQS */}

        {rfqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">
              📋
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              No RFQs yet
            </h2>

            <p className="text-slate-500 mt-2 mb-6">
              Create your first RFQ to start receiving supplier quotations.
            </p>

            <Link
              to="/create-rfq"
              className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700"
            >
              Create RFQ
            </Link>
          </div>
        ) : (
          <>
            {/* RFQ SELECTOR */}

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Select RFQ
              </label>

              <select
                value={selectedRFQ}
                onChange={(e) =>
                  handleRFQChange(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >
                {rfqs.map((rfq) => (
                  <option
                    key={rfq.id}
                    value={rfq.id}
                  >
                    {rfq.title} — {rfq.status}
                  </option>
                ))}
              </select>
            </div>

            {/* RFQ SUMMARY */}

            {currentRFQ && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-slate-900">
                        {currentRFQ.title}
                      </h2>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          currentRFQ.status ===
                          "OPEN"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {currentRFQ.status}
                      </span>
                    </div>

                    <p className="text-slate-500">
                      {currentRFQ.description}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500">
                      Budget
                    </p>

                    <p className="text-2xl font-extrabold text-blue-600">
                      {currentRFQ.budget
                        ? formatCurrency(
                            currentRFQ.budget
                          )
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Category
                    </p>

                    <p className="font-bold text-slate-900 mt-1">
                      {currentRFQ.category ||
                        "General"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Quantity
                    </p>

                    <p className="font-bold text-slate-900 mt-1">
                      {currentRFQ.quantity ||
                        "—"}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Quotations
                    </p>

                    <p className="font-bold text-slate-900 mt-1">
                      {quotations.length}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-xs text-slate-500">
                      Total Quoted Value
                    </p>

                    <p className="font-bold text-blue-600 mt-1">
                      {formatCurrency(
                        totalQuotationValue
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CONTROLS */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Supplier Offers
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {quotations.length} quotation
                  {quotations.length !== 1
                    ? "s"
                    : ""} received
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="price">
                  Sort: Lowest Price
                </option>

                <option value="delivery">
                  Sort: Fastest Delivery
                </option>

                <option value="validity">
                  Sort: Longest Validity
                </option>
              </select>
            </div>

            {/* LOADING */}

            {loadingQuotations ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

                <p className="text-slate-500">
                  Loading supplier quotations...
                </p>
              </div>
            ) : quotations.length === 0 ? (
              /* EMPTY */

              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                <div className="text-5xl mb-4">
                  📭
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  No quotations yet
                </h2>

                <p className="text-slate-500 mt-2">
                  Suppliers have not submitted quotations for this RFQ yet.
                </p>
              </div>
            ) : (
              /* QUOTATIONS */

              <div className="space-y-5">
                {sortedQuotations.map(
                  (quotation, index) => {
                    const quantity = Number(
                      currentRFQ?.quantity || 1
                    );

                    const subtotal =
                      Number(
                        quotation.unitPrice || 0
                      ) * quantity;

                    const total =
                      subtotal +
                      Number(
                        quotation.tax || 0
                      ) +
                      Number(
                        quotation.shipping || 0
                      );

                    const supplierName =
                      quotation.supplier
                        ?.companyName ||
                      quotation.supplier
                        ?.name ||
                      "Supplier";

                    const isAccepted =
                      quotation.status ===
                      "ACCEPTED";

                    const isRejected =
                      quotation.status ===
                      "REJECTED";

                    const isPending =
                      quotation.status ===
                      "PENDING";

                    return (
                      <div
                        key={quotation.id}
                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${
                          isAccepted
                            ? "border-green-400 ring-2 ring-green-100"
                            : "border-slate-200"
                        }`}
                      >
                        <div className="p-6">
                          {/* TOP */}

                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-lg">
                                {index + 1}
                              </div>

                              <div>
                                <div className="flex flex-wrap items-center gap-3">
                                  <h3 className="text-xl font-bold text-slate-900">
                                    {supplierName}
                                  </h3>

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusClass(
                                      quotation.status
                                    )}`}
                                  >
                                    {
                                      quotation.status
                                    }
                                  </span>
                                </div>

                                <p className="text-sm text-slate-500 mt-1">
                                  {quotation
                                    .supplier
                                    ?.name ||
                                    "Supplier"}{" "}
                                  •{" "}
                                  {quotation
                                    .supplier
                                    ?.email ||
                                    "No email"}
                                </p>
                              </div>
                            </div>

                            <div className="lg:text-right">
                              <p className="text-sm text-slate-500">
                                Total Offer
                              </p>

                              <p className="text-3xl font-extrabold text-blue-600">
                                {formatCurrency(
                                  total
                                )}
                              </p>
                            </div>
                          </div>

                          {/* METRICS */}

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                            <div className="bg-slate-50 rounded-xl p-4">
                              <p className="text-xs text-slate-500">
                                Unit Price
                              </p>

                              <p className="font-bold text-slate-900 mt-1">
                                {formatCurrency(
                                  quotation.unitPrice
                                )}
                              </p>
                            </div>

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
                                Delivery
                              </p>

                              <p className="font-bold text-slate-900 mt-1">
                                {
                                  quotation.deliveryDays
                                }{" "}
                                days
                              </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                              <p className="text-xs text-slate-500">
                                Validity
                              </p>

                              <p className="font-bold text-slate-900 mt-1">
                                {
                                  quotation.validityDays
                                }{" "}
                                days
                              </p>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-4">
                              <p className="text-xs text-slate-500">
                                Submitted
                              </p>

                              <p className="font-bold text-slate-900 mt-1">
                                {formatDate(
                                  quotation.createdAt
                                )}
                              </p>
                            </div>
                          </div>

                          {/* BREAKDOWN */}

                          <div className="mt-5 pt-5 border-t border-slate-200 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                            <span>
                              <span className="text-slate-500">
                                Subtotal:
                              </span>{" "}
                              <strong>
                                {formatCurrency(
                                  subtotal
                                )}
                              </strong>
                            </span>

                            <span>
                              <span className="text-slate-500">
                                Tax:
                              </span>{" "}
                              <strong>
                                {formatCurrency(
                                  quotation.tax
                                )}
                              </strong>
                            </span>

                            <span>
                              <span className="text-slate-500">
                                Shipping:
                              </span>{" "}
                              <strong>
                                {formatCurrency(
                                  quotation.shipping
                                )}
                              </strong>
                            </span>
                          </div>

                          {/* NOTES */}

                          {quotation.notes && (
                            <div className="mt-5 p-4 rounded-xl bg-blue-50">
                              <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                Supplier Notes
                              </p>

                              <p className="text-sm text-slate-700 mt-1">
                                {quotation.notes}
                              </p>
                            </div>
                          )}

                          {/* ACTIONS */}

                          {currentRFQ.status ===
                            "OPEN" &&
                            isPending && (
                              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <button
                                  onClick={() =>
                                    handleAccept(
                                      quotation.id
                                    )
                                  }
                                  disabled={
                                    actionLoading !==
                                    ""
                                  }
                                  className="flex-1 px-5 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {actionLoading ===
                                  quotation.id
                                    ? "Processing..."
                                    : "✓ Accept Quotation"}
                                </button>

                                <button
                                  onClick={() =>
                                    handleReject(
                                      quotation.id
                                    )
                                  }
                                  disabled={
                                    actionLoading !==
                                    ""
                                  }
                                  className="px-5 py-3 rounded-xl border border-red-300 text-red-600 font-bold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  Reject
                                </button>
                              </div>
                            )}

                          {isAccepted && (
                            <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200">
                              <p className="font-bold text-green-700">
                                ✓ This quotation was accepted
                              </p>

                              <p className="text-sm text-green-600 mt-1">
                                The RFQ has been closed and this supplier was selected.
                              </p>
                            </div>
                          )}

                          {isRejected && (
                            <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200">
                              <p className="font-bold text-red-700">
                                Quotation rejected
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default BuyerQuotations;