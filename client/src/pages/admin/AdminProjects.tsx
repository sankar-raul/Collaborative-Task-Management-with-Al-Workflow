import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, FolderOpen, Calendar, Clock, Check, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../../utils/api";
import { useUsers } from "../../context/users";
import type { Project } from "../../@types/interface/ProjectInterface";
import { CreateProjectModal } from "../../components/admin/CreateProjectModal";

export const AdminProjects = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { systemUsers, isLoading: isUsersLoading } = useUsers();
    const [selectedMembers, setSelectedMembers] = useState<{ user: string, role: string }[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const navigate = useNavigate();



    const fetchData = async () => {
        try {
            setLoading(true);
            const projectsRes = await api.projects.getProjects(1, 100);

            if (projectsRes.success) setProjects(projectsRes.data);

        } catch (err: any) {
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const payload = {
            projectName: formData.get("projectName") as string,
            description: formData.get("description") as string,
            members: selectedMembers
        };

        try {
            const res = await api.projects.createProject(payload);
            if (res.success) {
                // Refresh list
                await fetchData();
                setIsCreateModalOpen(false);
            } else {
                alert(res.message);
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleMemberSelection = (userId: string) => {
        setSelectedMembers(prev =>
            prev.some(m => m.user === userId)
                ? prev.filter(m => m.user !== userId)
                : [...prev, { user: userId, role: "User" }]
        );
    };

    const updateMemberRole = (userId: string, role: string) => {
        setSelectedMembers(prev =>
            prev.map(m => m.user === userId ? { ...m, role } : m)
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e5eb5]"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-600 bg-red-50 rounded-lg max-w-7xl mx-auto">{error}</div>;
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Projects</h1>
                    <p className="text-gray-600">Overview of all system projects, assignments, and statuses.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center px-4 py-2 bg-[#1e5eb5] text-white rounded-lg hover:bg-[#1a51a0] transition-colors shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Project
                </button>
            </div>

            {projects.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h3>
                    <p className="text-gray-500 mb-4">Get started by creating your first system project.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
                    >
                        Create Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div key={project._id}
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/projects/${project._id}`); }}

                            className="relative bg-white rounded-xl shadow-sm border border-gray-100 hover:border-[#1e5eb5]/30 transition-all group flex flex-col pt-8 hover:bg-indigo-50/30 ">


                            <div className="p-6 flex-1 pt-2">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-[#1e5eb5] group-hover:scale-110 transition-transform">
                                        <FolderOpen className="w-6 h-6" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${(project.status || 'IN_PROGRESS') === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        (project.status || 'IN_PROGRESS') === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {(project.status || 'IN_PROGRESS').replace("_", " ")}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={project.projectName}>
                                    {project.projectName}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-6">
                                    {project.description || "No description provided for this project."}
                                </p>

                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        Created: {new Date(project.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                        Members: {project.members?.length || 0}
                                    </div>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedMembers([]);
                }}
                onSubmit={handleCreateProject}
                submitting={submitting}
                systemUsers={systemUsers}
                isUsersLoading={isUsersLoading}
                selectedMembers={selectedMembers}
                toggleMemberSelection={toggleMemberSelection}
                updateMemberRole={updateMemberRole}
            />
        </div>
    );
};
