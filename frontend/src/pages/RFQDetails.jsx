import React from "react";
import { Link, useParams } from "react-router-dom";

const mockRFQ = {
  id: "RFQ-001",
  title: "Industrial Safety Helmets",
  category: "Safety Equipment",
  status: "Active",
  createdAt: "12 Sep 2026",
  closingDate: "20 Sep 2026",
  deliveryDate: "30 Sep 2026",
  quantity: "500",
  unit: "Pieces",
  targetBudget: "₹2,50,000",
  deliveryLocation: "Hyderabad, Telangana",
  description:
    "We are looking for high-quality industrial safety helmets suitable for construction and manufacturing environments. The helmets should comply with applicable industrial safety standards and be comfortable for long-duration use.",
  specifications: [
    "ISI / BIS certified",
    "Adjustable headband",
    "Impact resistant shell",
    "Ventilation system",
    "Chin strap included",
    "Minimum 2-year product life",
    "Available in multiple sizes",
  ],
};

function RFQDetails() {
  const { id } = useParams();

  const rfq = {
    ...mockRFQ,
    id: id || mockRFQ.id,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-slate-100 px-6 py-6">
            <Link to="/buyer-dashboard">
              <h1 className="text-2xl font-bold text-blue-600">
                RFQ<span className="text-slate-900">Market</span>
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                B2B Procurement Marketplace
              </p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <div className="space-y-2">
              <Link
                to="/buyer-dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <span>▣</span>
                Dashboard
              </Link>

              <Link
                to="/buyer-dashboard"
                className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600"
              >
                <span>▤</span>
                My RFQs
              </Link>

              <Link
                to="/buyer-dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <span>▥</span>
                Quotations
              </Link>

              <Link
                to="/buyer-dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <span>◉</span>
                Suppliers
              </Link>

              <Link
                to="/buyer-dashboard"
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-blue-600"
              >
                <span>⚙</span>
                Settings
              </Link>
            </div>
          </nav>

          {/* User */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                JD
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  John Doe
                </p>
                <p className="truncate text-xs text-slate-500">Buyer</p>
              </div>

              <span className="text-slate-400">⋮</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-5 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Link
                to="/buyer-dashboard"
                className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                ← Back to Dashboard
              </Link>

              <h2 className="text-2xl font-bold text-slate-900">
                RFQ Details
              </h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert("Edit RFQ feature coming next.")}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Edit RFQ
              </button>

              <button
                onClick={() => alert("RFQ has been closed.")}
                className="rounded-xl bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                Close RFQ
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="mx-auto max-w-7xl p-6 md:p-8">
          {/* RFQ Hero */}
          <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm md:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    {rfq.id}
                  </span>

                  <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-100">
                    ● {rfq.status}
                  </span>
                </div>

                <h1 className="text-3xl font-bold md:text-4xl">
                  {rfq.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
                  {rfq.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-6 text-sm">
                  <div>
                    <p className="text-blue-200">Created</p>
                    <p className="mt-1 font-semibold">{rfq.createdAt}</p>
                  </div>

                  <div>
                    <p className="text-blue-200">Closing Date</p>
                    <p className="mt-1 font-semibold">{rfq.closingDate}</p>
                  </div>

                  <div>
                    <p className="text-blue-200">Category</p>
                    <p className="mt-1 font-semibold">{rfq.category}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
                <p className="text-sm text-blue-100">Quotations Received</p>
                <p className="mt-1 text-4xl font-bold">8</p>
                <p className="mt-1 text-xs text-blue-100">
                  From verified suppliers
                </p>
              </div>
            </div>
          </section>

          {/* Summary Cards */}
          <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Quantity</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {rfq.quantity}
              </p>
              <p className="mt-1 text-xs text-slate-400">{rfq.unit}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Target Budget</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {rfq.targetBudget}
              </p>
              <p className="mt-1 text-xs text-slate-400">Estimated budget</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Delivery Location</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {rfq.deliveryLocation}
              </p>
              <p className="mt-1 text-xs text-slate-400">Ship to location</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">Required Delivery</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {rfq.deliveryDate}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Expected delivery date
              </p>
            </div>
          </section>

          {/* Main Grid */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Left */}
            <div className="space-y-6 lg:col-span-2">
              {/* Description */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Requirement Description
                </h3>

                <p className="mt-4 text-sm leading-7 text-slate-600">
                  {rfq.description}
                </p>
              </section>

              {/* Specifications */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Specifications & Requirements
                  </h3>

                  <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    {rfq.specifications.length} requirements
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {rfq.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-600">
                        ✓
                      </div>

                      <p className="text-sm font-medium text-slate-700">
                        {spec}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Attachments */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Attachments
                </h3>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-xl">
                      📄
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Product_Requirements.pdf
                      </p>
                      <p className="text-xs text-slate-500">
                        2.4 MB • PDF
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("Download started")}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Download
                  </button>
                </div>
              </section>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* RFQ Timeline */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  RFQ Timeline
                </h3>

                <div className="mt-6 space-y-6">
                  <div className="relative flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        RFQ Created
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {rfq.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        RFQ Published
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Suppliers can submit quotations
                      </p>
                    </div>
                  </div>

                  <div className="relative flex gap-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                      ⏳
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Quotation Deadline
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {rfq.closingDate}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quotation Summary */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">
                    Quotations
                  </h3>

                  <span className="text-sm font-bold text-blue-600">8</span>
                </div>

                <div className="mt-5 rounded-xl bg-blue-50 p-5">
                  <p className="text-sm text-slate-600">
                    Lowest quotation
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    ₹1,98,500
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Potential saving: ₹51,500
                  </p>
                </div>

                <button
                  onClick={() => alert("Quotation comparison will be added next.")}
                  className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Compare Quotations
                </button>
              </section>

              {/* Supplier Activity */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">
                  Supplier Activity
                </h3>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      RFQ Views
                    </span>
                    <span className="font-bold text-slate-900">34</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Suppliers Interested
                    </span>
                    <span className="font-bold text-slate-900">16</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">
                      Quotations
                    </span>
                    <span className="font-bold text-slate-900">8</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RFQDetails;