import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/authContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { member } = useAuth();

  if (!member) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;