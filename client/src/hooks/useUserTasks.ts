import { useCallback, useEffect, useState } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../context/auth';
import type { Task } from '../@types/interface/TasksInterface';

interface UseUserTasksReturn {
    tasks: Task[];
    loading: boolean;
    refetch: () => Promise<void>;
    updateTaskStatus: (taskId: string, newStatus: Task['status']) => Promise<void>;
}

export function useUserTasks(): UseUserTasksReturn {
    const { member } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = useCallback(async () => {
        if (!member?._id) return;
        try {
            setLoading(true);
            const res = await api.tasks.getTasksByUser(member._id);
            if (res.success) setTasks(res.data);
        } catch (error) {
            console.error('Failed to fetch user tasks:', error);
        } finally {
            setLoading(false);
        }
    }, [member?._id]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const updateTaskStatus = useCallback(async (taskId: string, newStatus: Task['status']) => {
        // Optimistic update
        setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
        try {
            const res = await api.tasks.changeTaskStatus(taskId, newStatus);
            if (!res.success) throw new Error('Failed to update status');
        } catch (error) {
            console.error('Error updating task status:', error);
            // Revert by re-fetching
            if (member?._id) {
                const tasksRes = await api.tasks.getTasksByUser(member._id);
                if (tasksRes.success) setTasks(tasksRes.data);
            }
        }
    }, [member?._id]);

    return { tasks, loading, refetch: fetchTasks, updateTaskStatus };
}
