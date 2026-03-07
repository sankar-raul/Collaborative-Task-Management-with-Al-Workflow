import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, X, FolderOpen, Calendar, Clock, Check, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { api } from "../../utils/api";
import { useUsers } from "../../context/users";
import type { Project } from "../../@types/interface/ProjectInterface";

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

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(prev => prev === id ? null : id);
    };

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
                            <div className="absolute bottom-4 right-4 z-10 text-right">
                                <button
                                    onClick={(e) => toggleMenu(project._id, e)}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <MoreVertical className="w-5 h-5" />
                                </button>

                                {openMenuId === project._id && (
                                    <div className="absolute right-0 bottom-full mb-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-100 origin-bottom-right">

                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                        >
                                            <Edit2 className="w-4 h-4 mr-2" /> Edit
                                        </button>
                                        <div className="h-px bg-gray-100 my-1"></div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); }}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>

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

            {/* Create Project Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                            <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setSelectedMembers([]); // Reset on close
                                }}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProject} className="p-6 space-y-5">
                            <div>
                                <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-1.5">Project Name</label>
                                <input
                                    type="text"
                                    id="projectName"
                                    name="projectName"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e5eb5]/50 focus:border-[#1e5eb5] outline-none transition-all placeholder-gray-400"
                                    placeholder="e.g. Server Migration V2"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e5eb5]/50 focus:border-[#1e5eb5] outline-none transition-all resize-none placeholder-gray-400"
                                    placeholder="Brief overview of the project scope..."
                                />
                            </div>

                            {/* Member Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Assign Members</label>
                                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto bg-white hidden-scrollbar">
                                    {isUsersLoading ? (
                                        <div className="p-4 text-center text-gray-500 text-sm animate-pulse">Loading members...</div>
                                    ) : systemUsers.filter(u => u.role === "User").length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No regular users available.</div>
                                    ) : (
                                        <div className="divide-y divide-gray-100">
                                            {systemUsers.filter(u => u.role === "User").map(user => {
                                                const memberData = selectedMembers.find(m => m.user === user._id);
                                                const isSelected = !!memberData;
                                                return (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => toggleMemberSelection(user._id)}
                                                        className={`flex items-center p-3 cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50/50' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center transition-colors ${isSelected ? 'bg-[#1e5eb5] border-[#1e5eb5]' : 'border-gray-300'}`}>
                                                            {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                                        </div>
                                                        <div className="flex items-center flex-1">
                                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs mr-3">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-xs text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                        {isSelected ? (
                                                            <select
                                                                value={memberData.role}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    updateMemberRole(user._id, e.target.value);
                                                                }}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-[#1e5eb5] shadow-sm"
                                                            >
                                                                <option value="Manager">Manager</option>
                                                                <option value="User">User</option>
                                                            </select>
                                                        ) : (
                                                            <div className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-0.5 rounded">{user.role}</div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="text-xs text-gray-500 mt-2 flex items-center">
                                    Selected: <span className="font-semibold text-gray-900 ml-1">{selectedMembers.length} member(s)</span>
                                </div>
                            </div>

                            <div className="pt-2 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-5 py-2.5 bg-[#1e5eb5] text-white rounded-lg hover:bg-[#1a51a0] disabled:opacity-70 transition-colors font-medium flex items-center shadow-sm"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Creating...
                                        </>
                                    ) : "Create Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
