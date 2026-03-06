import { createContext, useState, type ReactNode } from "react";
import type { IAuthContextType, IMemeber } from "../../@types/interface/userInterface";
import { api } from "../../utils/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<IMemeber | null>(() => {
    const savedMember = localStorage.getItem("userMember");
    return savedMember ? JSON.parse(savedMember) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      if (response && response.success) {
        const token = response.auth.access_token;
        localStorage.setItem("access_token", token);

        const decoded: any = jwtDecode(token);
        console.log("Decoded Token Data:", decoded);
        const role = decoded.role || "User";

        const newMember = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role
        };

        console.log("Logged in user member data:", newMember);

        localStorage.setItem("userMember", JSON.stringify(newMember));
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
    localStorage.removeItem("userMember");
    setMember(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ member, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
