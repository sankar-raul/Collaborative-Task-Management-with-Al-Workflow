export interface IMemeber {
  email: string;
  role: "admin" | "manager" | "developer";
}

export interface IAuthContextType {
  member: IMemeber | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}