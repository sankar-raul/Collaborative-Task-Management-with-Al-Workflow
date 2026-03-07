import { createContext, useContext } from "react";
import type { IAuthContextType } from "../../@types/interface/userInterface";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};