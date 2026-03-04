export interface IMemeber {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "developer" | "User";
}

export interface IAuthContextType {
  member: IMemeber | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}