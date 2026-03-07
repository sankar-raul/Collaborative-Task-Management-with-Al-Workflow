export interface Task {
    _id: string;
    title: string;
    description?: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    requiredSkills: string[];
    assignedTo?: string;
    projectId: string;
    status: "To Do" | "Assigned" | "In Progress" | "In Review" | "Completed";
    deadline?: string;
    createdAt?: string;
    updatedAt?: string;
}