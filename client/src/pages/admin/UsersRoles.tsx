import { Shield, User, Calendar, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import { useUsers } from "../../context/users";
import { api } from "../../utils/api";
import { type TechStack } from "../../@types/interface/StackInterface";

export const UsersRoles = () => {
    const { systemUsers, isLoading: loading, error } = useUsers();
    const navigate = useNavigate();
    const { member } = useAuth();
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);

    useEffect(() => {
        const fetchStacks = async () => {
            try {
                const res = await api.stack.getAllStacks();
                if (res.success) setTechStacks(res.data);
            } catch (err) {
                console.error("Failed to fetch stacks:", err);
            }
        };
        fetchStacks();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-b-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                <div className="bg-rose-500/10 text-rose-500 p-6 rounded-2xl border border-rose-500/20 font-bold">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Users & Roles</h1>
                    <p className="text-muted-foreground font-medium text-base">Manage team access levels and organizational hierarchy.</p>
                </div>
                {/* <button
                    className="flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 font-bold text-sm"
                >
                    Add New User
                </button> */}
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="px-8 py-5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">User</th>
                                <th className="px-8 py-5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Email Address</th>
                                <th className="px-8 py-5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Role</th>
                                <th className="px-8 py-5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Tech Stacks</th>
                                <th className="px-8 py-5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider">Joined Date</th>
                                <th className="px-8 py-5 font-bold text-muted-foreground text-[11px] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {systemUsers.filter(user => user._id !== member?._id).map((user) => (
                                <tr key={user._id} className="hover:bg-muted/30 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20 group-hover:scale-105 transition-transform">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="font-semibold text-foreground">{user.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-muted-foreground font-medium">
                                        {user.email}
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.role === 'Admin' ? (
                                            <div className="flex items-center w-fit px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 text-[10px] font-bold uppercase tracking-wider border border-rose-500/20">
                                                <Shield className="w-3 h-3 mr-2" />
                                                Admin
                                            </div>
                                        ) : (
                                            <div className="flex items-center w-fit px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                                <User className="w-3 h-3 mr-2" />
                                                Member
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                            {user.stacks && user.stacks.length > 0 ? (
                                                user.stacks.map(stackId => {
                                                    const stack = techStacks.find(s => s._id === stackId);
                                                    return stack ? (
                                                        <span key={stackId} className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-bold text-secondary-foreground border border-border">
                                                            {stack.name}
                                                        </span>
                                                    ) : null;
                                                })
                                            ) : (
                                                <span className="text-[10px] text-muted-foreground italic">No stacks assigned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-muted-foreground font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 opacity-40" />
                                            {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.isApproved === false && (
                                                <>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`Approve access for ${user.name}?`)) {
                                                                try {
                                                                    await api.members.approveMember(user._id);
                                                                    window.location.reload();
                                                                } catch (err: any) {
                                                                    alert(err.message);
                                                                }
                                                            }
                                                        }}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-all border border-emerald-500/20"
                                                        title="Approve User"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (confirm(`Reject and delete ${user.name}?`)) {
                                                                try {
                                                                    await api.members.rejectMember(user._id);
                                                                    window.location.reload();
                                                                } catch (err: any) {
                                                                    alert(err.message);
                                                                }
                                                            }
                                                        }}
                                                        className="p-2 text-rose-600 hover:bg-rose-500/10 rounded-lg transition-all border border-rose-500/20"
                                                        title="Reject User"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => navigate(`/users/${user._id}`)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-500/10 rounded-lg transition-all border border-indigo-500/20"
                                                title="View Profile"
                                            >
                                                <User size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
