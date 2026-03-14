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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-card rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/30 relative">
                    <div>
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">Initiate Project</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Operational Protocol Alpha</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground/40 hover:text-foreground hover:bg-secondary p-2.5 rounded-2xl transition-all border border-transparent hover:border-border/60"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <div className="space-y-2">
                        <label htmlFor="projectName" className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Designation</label>
                        <input
                            type="text"
                            id="projectName"
                            name="projectName"
                            required
                            className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30"
                            placeholder="e.g. Neural Nexus Deployment"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Mission Briefing</label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-2xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none font-bold text-foreground h-32"
                            placeholder="Outline the core objectives..."
                        />
                    </div>

                    {/* Member Selection */}
                    <div className="space-y-4">
                        <label className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Assign Task Force</label>
                        <div className="border border-border rounded-3xl overflow-hidden bg-secondary/20 h-64 overflow-y-auto custom-scrollbar">
                            {isUsersLoading ? (
                                <div className="p-10 text-center animate-pulse flex flex-col items-center">
                                    <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scanning Grid...</p>
                                </div>
                            ) : systemUsers.filter(u => u.role === "User").length === 0 ? (
                                <div className="p-10 text-center">
                                    <p className="text-xs text-muted-foreground font-medium italic">No personnel available for deployment.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/40">
                                    {systemUsers.filter(u => u.role === "User").map(user => {
                                        const memberData = selectedMembers?.find((m: any) => m.user === user._id);
                                        const isSelected = !!memberData;
                                        return (
                                            <div
                                                key={user._id}
                                                onClick={() => toggleMemberSelection(user._id)}
                                                className={`flex items-center p-4 cursor-pointer transition-all ${isSelected ? 'bg-orange-500/5' : 'hover:bg-muted/50'}`}
                                            >
                                                <div className={`w-5 h-5 rounded-lg border mr-4 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/20' : 'border-border/60 bg-white'}`}>
                                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <div className="flex items-center flex-1">
                                                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-xs mr-3 border border-orange-500/20">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-foreground">{user.name}</div>
                                                        <div className="text-[10px] text-muted-foreground/60 font-medium">{user.email}</div>
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
                                                        className="text-[10px] font-bold bg-white border border-border px-2.5 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 outline-none transition-all shadow-sm text-foreground"
                                                    >
                                                        <option value="Manager">Manager</option>
                                                        <option value="User">User</option>
                                                    </select>
                                                ) : (
                                                    <div className="text-[9px] font-bold text-muted-foreground/40 bg-muted/50 px-2 py-1 rounded-lg uppercase tracking-wider">{user.role}</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-between items-center px-2">
                            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Enlistment Queue: <span className="text-orange-600 ml-1">{selectedMembers?.length || 0} Operators</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                        >
                            Abort
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-50 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20 active:scale-95"
                        >
                            {submitting ? "Processing..." : "Commit Deployment"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
