import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { IAuthContextType, IMemeber } from "../@types/interface/userInterface";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [member, setMember] = useState<IMemeber | null>(null);

  const login = (email: string, password: string) => {
    console.log("Login:", email, password);
    // Mock simple role assignment for demo purposes:
    const role: "admin" | "manager" | "developer" = "manager";

    setMember({ email, role });
  };

  const logout = () => {
    setMember(null);
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