import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userString);

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role)
    ) {
      if (user.role === "BUYER") {
        return <Navigate to="/buyer-dashboard" replace />;
      }

      if (user.role === "SUPPLIER") {
        return <Navigate to="/supplier-marketplace" replace />;
      }

      return <Navigate to="/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;