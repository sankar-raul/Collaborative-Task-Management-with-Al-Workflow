import { IProjectMember } from "./projectMember.interface";

export interface IProject {
  projectName: string;
  description?: string;
  members: IProjectMember[];
  deadline?: string;
  _id?: string;
  eastimatedTime?: number; // in hours
}