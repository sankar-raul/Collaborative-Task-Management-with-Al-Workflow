import { get } from "../apiMethod";
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
