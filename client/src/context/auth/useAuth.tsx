import { createContext, useContext } from "react";
import type { IAuthContextType } from "./AuthContext";

export const AuthContext = createContext<IAuthContextType | undefined>(undefined);

const useAuth = () => {
  const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
export default useAuth;