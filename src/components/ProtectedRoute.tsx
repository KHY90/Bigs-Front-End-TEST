import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAccessToken } from "../utils/auth";

const ProtectedRoute: React.FC = () => {
  const isAuthenticated = !!getAccessToken();

  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
