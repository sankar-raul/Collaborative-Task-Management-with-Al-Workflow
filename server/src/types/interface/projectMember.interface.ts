import { ROLE } from "@/constants/role.constant";
import { Types } from "mongoose";

export interface IProjectMember {
  user: Types.ObjectId;
  role: typeof ROLE[keyof typeof ROLE];
}