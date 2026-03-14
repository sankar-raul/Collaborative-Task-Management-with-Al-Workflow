import { get, post, patch, deleteRequest } from "../apiMethod";
import { getToken } from "../GetToken";
import type { GetAllStacksResponse, StackResponse, TechStack } from "../../../@types/interface/StackInterface";

const ROUTE = 'techstacks';

export const getAllStacks = async (): Promise<GetAllStacksResponse> => {
    return await get(`${ROUTE}/`, {}, getToken());
};

export const createStack = async (data: Omit<TechStack, "_id">): Promise<StackResponse> => {
    return await post(`${ROUTE}/`, data, getToken());
};

export const updateStack = async (id: string, data: Partial<TechStack>): Promise<StackResponse> => {
    return await patch(`${ROUTE}/${id}`, data, getToken());
};

export const deleteStack = async (id: string): Promise<{ success: boolean; message: string }> => {
    return await deleteRequest(`${ROUTE}/${id}`, getToken());
};
