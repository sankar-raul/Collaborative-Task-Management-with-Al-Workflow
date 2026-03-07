import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { api } from "../../utils/api";

import {
    ArrowLeft,
    CheckCircle2,
    Users,
    MoreVertical,
    CheckCircle
} from "lucide-react";

import type { Project } from "../../@types/interface/ProjectInterface";
import type { Task } from "../../@types/interface/TasksInterface";

export const AdminProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /* ---------------- Fetch Project + Tasks ---------------- */

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;

            try {
                setLoading(true);

                const [projectRes, tasksRes] = await Promise.all([
                    api.projects.getProjectById(id),
                    api.tasks.getTasksByProject(id)
                ]);

                if (projectRes.success) {
                    setProject(projectRes.data);
                }

                if (tasksRes.success) {
                    setTasks(tasksRes.data);
                }

            } catch (err: any) {
                setError(err.message || "Failed to load project data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /* ---------------- Loading ---------------- */

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    /* ---------------- Error ---------------- */

    if (error || !project) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <button
                    onClick={() => navigate("/admin/projects")}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Projects
                </button>

                <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                    {error || "Project not found"}
                </div>
            </div>
        );
    }

    /* ---------------- Page ---------------- */

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">

            {/* Back Button */}
            <button
                onClick={() => navigate("/admin/projects")}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Projects
            </button>

            {/* Project Header */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8 mb-8 relative">

                <button className="absolute top-4 right-4 p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <MoreVertical size={18} />
                </button>

                <div className="flex justify-between items-start">

                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {project.projectName}
                        </h1>

                        <p className="text-sm text-gray-500 mt-2">
                            {project.description || "No project description provided"}
                        </p>

                        <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">

                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="capitalize">
                                    {project.status || "In Progress"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>
                                    {project.members?.length || 0} Members
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-indigo-500" />
                                <span>
                                    {tasks.length} Tasks
                                </span>
                            </div>

                        </div>
                    </div>

                </div>

            </div>

            {/* Main Grid */}
            <div className=" bg-white rounded-2xl border border-gray-100 shadow-sm p-8">

                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Team Members
                </h3>



                {project.members?.length ? (

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

                        {project.members.map((member: any, i: number) => (

                            <div
                                key={i}
                                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition"
                            >

                                <div className="flex items-center gap-4">

                                    {/* Avatar */}
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                        {member.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>

                                    {/* User Info */}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {member.user?.name || "Unknown"}
                                        </p>

                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                            {member.role || "Member"}
                                        </span>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="text-sm text-gray-500 text-center py-10 border border-dashed rounded-xl">
                        No members assigned
                    </div>

                )}



            </div>

            {/* Recent Tasks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6">

                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Recent Tasks
                </h3>

                {tasks.length === 0 ? (

                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="w-10 h-10 text-gray-300 mb-3" />
                        <p className="text-sm font-medium text-gray-600">
                            No tasks created
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Tasks will appear here when added
                        </p>
                    </div>

                ) : (

                    <div className="space-y-5">

                        {tasks.map((task) => {

                            const assignedMember = project.members?.find(
                                (m: any) => m.user?._id === task.assignedTo
                            );

                            return (

                                <div
                                    key={task._id}
                                    className="border rounded-xl p-5 hover:bg-gray-50 transition"
                                >

                                    {/* Title + Priority */}
                                    <div className="flex justify-between items-start">

                                        <div>
                                            <p className="text-base font-semibold text-gray-900">
                                                {task.title}
                                            </p>

                                            {task.description && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>

                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
  ${task.priority === "Low"
                                                    ? "bg-green-100 text-green-700"
                                                    : task.priority === "Medium"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : task.priority === "High"
                                                            ? "bg-orange-100 text-orange-700"
                                                            : task.priority === "Critical"
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>

                                    {/* Skills */}
                                    {task.requiredSkills?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">

                                            {task.requiredSkills.map((skill, index) => (
                                                <span
                                                    key={index}
                                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                                >
                                                    {skill}
                                                </span>
                                            ))}

                                        </div>
                                    )}

                                    {/* Footer Info */}
                                    <div className="flex justify-between items-center mt-4 text-xs text-gray-500">

                                        {/* Assigned User */}
                                        <div>
                                            Assigned to:{" "}
                                            <span className="font-medium text-gray-700">
                                                {assignedMember?.user?.name || "Unassigned"}
                                            </span>
                                        </div>

                                        {/* Deadline */}
                                        <div>
                                            {task.deadline
                                                ? new Date(task.deadline).toLocaleDateString()
                                                : "No deadline"}
                                        </div>

                                    </div>

                                </div>

                            );
                        })}

                    </div>

                )}

            </div>

        </div>
    );
};