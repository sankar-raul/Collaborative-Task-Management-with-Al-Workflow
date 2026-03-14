import React, { useState } from "react";
import { X, Trash2, Search, Edit3, UserPlus, AlertTriangle, ShieldCheck, User } from "lucide-react";
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300">
                <div className="px-10 py-8 border-b border-border/50 flex justify-between items-center bg-secondary/30 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                    <div>
                        <h3 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
                            <Edit3 className="w-6 h-6 mr-3 text-orange-600" />
                            Modify Operation
                        </h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mt-1">Update Core Project Parameters</p>
                            </div>
                            <button onClick={() => setIsEditProjectModalOpen(false)} className="text-muted-foreground/40 hover:text-foreground hover:bg-secondary p-2.5 rounded-2xl transition-all border border-transparent hover:border-border/60">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProject} className="p-10 space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Designation</label>
                                <input
                                    name="projectName"
                                    defaultValue={project.projectName}
                                    required
                                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Mission Briefing</label>
                                <textarea
                                    name="description"
                                    defaultValue={project.description}
                                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-32 resize-none transition-all font-bold text-foreground"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditProjectModalOpen(false)}
                                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 py-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-orange-500/20"
                                >
                                    {actionLoading ? "Synchronizing..." : "Commit Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Project Modal */}
            {isDeleteProjectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden p-10 border border-border/50 animate-in zoom-in-95 duration-300 text-center">
                        <div className="bg-rose-500/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-lg shadow-rose-500/5">
                            <Trash2 className="text-rose-500 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Decommission Project?</h3>
                        <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                            This will permanently terminate <span className="text-foreground font-black">"{project?.projectName}"</span> and all associated data vectors. This operation is IRREVERSIBLE.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteProjectModalOpen(false)}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                            >
                                Abort
                            </button>
                            <button
                                onClick={handleDeleteProject}
                                disabled={actionLoading}
                                className="flex-1 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-rose-600 transition-all disabled:opacity-50 shadow-xl shadow-rose-500/20"
                            >
                                {actionLoading ? "Terminating..." : "Confirm Deletion"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Member Modal */}
            {isDeleteMemberModalOpen && memberToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden p-10 border border-border/50 animate-in zoom-in-95 duration-300 text-center">
                        <div className="bg-amber-500/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                            <Trash2 className="text-amber-500 w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground mb-3 tracking-tight">Revoke Authorization?</h3>
                        <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">
                            Are you certain you wish to revoke access for <span className="text-foreground font-black">"{memberToDelete?.user?.name}"</span> from this operational unit?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setIsDeleteMemberModalOpen(false);
                                }}
                                className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                            >
                                Abort
                            </button>
                            <button
                                onClick={() => handleRemoveMember(memberToDelete?.user?._id)}
                                disabled={actionLoading}
                                className="flex-1 py-4 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-amber-600 transition-all disabled:opacity-50 shadow-xl shadow-amber-500/20"
                            >
                                {actionLoading ? "Processing..." : "Confirm Revocation"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {isAddMemberModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-8 border-b border-border/50 flex justify-between items-center bg-secondary/30 relative">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500" />
                            <div>
                                <h3 className="text-2xl font-bold text-foreground tracking-tight flex items-center">
                                    <UserPlus className="w-6 h-6 mr-3 text-orange-600" />
                                    Assign Personnel
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Enlist Operators to Task Force</p>
                            </div>
                            <button onClick={() => setIsAddMemberModalOpen(false)} className="text-muted-foreground/40 hover:text-foreground hover:bg-secondary p-2.5 rounded-2xl transition-all border border-transparent hover:border-border/60">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 space-y-6">
                            {/* Search Input */}
                            <div className="relative">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40">
                                    <Search size={22} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Scan identity or communication matrix..."
                                    className="w-full px-6 py-4 pl-14 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30"
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
                            </div>

                            <div className="max-h-80 overflow-y-auto space-y-3 pr-2 custom-scrollbar min-h-[150px] flex flex-col p-1">
                                {isLoadingUsers ? (
                                    <div className="flex flex-col items-center justify-center py-16 space-y-4 text-muted-foreground">
                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-b-primary"></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest italic animate-pulse">Scanning Grid...</p>
                                    </div>
                                ) : usersError ? (
                                    <div className="p-6 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20 text-center font-bold text-xs">
                                        {usersError}
                                    </div>
                                ) : (() => {
                                    const sourceUsers = searchQuery.length > 2 ? localSearchResults : systemUsers;
                                    const query = searchQuery.toLowerCase();

                                    const filteredUsers = sourceUsers.filter(u =>
                                        u.role !== "Admin" &&
                                        (u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query))
                                    );

                                    if (filteredUsers.length === 0) {
                                        return (
                                            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground bg-secondary/20 rounded-[2rem] border border-dashed border-border/50">
                                                <AlertTriangle className="w-10 h-10 mb-4 opacity-20" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic">
                                                    {searchQuery.length > 0 ? `Zero matches for "${searchQuery}"` : "No personnel available"}
                                                </p>
                                            </div>
                                        );
                                    }

                                    return filteredUsers.map((user) => {
                                        const isAdmin = user.role === "Admin";
                                        const isAlreadyMember = project?.members?.some((m: any) => m.user?._id === user._id);

                                        return (
                                            <div key={user._id} className="flex items-center justify-between p-5 bg-card/50 border border-border/40 rounded-[1.5rem] hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-base border border-primary/20 group-hover:scale-110 transition-transform">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-foreground">{user.name}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground/60">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    {isAdmin ? (
                                                        <div className="px-5 py-2 flex items-center gap-2 bg-rose-500/10 text-rose-500 font-black text-[10px] rounded-xl border border-rose-500/20 uppercase tracking-widest">
                                                            <ShieldCheck className="w-3.5 h-3.5" /> High Alpha
                                                        </div>
                                                    ) : isAlreadyMember ? (
                                                        <div className="px-5 py-2 flex items-center gap-2 bg-emerald-500/10 text-emerald-500 font-black text-[10px] rounded-xl border border-emerald-500/20 uppercase tracking-widest">
                                                            Deployed
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleAddMember(user._id, "Manager")}
                                                                disabled={actionLoading}
                                                                className="px-4 py-2 text-[10px] bg-amber-500/10 text-amber-500 font-black rounded-xl hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 uppercase tracking-widest border border-amber-500/20 active:scale-95"
                                                            >
                                                                + Manager
                                                            </button>
                                                            <button
                                                                onClick={() => handleAddMember(user._id, "User")}
                                                                disabled={actionLoading}
                                                                className="px-4 py-2 text-[10px] bg-primary/10 text-primary font-black rounded-xl hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-50 uppercase tracking-widest border border-primary/20 active:scale-95"
                                                            >
                                                                + Operator
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    });
                                })()}
                            </div>
                            <div className="pt-4">
                                <button onClick={() => setIsAddMemberModalOpen(false)} className="w-full py-5 px-10 bg-secondary/50 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-secondary rounded-[2rem] border border-border/50 transition-all active:scale-95">
                                    Close Personnel Matrix
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
