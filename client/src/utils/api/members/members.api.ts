import { get, put, patch, deleteRequest } from "../apiMethod";
import { getToken } from "../GetToken";
import type { GetAllMembersResponse, Member } from "../../../@types/interface/MembersInterface";
import type { Project } from "../../../@types/interface/ProjectInterface";
const ROUTE = 'members';


export const getAllMembers = async (page: number = 1, limit: number = 10): Promise<GetAllMembersResponse> => {
    // get(endpoint, filter/params, token)
    return await get(`${ROUTE}/all`, { page, limit }, getToken());
};

export const getMemberById = async (id: string): Promise<{ success: boolean; data: Member }> => {
    return await get(`${ROUTE}/${id}`, {}, getToken());
};

export const getAssignedProjects = async (): Promise<{ success: boolean; data: Project[]; total: number }> => {
    return await get(`${ROUTE}/projects`, {}, getToken());
};

export const searchMembers = async (q: string = "", page: number = 1, limit: number = 100): Promise<GetAllMembersResponse> => {
    return await get(`${ROUTE}/search`, { q, page, limit }, getToken());
};

export const updateMe = async (data: Partial<Omit<Member, "_id" | "role" | "createdAt" | "currentWorkload">>): Promise<{ success: boolean; data: Member }> => {
    return await put(`${ROUTE}/me`, data, getToken());
};

export const approveMember = async (id: string): Promise<{ success: boolean; data: Member }> => {
    return await patch(`${ROUTE}/${id}/approve`, {}, getToken());
};

export const rejectMember = async (id: string): Promise<{ success: boolean; data: Member }> => {
    return await deleteRequest(`${ROUTE}/${id}/reject`, getToken());
};
