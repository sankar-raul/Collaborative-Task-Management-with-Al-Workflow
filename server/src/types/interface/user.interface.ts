import { ROLE } from "@/constants/role.constant";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: typeof ROLE[keyof typeof ROLE];
  skills: string[];
  availabilityHours: number;
  currentWorkload: number;
  isApproved?: boolean;
}