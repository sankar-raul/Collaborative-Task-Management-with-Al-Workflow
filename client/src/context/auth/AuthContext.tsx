// import { api } from "@/utils/api";
import {
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { AuthContext } from "./useAuth";
import { api } from "../../utils/api";

export interface IAuthContextType {
  user: {
    id: string;
    email: string;
    name: string;
    roll: string;
  } | null;
  error: string | null;
  setUser: (user: IAuthContextType["user"]) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IAuthContextType["user"]>(null);
    const [error, setError] = useState<string | null>(null);
    const [  isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
        try {
            setIsLoading(true);
      const me = await api.auth.me();
        if ("error" in me) {
            setError(me.error);
            setUser(null);
        } else {
            setUser(me as IAuthContextType["user"]);
            setError(null);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError("Failed to fetch user data.");
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    })();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, isLoading, isAuthenticated: !!user, error }}>
      {children}
    </AuthContext.Provider>
  );
};
