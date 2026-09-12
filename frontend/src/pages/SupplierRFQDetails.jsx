import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function SupplierRFQDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [quotation, setQuotation] = useState({
    unitPrice: "",
    deliveryDays: "",
    validityDays: "30",
    tax: "",
    shipping: "",
    notes: "",
  });

  useEffect(() => {
    fetchRFQ();
  }, [id]);

  const fetchRFQ = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5050/api/rfqs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load RFQ");
      }

      setRfq(data.rfq);
    } catch (err) {
      console.error("RFQ LOAD ERROR:", err);
      setError(err.message || "Unable to load RFQ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setQuotation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading RFQ...
          </p>
        </div>
      </div>
    );
  }

  if (error || !rfq) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
            !
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to load RFQ
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error || "The requested RFQ could not be found."}
          </p>

          <button
            onClick={() => navigate("/supplier-marketplace")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const quantity = Number(rfq.quantity) || 0;
  const unitPrice = Number(quotation.unitPrice) || 0;
  const subtotal = unitPrice * quantity;

  const taxAmount =
    subtotal * ((Number(quotation.tax) || 0) / 100);

  const shipping = Number(quotation.shipping) || 0;

  const total = subtotal + taxAmount + shipping;

  const deliveryDate = rfq.deliveryDate
    ? new Date(rfq.deliveryDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not specified";

  const createdDate = rfq.createdAt
    ? new Date(rfq.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const buyerName =
    rfq.buyer?.companyName ||
    rfq.buyer?.name ||
    "Buyer";

  const buyerInitials = buyerName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quotation.unitPrice || Number(quotation.unitPrice) <= 0) {
      alert("Please enter a valid unit price.");
      return;
    }

    if (
      !quotation.deliveryDays ||
      Number(quotation.deliveryDays) <= 0
    ) {
      alert("Please enter a valid delivery time.");
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5050/api/quotations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rfqId: rfq.id,
            unitPrice: Number(quotation.unitPrice),
            deliveryDays: Number(quotation.deliveryDays),
            validityDays: Number(quotation.validityDays) || 30,
            tax: Number(quotation.tax) || 0,
            shipping: Number(quotation.shipping) || 0,
            notes: quotation.notes,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to submit quotation"
        );
      }

      setSubmitted(true);
    } catch (err) {
      console.error("QUOTATION ERROR:", err);
      alert(err.message || "Unable to submit quotation");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-6 py-6">
              <Link to="/">
                <h1 className="text-2xl font-bold text-blue-600">
                  RFQ<span className="text-slate-900">Market</span>
                </h1>

                <p className="mt-1 text-xs text-slate-500">
                  B2B Procurement Marketplace
                </p>
              </Link>
            </div>

            <nav className="flex-1 px-4 py-6">
              <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Supplier Portal
              </p>

              <Link
                to="/supplier-marketplace"
                className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
              >
                <span>◈</span>
                Browse RFQs
              </Link>

              <Link
                to="/supplier-marketplace"
                className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <span>▤</span>
                My Quotations
              </Link>
            </nav>

            <div className="border-t border-slate-100 p-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                  {buyerInitials}
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Supplier Account
                  </p>

                  <p className="text-xs text-slate-500">
                    Supplier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-h-screen items-center justify-center px-6 lg:ml-64">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Quotation Submitted!
            </h1>

            <p className="mt-3 text-slate-500">
              Your quotation for{" "}
              <span className="font-semibold text-slate-700">
                {rfq.title}
              </span>{" "}
              has been successfully submitted to the buyer.
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
              <div className="flex justify-between border-b border-slate-200 pb-3">
                <span className="text-sm text-slate-500">
                  RFQ
                </span>

                <span className="font-semibold text-slate-800">
                  {rfq.id}
                </span>
              </div>

              <div className="flex justify-between pt-3">
                <span className="text-sm text-slate-500">
                  Quotation Value
                </span>

                <span className="font-bold text-blue-600">
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() =>
                  navigate("/supplier-marketplace")
                }
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Browse More RFQs
              </button>

              <button
                onClick={() => navigate("/supplier-marketplace")}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                My Quotations
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-100 px-6 py-6">
            <Link to="/">
              <h1 className="text-2xl font-bold text-blue-600">
                RFQ<span className="text-slate-900">Market</span>
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                B2B Procurement Marketplace
              </p>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Supplier Portal
            </p>

            <Link
              to="/supplier-marketplace"
              className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
            >
              <span>◈</span>
              Browse RFQs
            </Link>

            <Link
              to="/supplier-marketplace"
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            >
              <span>▤</span>
              My Quotations
            </Link>

            <Link
              to="/supplier-marketplace"
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            >
              <span>◉</span>
              Buyers
            </Link>

            <Link
              to="/supplier-marketplace"
              className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
            >
              <span>⚙</span>
              Settings
            </Link>
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                S
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  Supplier Account
                </p>

                <p className="text-xs text-slate-500">
                  Supplier
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:ml-64">
        <header className="border-b border-slate-200 bg-white px-6 py-5 md:px-8">
          <Link
            to="/supplier-marketplace"
            className="text-sm font-medium text-slate-500 hover:text-blue-600"
          >
            ← Back to RFQ Marketplace
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                  {rfq.id}
                </span>

                <span className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                  ● {rfq.status || "OPEN"}
                </span>

                {rfq.category && (
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {rfq.category}
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-bold text-slate-900">
                {rfq.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Posted by{" "}
                <span className="font-semibold text-slate-700">
                  {buyerName}
                </span>
              </p>
            </div>

            <div className="rounded-2xl bg-amber-50 px-5 py-4">
              <p className="text-xs font-medium text-amber-700">
                RFQ Posted
              </p>

              <p className="mt-1 font-bold text-amber-900">
                {createdDate || "Recently"}
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-6 lg:col-span-2">
              {/* Requirement */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Requirement
                </h2>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {rfq.description}
                </p>
              </section>

              {/* Specifications */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  RFQ Details
                </h2>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Category
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {rfq.category || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {quantity.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Delivery Location
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {rfq.location || "Not specified"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-400">
                      Required By
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {deliveryDate}
                    </p>
                  </div>
                </div>
              </section>

              {/* Quotation */}
              <section
                id="quotation-form"
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Submit Your Quotation
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Provide your best commercial offer to the buyer.
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    Supplier Response
                  </span>
                </div>

                {!showQuotationForm ? (
                  <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">
                          Ready to win this order?
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          Submit your pricing, delivery time and terms.
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setShowQuotationForm(true)
                        }
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                      >
                        Start Quotation
                      </button>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="mt-6 space-y-5"
                  >
                    <div className="grid gap-5 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-semibold text-slate-700">
                          Unit Price *
                        </label>

                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="unitPrice"
                            value={quotation.unitPrice}
                            onChange={handleChange}
                            placeholder="Enter price per unit"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-700">
                          Delivery Time *
                        </label>

                        <div className="relative mt-2">
                          <input
                            type="number"
                            min="1"
                            name="deliveryDays"
                            value={quotation.deliveryDays}
                            onChange={handleChange}
                            placeholder="Number of days"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            days
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-700">
                          Quotation Validity
                        </label>

                        <div className="relative mt-2">
                          <input
                            type="number"
                            min="1"
                            name="validityDays"
                            value={quotation.validityDays}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            days
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-slate-700">
                          Tax
                        </label>

                        <div className="relative mt-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="tax"
                            value={quotation.tax}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                            %
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Shipping / Additional Charges
                        </label>

                        <div className="relative mt-2">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            ₹
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            name="shipping"
                            value={quotation.shipping}
                            onChange={handleChange}
                            placeholder="0"
                            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700">
                          Message to Buyer
                        </label>

                        <textarea
                          name="notes"
                          value={quotation.notes}
                          onChange={handleChange}
                          rows="4"
                          placeholder="Add product details, warranty information, payment terms, certifications, etc."
                          className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <h3 className="font-bold text-slate-800">
                        Quotation Summary
                      </h3>

                      <div className="mt-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Quantity
                          </span>

                          <span className="font-medium text-slate-800">
                            {quantity.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Unit Price
                          </span>

                          <span className="font-medium text-slate-800">
                            ₹{unitPrice.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Subtotal
                          </span>

                          <span className="font-medium text-slate-800">
                            ₹{subtotal.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Tax
                          </span>

                          <span className="font-medium text-slate-800">
                            ₹{taxAmount.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            Shipping
                          </span>

                          <span className="font-medium text-slate-800">
                            ₹{shipping.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <div className="border-t border-slate-200 pt-3">
                          <div className="flex justify-between">
                            <span className="font-bold text-slate-900">
                              Total Quotation
                            </span>

                            <span className="text-xl font-bold text-blue-600">
                              ₹{total.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          setShowQuotationForm(false)
                        }
                        className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {submitting
                          ? "Submitting..."
                          : "Submit Quotation"}
                      </button>
                    </div>
                  </form>
                )}
              </section>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Buyer */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  Buyer Information
                </h2>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-lg font-bold text-blue-600">
                    {buyerInitials}
                  </div>

                  <div>
                    <p className="font-bold text-slate-900">
                      {buyerName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Buyer
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    ✓ Buyer on RFQMarket
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-600">
                    This buyer has published an RFQ on the marketplace.
                  </p>
                </div>
              </section>

              {/* RFQ Summary */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  RFQ Summary
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Quantity
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {quantity.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Target Budget
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {rfq.budget
                        ? `₹${Number(rfq.budget).toLocaleString(
                            "en-IN"
                          )}`
                        : "Not specified"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Delivery Location
                    </span>

                    <span className="text-right text-sm font-semibold text-slate-800">
                      {rfq.location || "Not specified"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Required By
                    </span>

                    <span className="text-sm font-semibold text-slate-800">
                      {deliveryDate}
                    </span>
                  </div>
                </div>
              </section>

              {/* Activity */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">
                  RFQ Status
                </h2>

                <div className="mt-5 rounded-xl bg-emerald-50 p-4">
                  <p className="text-sm font-semibold text-emerald-700">
                    ● {rfq.status || "OPEN"}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-emerald-600">
                    This RFQ is currently accepting supplier quotations.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SupplierRFQDetails;