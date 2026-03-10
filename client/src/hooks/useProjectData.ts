import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import type { Project } from "../@types/interface/ProjectInterface";
import type { Task } from "../@types/interface/TasksInterface";

interface UseProjectDataProps {
    projectId: string | undefined;
}

export const useProjectData = ({ projectId }: UseProjectDataProps) => {
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProjectAndTasks = useCallback(async () => {
        if (!projectId) return;
        try {
            const [projectRes, tasksRes] = await Promise.all([
                api.projects.getProjectById(projectId),
                api.tasks.getTasksByProject(projectId)
            ]);
            if (projectRes.success) setProject(projectRes.data);
            if (tasksRes.success) setTasks(tasksRes.data);
        } catch (err: any) {
            setError(err.message || "Failed to load project data");
        }
    }, [projectId]);

    useEffect(() => {
        const initialFetch = async () => {
            setLoading(true);
            await fetchProjectAndTasks();
            setLoading(false);
        };
        initialFetch();
    }, [fetchProjectAndTasks]);

    const handleAddMember = async (userId: string, role: string) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.addProjectMember(projectId, { userId, role });
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.removeProjectMember(projectId, userId);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateMemberRole = async (userId: string, role: string) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.updateProjectMemberRole(projectId, { userId, role });
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateProject = async (projectData: any) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.updateProject(projectId, projectData);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.deleteProject(projectId);
            if (res.success) {
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateTask = async (taskData: any) => {
        if (!projectId) return;
        console.log("creating")
        try {
            setActionLoading(true);
            const res = await api.tasks.createTask({ ...taskData, projectId });
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateTask = async (taskId: string, taskData: any) => {
        try {
            setActionLoading(true);
            const res = await api.tasks.updateTask(taskId, taskData);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            setActionLoading(true);
            const res = await api.tasks.deleteTask(taskId);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as any)?.message || "Internal error" };
        } catch (err: any) {
            return { success: false, message: err.message };
        } finally {
            setActionLoading(false);
        }
    };

    return {
        project,
        tasks,
        loading,
        error,
        actionLoading,
        handleAddMember,
        handleRemoveMember,
        handleUpdateMemberRole,
        handleUpdateProject,
        handleDeleteProject,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask,
        refresh: fetchProjectAndTasks
    };
};
