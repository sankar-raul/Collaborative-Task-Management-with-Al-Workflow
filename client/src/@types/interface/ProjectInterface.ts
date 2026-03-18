import type { IUser } from "./userInterface";

export interface Project {
    _id: string;
    projectName: string;
    description: string;
    status: string;
    members: any[];
    createdBy: any;
    createdAt: string;
    updatedAt: string;
    deadline?: string;
}

export interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export interface GetProjectsResponse {
    success: boolean;
    data: Project[];
    pagination: PaginationData;
}

export interface IProjectMember {
  user: IUser | string; // string if not populated
  role: string;
}

export interface IProjectMembersResponse {
  success: boolean;
  data: IProjectMember[];
  message?: string;
}