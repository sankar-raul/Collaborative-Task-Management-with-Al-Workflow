import type { GetProjectsResponse, Project, IProjectMember } from "../../../@types/interface/ProjectInterface";
import { getToken } from "../GetToken";
import { get, post, deleteRequest, put } from "../apiMethod";
const ROUTE = 'projects';

export const getProjects = async (page: number = 1, limit: number = 10): Promise<GetProjectsResponse> => {
    return await get<GetProjectsResponse>(`${ROUTE}`, { page, limit }, getToken());
};

export const createProject = async (projectData: { 
    projectName: string; 
    description?: string; 
    members?: { user: string; role: string }[];
    deadline?: string;
    techStackId?: string;
}): Promise<{ success: boolean; data: Project; message: string }> => {
    return await post<{ success: boolean; data: Project; message: string }>(`${ROUTE}`, projectData, getToken());
};

export const uploadPdf = async (file: File): Promise<{ success: boolean; parsedText: string; message?: string }> => {
    const formData = new FormData();
    formData.append("pdf", file);
    return await post<{ success: boolean; parsedText: string; message?: string }>(`${ROUTE}/pdfupload`, formData, getToken());
};

export const getProjectById = async (id: string): Promise<{ success: boolean; data: Project; message?: string }> => {
    return await get<{ success: boolean; data: Project; message?: string }>(`${ROUTE}/${id}`, undefined, getToken());
};

export const deleteProject = async (id: string): Promise<{ success: boolean; message: string }> => {
    return await deleteRequest<{ success: boolean; message: string }>(`${ROUTE}/${id}`, getToken());
};

export const updateProject = async (id: string, projectData: { projectName?: string; description?: string; status?: string }): Promise<{ success: boolean; data: Project; message: string }> => {
    return await put<{ success: boolean; data: Project; message: string }>(`${ROUTE}/${id}`, projectData, getToken());
};

export const addProjectMember = async (id: string, memberData: { userId: string; role: string }): Promise<{ success: boolean; message: string }> => {
    return await post<{ success: boolean; message: string }>(`${ROUTE}/${id}/members`, memberData, getToken());
};

export const removeProjectMember = async (id: string, userId: string): Promise<{ success: boolean; message: string }> => {
    return await deleteRequest<{ success: boolean; message: string }>(`${ROUTE}/${id}/members`, getToken(), { userId });
};

export const updateProjectMemberRole = async (id: string, memberData: { userId: string; role: string }): Promise<{ success: boolean; message: string }> => {
    return await put<{ success: boolean; message: string }>(`${ROUTE}/${id}/members`, memberData, getToken());
};

export const getProjectMembers = async (id: string): Promise<{ success: boolean; data: IProjectMember[]; message?: string }> => {
    return await get<{ success: boolean; data: IProjectMember[]; message?: string }>(`${ROUTE}/${id}/members`, undefined, getToken());
}

export const createProjectByAI = async (data: {
    projectName: string;
    description: string;
    techStackId: string;
    deadline: string;
    members: { user: string; role: string }[];
}): Promise<{ success: boolean; data: Project; message: string }> => {
    return await post<{ success: boolean; data: Project; message: string }>(`${ROUTE}/createByAI`, data, getToken());
};
