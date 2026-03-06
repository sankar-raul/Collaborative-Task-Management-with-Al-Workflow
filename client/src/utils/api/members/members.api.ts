import { get } from "../apiMethod";

export interface Member {
    _id: string;
    name: string;
    email: string;
    role: string;
    skills: string[];
    availabilityHours: number;
    currentWorkload: number;
    createdAt: string;
}

export interface PaginationData {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
}

export interface GetAllMembersResponse {
    success: boolean;
    data: Member[];
    pagination: PaginationData;
    message?: string;
}

const ROUTE = 'members';

export const getAllMembers = async (page: number = 1, limit: number = 10): Promise<GetAllMembersResponse> => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('No access token found');
    }

    // get(endpoint, filter/params, token)
    return await get(`${ROUTE}/all`, { page, limit }, token);
};
