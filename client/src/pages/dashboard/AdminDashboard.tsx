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

    const { systemUsers, refreshUsers } = useUsers();
    const navigate = useNavigate();
    const { member } = useAuth();
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        try {
            setActionLoadingId(id);
            const res = await api.members.approveMember(id);
            if (res.success) {
                await refreshUsers();
            }
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm("Are you sure you want to reject and delete this user?")) return;
        try {
            setActionLoadingId(id);
            const res = await api.members.rejectMember(id);
            if (res.success) {
                await refreshUsers();
            }
        } catch (err: any) {
            console.error(err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const totalUsers: number = systemUsers.filter(user => user._id !== member?.id).length;
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-3">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Admin Control Panel</h2>
                    <p className="text-muted-foreground text-sm">
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
                    colorClass="text-blue-500 dark:text-blue-400"
                    bgClass="bg-blue-500/10"
                />
                <StatsCard
                    title="Active Projects"
                    value={projects.length}
                    icon={FolderKanban}
                    colorClass="text-indigo-500 dark:text-indigo-400"
                    bgClass="bg-indigo-500/10"
                />
                <StatsCard
                    title="Total Tasks"
                    value={0}
                    icon={ClipboardList}
                    colorClass="text-emerald-500 dark:text-emerald-400"
                    bgClass="bg-emerald-500/10"
                />
                 <StatsCard
                    title="Total Stacks"
                    value={1}
                    icon={Cpu}
                    colorClass="text-orange-500 dark:text-orange-400"
                    bgClass="bg-orange-500/10"
                />
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-secondary/30">
                        <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
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
                                    className="flex items-center justify-between border-b border-border/50 px-6 py-4 hover:bg-secondary/20 transition"
                                >
                                    {/* User Info */}
                                    <div className="flex items-center space-x-4">
                                        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold text-foreground">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>


                                    <div className="flex items-center space-x-3">
                                        {/* Approval status - only show for unapproved users */}
                                        {user.isApproved === false && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleApprove(user._id)}
                                                    disabled={actionLoadingId === user._id}
                                                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-500/10 active:scale-95 disabled:opacity-50"
                                                >
                                                    {actionLoadingId === user._id ? "..." : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(user._id)}
                                                    disabled={actionLoadingId === user._id}
                                                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}

                                        {/* Role */}
                                        <span
                                            className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg
                                                ${user.role === "Admin"
                                                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                                    : user.role === "Manager"
                                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                        : "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20"
                                                }`}
                                        >
                                            {user.role}
                                        </span>

                                        {/* View Button */}
                                        <button
                                            onClick={() => navigate(`/users/${user._id}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-secondary hover:bg-secondary-foreground/10 text-foreground rounded-lg transition-all active:scale-95 border border-border/50"
                                        >
                                            <Eye size={14} />
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
                <div className="bg-card rounded-xl border border-border shadow-sm divide-y divide-border/50 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-secondary/30">
                        <h2 className="text-lg font-semibold text-foreground">Projects</h2>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                            {projects.length} projects
                        </span>
                    </div>
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-secondary/20 transition-all border-b border-border/40 last:border-b-0"
                        >
                            <div className="flex items-start flex-col space-x-4 mb-3 md:mb-0">
                                <p className="font-bold text-foreground text-sm pl-4">{project.projectName}</p>
                                <div className="flex items-center text-[11px] font-medium text-muted-foreground pl-4 mt-1">
                                    <Calendar className="w-3.5 h-3.5 mr-2" />
                                    Created: {new Date(project.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                                <button
                                    onClick={() => navigate(`admin/projects/${project._id}`)}
                                    className="p-2.5 bg-secondary text-foreground hover:bg-secondary-foreground/10 rounded-xl transition-all border border-border/50 active:scale-95 shadow-sm"
                                >
                                    <Eye size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}