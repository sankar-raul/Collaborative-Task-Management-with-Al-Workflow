import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/auth";
import type { Task } from "../../@types/interface/TasksInterface";
import TasksTab from "../../components/user/TasksTab";

export default function UserTasks() {
    const { member } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!member?.id) return;
            try {
                setLoading(true);
                const tasksRes = await api.tasks.getTasksByUser(member.id);
                if (tasksRes.success) setTasks(tasksRes.data);
            } catch (error) {
                console.error("Failed to fetch user tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [member?.id]);

    const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
        try {
            // Optimistic update
            setTasks(prevTasks => prevTasks.map(t =>
                t._id === taskId ? { ...t, status: newStatus } : t
            ));

            // API Call
            const res = await api.tasks.changeTaskStatus(taskId, newStatus);
            if (!res.success) {
                // Revert if failed
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Error updating task status:", error);
            // Optionally, we could re-fetch all tasks here to ensure synchronization on failure
            if (member?.id) {
                const tasksRes = await api.tasks.getTasksByUser(member.id);
                if (tasksRes.success) setTasks(tasksRes.data);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="mb-6">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Tasks</h1>
                <p className="text-gray-500 text-sm">View all tasks assigned to you across your projects.</p>
            </div>
            <TasksTab tasks={tasks} onStatusChange={handleStatusChange} />
        </div>
    );
}
