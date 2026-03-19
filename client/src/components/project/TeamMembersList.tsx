import type { IProjectMember } from "@/@types/interface/ProjectInterface";
import { Plus, Trash2, Users } from "lucide-react";

interface TeamMembersListProps {
    members: IProjectMember[];
    onAdd?: () => void;
    onRemove?: (member: IProjectMember) => void;
    onUpdateRole?: (userId: string, role: string) => void | Promise<void>;
    onApprove?: (userId: string) => Promise<void>;
    onReject?: (userId: string) => Promise<void>;
    isManager: boolean;
    actionLoading: boolean;
    currentUserId?: string;
    loadingId?: string | null;
}
export const TeamMembersList = ({
    members,
    onAdd,
    onRemove,
    onUpdateRole,
    onApprove,
    onReject,
    isManager,
    actionLoading,
    currentUserId,
    loadingId
}: TeamMembersListProps) => {
    return (
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="px-8 py-6 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                    <h3 className="text-lg font-[800] text-foreground flex items-center gap-3 tracking-[-0.01em]">
                        <Users className="w-5 h-5 text-primary" /> Project Members
                    </h3>
                    <p className="text-[9px] text-muted-foreground mt-1 font-black uppercase tracking-[0.2em] opacity-30">Collaborators and access roles</p>
                </div>
                {isManager && onAdd && (
                    <button
                        onClick={onAdd}
                        className="w-9 h-9 flex items-center justify-center bg-primary text-primary-foreground hover:opacity-90 rounded-lg transition-all shadow-sm active:scale-95 border border-primary/20"
                        title="Add Member"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-muted/10 border-b border-border">
                            <th className="px-6 py-4 font-black text-muted-foreground text-[8px] uppercase tracking-[0.25em]">Member</th>
                            <th className="px-6 py-4 font-black text-muted-foreground text-[8px] uppercase tracking-[0.25em]">Role</th>
                            <th className="px-6 py-4 font-black text-muted-foreground text-[8px] uppercase tracking-[0.25em] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {members?.length ? (
                            members.map((member: IProjectMember, i: number) => {
                                const userId = typeof member.user === "string" ? member.user : member.user?._id;
                                const userName = typeof member.user === "string" ? member.user : member.user?.name || "Unknown";
                                const userInitial = userName?.charAt(0)?.toUpperCase() || "U";
                                const isApproved = typeof member.user !== "string" && member.user?.isApproved === false;
                                const isCurrentUser = Boolean(userId && currentUserId && userId === currentUserId);
                                const role = member.role || "User";

                                return (
                                    <tr key={userId || `member-${i}`} className="hover:bg-muted/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold border border-primary/20 transition-transform group-hover:scale-105">
                                                {userInitial}
                                            </div>
                                            <div className="font-semibold text-foreground text-sm">
                                                {userName}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isManager && onUpdateRole ? (
                                            <select
                                                value={role}
                                                onChange={(e) => onUpdateRole(userId || "", e.target.value)}
                                                disabled={actionLoading || isCurrentUser}
                                                className={`text-[10px] font-bold text-primary bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10 focus:ring-0 outline-none transition-all ${isCurrentUser ? 'cursor-not-allowed opacity-40' : 'cursor-pointer hover:bg-primary/10'}`}
                                            >
                                                <option value="Manager">Manager</option>
                                                <option value="User">User</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${role === 'Manager'
                                                ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                : 'bg-primary/10 text-primary border-primary/20'
                                                }`}>
                                                {role}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {isManager && isApproved && onApprove && onReject && (
                                                <div className="flex items-center gap-2 mr-2">
                                                    <button
                                                        onClick={() => userId && onApprove(userId)}
                                                        disabled={actionLoading || loadingId === userId}
                                                        className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all "
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => userId && onReject(userId)}
                                                        disabled={actionLoading || loadingId === userId}
                                                        className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500/20 transition-all disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}

                                            {isManager && onRemove && !isCurrentUser && (
                                                <button
                                                    onClick={() => onRemove(member)}
                                                    className="p-2 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-lg opacity-100 transition-all"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-6 py-10 text-center text-muted-foreground/40 text-xs font-medium italic">
                                    No members identified
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

