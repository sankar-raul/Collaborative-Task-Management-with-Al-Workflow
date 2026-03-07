import React from "react";
import { X, Check } from "lucide-react";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
    submitting: boolean;
    systemUsers: any[];
    isUsersLoading: boolean;
    selectedMembers: { user: string; role: string }[];
    toggleMemberSelection: (userId: string) => void;
    updateMemberRole: (userId: string, role: string) => void;
}

export const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    submitting,
    systemUsers,
    isUsersLoading,
    selectedMembers,
    toggleMemberSelection,
    updateMemberRole,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
                    <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-md transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-5">
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
                            onClick={onClose}
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
    );
};
