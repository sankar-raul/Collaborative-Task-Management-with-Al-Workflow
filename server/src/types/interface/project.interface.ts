import { Types } from "mongoose";
import { ROLE } from "@/constants/role.constant";
export interface IProjectMember {
  user: Types.ObjectId;
  role: typeof ROLE[keyof typeof ROLE];
}
export interface IProject {
  projectName: string;
  description?: string;
  members: IProjectMember[];
}