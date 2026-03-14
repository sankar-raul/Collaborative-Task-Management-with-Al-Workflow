export interface TaskAssignee {
    _id: string;
    name: string;
    email?: string;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    requiredSkills: string[];
    assignedTo?: string | TaskAssignee | null;
    projectId: string;
    status: "To Do" | "Assigned" | "In Progress" | "In Review" | "Completed";
    deadline?: string;
    eastimatedTime?: number; // in hours
    createdAt?: string;
    updatedAt?: string;
}