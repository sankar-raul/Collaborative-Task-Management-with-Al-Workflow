import { Plus, Trash2, Users } from "lucide-react";

interface TeamMembersListProps {
    members: any[];
    onAdd?: () => void;
    onRemove?: (userId: string) => void;
    onUpdateRole?: (userId: string, role: string) => void;
    isManager: boolean;
    actionLoading: boolean;
    currentUserId?: string;
}

export const TeamMembersList = ({
    members,
    onAdd,
    onRemove,
    onUpdateRole,
    isManager,
    actionLoading,
    currentUserId
}: TeamMembersListProps) => {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 h-fit">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" /> Team Members
                </h3>
                {isManager && onAdd && (
                    <button
                        onClick={onAdd}
                        className="p-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-100"
                        title="Add Member"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {members?.length ? (
                    members.map((member: any, i: number) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50/50 border border-gray-50 rounded-2xl hover:border-indigo-100 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                    {member.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-bold text-gray-900 truncate">
                                        {member.user?.name || "Unknown"}
                                    </p>

                                    {isManager && onUpdateRole ? (
                                        <select
                                            value={member.role}
                                            onChange={(e) => onUpdateRole(member.user?._id, e.target.value)}
                                            disabled={actionLoading || member.user?._id === currentUserId}
                                            className={`text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border-none focus:ring-0 outline-none ${member.user?._id === currentUserId ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                                        >
                                            <option value="Manager">Manager</option>
                                            <option value="User">User</option>
                                        </select>
                                    ) : (
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                            {member.role}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {isManager && onRemove && member.user?._id !== currentUserId && (
                                <button
                                    onClick={() => onRemove(member)}
                                    className="p-1.5 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Remove Member"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-400 text-sm italic">
                        No members assigned
                    </div>
                )}
            </div>
        </div>
    );
};
