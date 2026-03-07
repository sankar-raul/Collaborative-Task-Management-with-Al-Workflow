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
