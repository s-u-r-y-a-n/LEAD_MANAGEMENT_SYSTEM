import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth/useAuth.js";

export const ProtectedRoutes = ({ allowedRoles = [] }) => {
  const { accessToken, user } = useAuth();
  const location = useLocation();
  const [checkedAt] = useState(() => Date.now());
  const isExpired = !user?.exp || user.exp * 1000 <= checkedAt;

  if (!accessToken || !user || isExpired) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/home/leads" replace />;
  }

  return <Outlet />;
};
