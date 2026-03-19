import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useAuth } from "../../context/auth";
import type { Task } from "../../@types/interface/TasksInterface";
import type { Project } from "../../@types/interface/ProjectInterface";
import DashboardHeader from "../../components/user/DashboardHeader";
import Overview from "../../components/user/Overview";

export default function UserDashboard() {
    const { member } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            if (!member?._id) return;
            try {
                setLoading(true);
                const [userRes, tasksRes, projectsRes] = await Promise.all([
                    api.members.getMemberById(member._id),
                    api.tasks.getTasksByUser(member._id),
                    api.members.getAssignedProjects()
                ]);

                if (userRes.success) setUser(userRes.data);
                if (tasksRes.success) setTasks(tasksRes.data);
                if (projectsRes.success) {
                    setProjects(projectsRes.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [member?._id]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    const taskStats = {
        assigned: tasks.length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        inReview: tasks.filter(t => t.status === "In Review").length,
        completed: tasks.filter(t => t.status === "Completed").length,
        overdue: 0, // Mocked for now
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            <DashboardHeader
                user={user}
            />

            <Overview
                user={user}
                tasks={tasks}
                projects={projects}
                taskStats={taskStats}
                onUserUpdate={(updatedUser) => setUser(updatedUser)}
            />
        </div>
    );
}
