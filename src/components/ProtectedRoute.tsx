import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../stores/authStore";

const ProtectedRoute: React.FC = observer(() => {
  return authStore.isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
});

export default ProtectedRoute;
