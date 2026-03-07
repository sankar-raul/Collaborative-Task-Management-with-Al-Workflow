import React, { useState } from "react";
import { X, Trash2, Search } from "lucide-react";
import { api } from "../../utils/api";

interface ProjectModalsProps {
    project: any;
    isEditProjectModalOpen: boolean;
    setIsEditProjectModalOpen: (open: boolean) => void;
    isDeleteProjectModalOpen: boolean;
    setIsDeleteProjectModalOpen: (open: boolean) => void;
    isAddMemberModalOpen: boolean;
    setIsAddMemberModalOpen: (open: boolean) => void;
    isDeleteMemberModalOpen: boolean;
    setIsDeleteMemberModalOpen: (open: boolean) => void;
    memberToDelete: any;
    handleUpdateProject: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleDeleteProject: () => Promise<void>;
    handleAddMember: (userId: string, role: string) => Promise<void>;
    handleRemoveMember: (userId: string) => Promise<void>;
    actionLoading: boolean;
    systemUsers: any[];
    isLoadingUsers?: boolean;
    usersError?: string | null;
    isManager?: boolean;
    currentUser?: any;
}

export const ProjectModals: React.FC<ProjectModalsProps> = ({
    project,
    isEditProjectModalOpen,
    setIsEditProjectModalOpen,
    isDeleteProjectModalOpen,
    setIsDeleteProjectModalOpen,
    isAddMemberModalOpen,
    setIsAddMemberModalOpen,
    isDeleteMemberModalOpen,
    setIsDeleteMemberModalOpen,
    memberToDelete,
    handleUpdateProject,
    handleDeleteProject,
    handleAddMember,
    handleRemoveMember,
    actionLoading,
    systemUsers,
    isLoadingUsers,
    usersError,
}) => {
    const [localSearchResults, setLocalSearchResults] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <>
            {/* Edit Project Modal */}
            {isEditProjectModalOpen && project && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Edit Project Details</h3>
                            <button onClick={() => setIsEditProjectModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProject} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Project Name</label>
                                <input
                                    name="projectName"
                                    defaultValue={project.projectName}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={project.description}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 outline-none h-32 resize-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditProjectModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                >
                                    {actionLoading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Project Modal */}
            {isDeleteProjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200 text-center">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-red-600 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Project?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            This will permanently delete the project <span className="font-bold">"{project?.projectName}"</span> and all its tasks. This action cannot be undone.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteProjectModalOpen(false)}
                                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? "Deleting..." : "Delete Project"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Member Modal */}
            {isDeleteMemberModalOpen && memberToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200 text-center">
                        <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="text-red-600 w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Remove Member?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to remove <span className="font-bold">"{memberToDelete?.user?.name}"</span> from this project?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setIsDeleteMemberModalOpen(false);
                                }}
                                className="flex-1 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleRemoveMember(memberToDelete?.user?._id)}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-red-600 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? "Removing..." : "Remove Member"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {isAddMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add Team Member</h3>
                            <button onClick={() => setIsAddMemberModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Search Input for Managers (Non-Admins) or as an extra tool for Admins */}
                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    className="w-full px-4 py-3 pl-10 rounded-xl border border-gray-100 focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all"
                                    onChange={async (e) => {
                                        const query = e.target.value;
                                        setSearchQuery(query);
                                        if (query.length > 2) {
                                            const res = await api.members.searchMembers(query);
                                            if (res.success) {
                                                setLocalSearchResults(res.data);
                                            }
                                        } else {
                                            setLocalSearchResults([]);
                                        }
                                    }}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Search size={18} />
                                </div>
                            </div>

                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-[100px] flex flex-col">
                                {isLoadingUsers ? (
                                    <div className="flex flex-col items-center justify-center py-10 space-y-2 text-gray-400">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                                        <p className="text-[10px] italic">Loading users...</p>
                                    </div>
                                ) : usersError ? (
                                    <p className="text-center py-8 text-xs text-red-400 italic">{usersError}</p>
                                ) : (() => {
                                    const sourceUsers = searchQuery.length > 2 ? localSearchResults : systemUsers;
                                    const query = searchQuery.toLowerCase();

                                    const filteredUsers = sourceUsers.filter(u =>
                                        u.role !== "Admin" &&
                                        (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
                                    );

                                    if (filteredUsers.length === 0) {
                                        if (searchQuery.length > 0) {
                                            return <p className="text-center py-8 text-xs text-gray-400 italic">No members found matching "{searchQuery}"</p>;
                                        }
                                        return <p className="text-center py-8 text-xs text-gray-400 italic">No users available to add</p>;
                                    }

                                    return filteredUsers.map((user) => {
                                        const isAdmin = user.role === "Admin";
                                        const isAlreadyMember = project?.members?.some((m: any) => m.user?._id === user._id);

                                        return (
                                            <div key={user._id} className="flex items-center justify-between p-3 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                                        <p className="text-[10px] text-gray-400">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {isAdmin ? (
                                                        <div className="px-3 py-1 flex items-center justify-center bg-red-50 text-red-600 font-bold text-[10px] rounded-lg border border-red-100">
                                                            Admin
                                                        </div>
                                                    ) : isAlreadyMember ? (
                                                        <div className="px-3 py-1 flex items-center justify-center bg-emerald-50 text-emerald-600 font-bold text-[10px] rounded-lg border border-emerald-100">
                                                            Joined
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => handleAddMember(user._id, "Manager")}
                                                                disabled={actionLoading}
                                                                className="px-2 py-1 text-[10px] bg-yellow-50 text-yellow-700 font-bold rounded-md hover:bg-yellow-100 transition-colors disabled:opacity-50"
                                                            >
                                                                + Manager
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddMember(user._id, "User")}
                                                                disabled={actionLoading}
                                                                className="px-2 py-1 text-[10px] bg-indigo-50 text-indigo-700 font-bold rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
                                                            >
                                                                + Member
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    });
                                })()}
                            </div>
                            <div className="pt-2">
                                <button onClick={() => setIsAddMemberModalOpen(false)} className="w-full py-3 bg-gray-50 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
