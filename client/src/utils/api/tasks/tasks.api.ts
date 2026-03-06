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
}) => {
    return await post(`${ROUTE}`, taskData, getToken());
};

/* ---------------- GET ALL TASKS ---------------- */

export const getAllTasks = async (): Promise<{
    success: boolean;
    data: Task[];
}> => {
    return await get(`${ROUTE}/get-all`, undefined, getToken());
};

/* ---------------- GET TASK BY ID ---------------- */

export const getTaskById = async (
    id: string
): Promise<{ success: boolean; data: Task }> => {
    return await get(`${ROUTE}/${id}`, undefined, getToken());
};

/* ---------------- GET TASKS BY PROJECT ---------------- */

export const getTasksByProject = async (
    projectId: string
): Promise<{ success: boolean; data: Task[] }> => {
    return await get(`${ROUTE}/project/${projectId}`, undefined, getToken());
};

/* ---------------- GET TASKS BY USER ---------------- */

export const getTasksByUser = async (
    userId: string
): Promise<{ success: boolean; data: Task[] }> => {
    return await get(`${ROUTE}/user/${userId}`, undefined, getToken());
};

/* ---------------- UPDATE TASK ---------------- */

export const updateTask = async (
    id: string,
    taskData: Partial<Task>
): Promise<{ success: boolean; data: Task }> => {
    return await put(`${ROUTE}/${id}`, taskData, getToken());
};

/* ---------------- DELETE TASK ---------------- */

export const deleteTask = async (
    id: string
): Promise<{ success: boolean; message: string }> => {
    return await deleteRequest(`${ROUTE}/${id}`, getToken());
};

/* ---------------- CHANGE TASK STATUS ---------------- */

export const changeTaskStatus = async (
    id: string,
    status: Task["status"]
): Promise<{ success: boolean; data: Task }> => {
    return await put(`${ROUTE}/${id}/status`, { status }, getToken());
};

/* ---------------- ASSIGN TASK ---------------- */

export const assignTask = async (
    id: string,
    userId: string
): Promise<{ success: boolean; data: Task }> => {
    return await put(`${ROUTE}/${id}/assign`, { userId }, getToken());
};

/* ---------------- OVERDUE TASKS (ADMIN) ---------------- */

export const getOverdueTasks = async (): Promise<{
    success: boolean;
    data: Task[];
}> => {
    return await get(`${ROUTE}/overdue`, undefined, getToken());
};