import type { GetProjectsResponse, Project } from "../../../@types/interface/ProjectInterface";
import { getToken } from "../GetToken";
import { get, post, deleteRequest } from "../apiMethod";
const ROUTE = 'projects';

export const getProjects = async (page: number = 1, limit: number = 10): Promise<GetProjectsResponse> => {
    return await get(`${ROUTE}`, { page, limit }, getToken());
};

export const createProject = async (projectData: { projectName: string; description?: string; members?: { user: string; role: string }[] }): Promise<{ success: boolean; data: Project; message: string }> => {
    return await post(`${ROUTE}`, projectData, getToken());
};

export const getProjectById = async (id: string): Promise<{ success: boolean; data: Project; message?: string }> => {
    return await get(`${ROUTE}/${id}`, undefined, getToken());
};

export const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
    return await deleteRequest(`${ROUTE}/${id}`, getToken());
};
