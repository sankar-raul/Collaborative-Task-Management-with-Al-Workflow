export interface IMemeber {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "User";
}

export interface IAuthContextType {
  member: IMemeber | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}