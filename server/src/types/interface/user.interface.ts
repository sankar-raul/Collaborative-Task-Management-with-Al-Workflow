import { ROLE } from "@/constants/role.constant";
import { Types } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: typeof ROLE[keyof typeof ROLE];
  skills: string[];
  availabilityHours: number;
  currentWorkload: number;
  isApproved?: boolean;
  stacks?: Types.ObjectId[];
}