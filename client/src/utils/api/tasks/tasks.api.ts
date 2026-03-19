import type { Member } from "@/@types/interface/MembersInterface";
import type { Task } from "../../../@types/interface/TasksInterface";
import { get, post, put, deleteRequest } from "../apiMethod";
import { getToken } from "../GetToken";


const ROUTE = "tasks";


export const createTask = async (taskData: {
    title: string;
    description?: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    requiredSkills: string[];
    projectId: string;
    assignedTo?: string;
    deadline?: string;
    status: "To Do" | "Assigned" | "In Progress" | "In Review" | "Completed";
    eastimatedTime?: number;
}): Promise<{ success: boolean; data: Task }> => {
    return await post<{ success: boolean; data: Task }>(`${ROUTE}`, taskData, getToken());
};

export const getRanking = async (projectId: string, query: {
    priority?: string;
    requiredSkills?: string[];
    eastimatedTime?: number;
}): Promise<{
    success: boolean;
    data: {
        user: Member;
        score: number;
        totalTasks: number;
        totalEstimatedTime: number;
    }[];
}> => {
    return await get<{
        success: boolean;
        data: {
            user: Member;
            score: number;
            totalTasks: number;
            totalEstimatedTime: number;
        }[];
    }>(`${ROUTE}/${projectId}/ranking`, {
        ...query,
        requiredSkills: query.requiredSkills ? query.requiredSkills.join(",") : undefined
    }, getToken());
};

/* ---------------- GET ALL TASKS ---------------- */

export const getAllTasks = async (): Promise<{
    success: boolean;
    data: Task[];
}> => {
    return await get<{
        success: boolean;
        data: Task[];
    }>(`${ROUTE}/get-all`, undefined, getToken());
};

/* ---------------- GET TASK BY ID ---------------- */

export const getTaskById = async (
    id: string
): Promise<{ success: boolean; data: Task }> => {
    return await get<{ success: boolean; data: Task }>(`${ROUTE}/${id}`, undefined, getToken());
};

/* ---------------- GET TASKS BY PROJECT ---------------- */

export const getTasksByProject = async (
    projectId: string
): Promise<{ success: boolean; data: Task[] }> => {
    return await get<{ success: boolean; data: Task[] }>(`${ROUTE}/project/${projectId}`, undefined, getToken());
};

/* ---------------- GET TASKS BY USER ---------------- */

export const getTasksByUser = async (
    userId: string
): Promise<{ success: boolean; data: Task[] }> => {
    return await get<{ success: boolean; data: Task[] }>(`${ROUTE}/user/${userId}`, undefined, getToken());
};

/* ---------------- UPDATE TASK ---------------- */

export const updateTask = async (
    id: string,
    taskData: Partial<Task>
): Promise<{ success: boolean; data: Task }> => {
    return await put<{ success: boolean; data: Task }>(`${ROUTE}/${id}`, taskData, getToken());
};

/* ---------------- DELETE TASK ---------------- */

export const deleteTask = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    return await deleteRequest<{ success: boolean; message: string }>(`${ROUTE}/${id}`, getToken());
};

/* ---------------- CHANGE TASK STATUS ---------------- */

export const changeTaskStatus = async (
    id: string,
    status: Task["status"]
): Promise<{ success: boolean; data: Task }> => {
    return await put<{ success: boolean; data: Task }>(`${ROUTE}/${id}/status`, { status }, getToken());
};

/* ---------------- ASSIGN TASK ---------------- */

export const assignTask = async (
    id: string,
    userId: string
): Promise<{ success: boolean; data: Task }> => {
    return await put<{ success: boolean; data: Task }>(`${ROUTE}/${id}/assign`, { userId }, getToken());
};

/* ---------------- OVERDUE TASKS (ADMIN) ---------------- */

export const getOverdueTasks = async (): Promise<{
    success: boolean;
    data: Task[];
}> => {
    return await get<{ success: boolean; data: Task[] }>(`${ROUTE}/overdue`, undefined, getToken());
};