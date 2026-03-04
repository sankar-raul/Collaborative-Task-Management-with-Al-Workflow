import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { IAuthContextType, IMemeber } from "../@types/interface/userInterface";
import { login as loginApi } from "../utils/api/auth/auth.api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<IMemeber | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await loginApi({ email, password });
      if (response && response.success) {
        const token = response.auth.access_token;
        localStorage.setItem("access_token", token);

        // Decode token to get role explicitly set by server
        const decoded: any = jwtDecode(token);
        console.log("Decoded Token Data:", decoded); // See the server data in console
        const role = decoded.role || "User";

        const newMember = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role
        };

        console.log("Logged in user member data:", newMember);

        setMember(newMember);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setMember(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ member, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};