import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { member } = useAuth();
  const token = localStorage.getItem("access_token");

  if (!member && !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;