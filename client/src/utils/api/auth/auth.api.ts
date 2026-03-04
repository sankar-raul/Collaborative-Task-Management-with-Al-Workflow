import { get, post } from "../apiMethod";

interface MeResponse {
    id: string;
    email: string;
    name: string;
    roll: string;
}
interface ErrorResponse {
    error: string;
}
const ROUTE = 'auth';
export const me = async (): Promise<MeResponse | ErrorResponse> => {
    const token = localStorage.getItem('access_token');
    if (!token) {
        return { error: 'No access token found' } as ErrorResponse;
    }
    try {
        const response = await get(`${ROUTE}/me`, {}, token);
        return response as MeResponse;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return { error: 'Failed to fetch user info' } as ErrorResponse;
    }
}

export const login = async (payload: any) => {
    return await post(`${ROUTE}/login`, payload);
};

export const register = async (payload: any) => {
    return await post(`${ROUTE}/register`, payload);
};