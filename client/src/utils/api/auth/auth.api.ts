import { get, post } from "../apiMethod";
import { getToken } from "../GetToken";

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
    try {
        const response = await get(`${ROUTE}/me`, {}, getToken());
        return response as MeResponse;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        if (error instanceof Error && error.message === "No access token found") {
            return { error: 'No access token found' } as ErrorResponse;
        }
        return { error: 'Failed to fetch user info' } as ErrorResponse;
    }
}

export const login = async (payload: any) => {
    return await post(`${ROUTE}/login`, payload);
};

export const register = async (payload: any) => {
    return await post(`${ROUTE}/register`, payload);
};