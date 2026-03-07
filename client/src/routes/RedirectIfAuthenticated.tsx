import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/auth";

interface RedirectIfAuthenticatedProps {
    children: ReactNode;
}

const RedirectIfAuthenticated = ({ children }: RedirectIfAuthenticatedProps) => {
    const { member } = useAuth();
    const token = localStorage.getItem("access_token");

    // If the user accesses this route while logged in or has an active token, redirect them away
    if (member || token) {
        return <Navigate to="/" replace />;
    }

    // Otherwise properly render the Login/Register page
    return <>{children}</>;
};

export default RedirectIfAuthenticated;
