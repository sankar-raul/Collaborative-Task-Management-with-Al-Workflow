import { useEffect, useState } from "react";
import { Users, FolderKanban, ClipboardList, Eye, Calendar, Cpu } from "lucide-react";
import { useUsers } from "../../context/users";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/auth";
import { api } from "../../utils/api";
import { StatsCard } from "../../components/shared/StatsCard";
import type { Project } from "../../@types/interface/ProjectInterface";

export default function AdminDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const fetchData = async () => {
        try {
            // setLoading(true);
            const projectsRes = await api.projects.getProjects(1, 100);

            if (projectsRes.success) setProjects(projectsRes.data);

        } catch (err: any) {
            console.log(err.message || "Failed to load dashboard data");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Delete user
    const { systemUsers } = useUsers();
    const navigate = useNavigate();
    const { member } = useAuth();
    const totalUsers: number = systemUsers.filter(user => user._id !== member?.id).length;
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Admin Control Panel</h2>
                    <p className="text-gray-500 text-sm">
                        Manage users, oversee projects, and configure system settings.
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Users"
                    value={totalUsers}
                    icon={Users}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-100"
                />
                <StatsCard
                    title="Active Projects"
                    value={projects.length}
                    icon={FolderKanban}
                    colorClass="text-indigo-600"
                    bgClass="bg-indigo-100"
                />
                <StatsCard
                    title="Total Tasks"
                    value={0}
                    icon={ClipboardList}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-100"
                />
                 <StatsCard
                    title="Total Stacks"
                    value={1}
                    icon={Cpu}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-100"
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">


                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 ">
                        <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
                        <span className="text-sm text-gray-500">
                            {systemUsers.length} users
                        </span>
                    </div>

                    {/* Users */}
                    <div className="divide-y">
                        {systemUsers
                            .filter(user => user._id !== member?.id)
                            .map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between border border-gray-200 px-6 py-4 hover:bg-gray-50 transition"
                                >

                                    {/* User Info */}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-700">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>


                                    <div className="flex items-center space-x-3">

                                        {/* Role */}
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full
                            ${user.role === "Admin"
                                                    ? "bg-red-100 text-red-600"
                                                    : user.role === "manager"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-purple-100 text-purple-700"
                                                }`}
                                        >
                                            {user.role}
                                        </span>

                                        {/* View Button */}
                                        <button
                                            onClick={() => navigate(`/users/${user._id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* Empty state */}
                    {systemUsers.length === 0 && (
                        <div className="p-10 text-center text-gray-500">
                            No members found
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
                        <span className="text-sm text-gray-500">
                            {projects.length} projects
                        </span>
                    </div>
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50"
                        >
                            <div className="flex items-start flex-col space-x-4 mb-3 md:mb-0">

                                <p className="font-medium text-gray-900">{project.projectName}</p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">


                                <button
                                    onClick={() => navigate(`admin/projects/${project._id}`)}
                                    className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <Eye size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}