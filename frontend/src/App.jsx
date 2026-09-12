import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Buyer pages
import BuyerDashboard from "./pages/BuyerDashboard";
import CreateRFQ from "./pages/CreateRFQ";
import RFQDetails from "./pages/RFQDetails";
import BuyerQuotations from "./pages/BuyerQuotations";

// Supplier pages
import SupplierMarketplace from "./pages/SupplierMarketplace";
import SupplierRFQDetails from "./pages/SupplierRFQDetails";
import SupplierQuotations from "./pages/SupplierQuotations";

// Route protection
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== PUBLIC ==================== */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ==================== BUYER ==================== */}

        <Route element={<ProtectedRoute allowedRoles={["BUYER"]} />}>
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />

          <Route path="/create-rfq" element={<CreateRFQ />} />

          <Route path="/rfq/:id" element={<RFQDetails />} />

          <Route
            path="/buyer-quotations"
            element={<BuyerQuotations />}
          />
        </Route>

        {/* ==================== SUPPLIER ==================== */}

        <Route element={<ProtectedRoute allowedRoles={["SUPPLIER"]} />}>
          <Route
            path="/supplier-marketplace"
            element={<SupplierMarketplace />}
          />

          <Route
            path="/supplier-rfq/:id"
            element={<SupplierRFQDetails />}
          />

          <Route
            path="/supplier-quotations"
            element={<SupplierQuotations />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;