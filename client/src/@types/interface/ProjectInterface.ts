
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
