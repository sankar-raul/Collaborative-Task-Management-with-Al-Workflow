import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";
import type { Project, IProjectMember } from "../@types/interface/ProjectInterface";
import type { Task } from "../@types/interface/TasksInterface";
import { useProjectSocket } from "./useProjectSocket";

interface UseProjectDataProps {
    projectId: string | undefined;
}

export const useProjectData = ({ projectId }: UseProjectDataProps) => {
    const [project, setProject] = useState<Project | null>(null);
    const [members, setMembers] = useState<IProjectMember[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchProjectAndTasks = useCallback(async () => {
        if (!projectId) return;
        try {
            const [projectRes, tasksRes, membersRes] = await Promise.all([
                api.projects.getProjectById(projectId),
                api.tasks.getTasksByProject(projectId),
                api.projects.getProjectMembers(projectId),
            ]);
            if (projectRes.success) setProject(projectRes.data);
            if (tasksRes.success) setTasks(tasksRes.data);
            if (membersRes.success) {
                const unique = new Map<string, IProjectMember>();
                membersRes.data.forEach((m) => {
                    const id = typeof m.user === "string" ? m.user : m.user?._id;
                    if (!id) return;
                    if (!unique.has(id)) unique.set(id, m);
                });
                setMembers(Array.from(unique.values()));
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load project data");
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

    // Socket.IO event listeners with toast notifications
    useProjectSocket({
        projectId,
        onTaskCreated: (task) => {
            setTasks((prevTasks) => [task, ...prevTasks]);
        },
        onTaskUpdated: (task) => {
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === task._id ? task : t))
            );
        },
        onTaskDeleted: (taskId) => {
            setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
        },
        onMemberAdded: () => {
            fetchProjectAndTasks();
        },
        onMemberRemoved: () => {
            fetchProjectAndTasks();
        },
        onMemberRoleUpdated: () => {
            fetchProjectAndTasks();
        },
        onProjectUpdated: () => {
            fetchProjectAndTasks();
        },
        enableToasts: true,
    });

    const handleAddMember = async (userId: string, role: string) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.addProjectMember(projectId, { userId, role });
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
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
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
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
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateProject = async (projectData: Partial<Project>) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.projects.updateProject(projectId, projectData);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
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
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateTask = async (taskData: Omit<Parameters<typeof api.tasks.createTask>[0], 'projectId'>) => {
        if (!projectId) return;
        try {
            setActionLoading(true);
            const res = await api.tasks.createTask({ ...taskData, projectId } as Parameters<typeof api.tasks.createTask>[0]);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateTask = async (taskId: string, taskData: Partial<Task>) => {
        try {
            setActionLoading(true);
            const res = await api.tasks.updateTask(taskId, taskData);
            if (res.success) {
                await fetchProjectAndTasks();
                return { success: true };
            }
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
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
            return { success: false, message: (res as { message?: string }).message || "Internal error" };
        } catch (err: unknown) {
            return { success: false, message: err instanceof Error ? err.message : "An error occurred" };
        } finally {
            setActionLoading(false);
        }
    };

    return {
        project,
        members,
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
