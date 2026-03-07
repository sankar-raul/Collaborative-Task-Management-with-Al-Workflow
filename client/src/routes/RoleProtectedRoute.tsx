import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/auth";

interface RoleProtectedRouteProps {
    children: ReactNode;
    allowedRoles: ("Admin" | "Manager" | "User")[];
}

const RoleProtectedRoute = ({ children, allowedRoles }: RoleProtectedRouteProps) => {
    const { member } = useAuth();

    if (!member) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(member.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default RoleProtectedRoute;
