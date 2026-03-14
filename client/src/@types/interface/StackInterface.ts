export interface TechStack {
    _id: string;
    name: string;
    skills: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface GetAllStacksResponse {
    success: boolean;
    data: TechStack[];
}

export interface StackResponse {
    success: boolean;
    data: TechStack;
}
