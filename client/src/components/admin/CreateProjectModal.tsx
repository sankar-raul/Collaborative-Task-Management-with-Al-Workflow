import React from "react";
import { X, Check, Upload, FileText, ArrowRight, ArrowLeft, Calendar, Layers, Search } from "lucide-react";
import { api } from "../../utils/api";
import { type TechStack } from "../../@types/interface/StackInterface";

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
    submitting: boolean;
    systemUsers: any[];
    isUsersLoading: boolean;
    selectedMembers: { user: string; role: string }[];
    toggleMemberSelection: (userId: string) => void;
    updateMemberRole: (userId: string, role: string) => void;
    techStacks: TechStack[];
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
    techStacks,
}) => {
    const [step, setStep] = React.useState(1);
    const [uploadingPdf, setUploadingPdf] = React.useState(false);
    const [parsedText, setParsedText] = React.useState("");
    const [fileError, setFileError] = React.useState("");
    const [memberSearch, setMemberSearch] = React.useState("");
    const [formData, setFormData] = React.useState({
        projectName: "",
        description: "",
        deadline: "",
        techStackId: ""
    });

    if (!isOpen) return null;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            setFileError("Only PDF files are allowed.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setFileError("File size must be less than 2MB.");
            return;
        }

        setFileError("");
        setUploadingPdf(true);
        try {
            const res = await api.projects.uploadPdf(file);
            if (res.success) {
                setParsedText(res.parsedText);
                setFormData(prev => ({ ...prev, description: res.parsedText }));
                setStep(2);
            } else {
                setFileError(res.message || "Failed to parse PDF.");
            }
        } catch (err: any) {
            setFileError(err.message || "An error occurred during upload.");
        } finally {
            setUploadingPdf(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            members: selectedMembers,
            isAI: !!parsedText
        });
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-card rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300">
                <div className="p-7 sticky top-0 bg-card/80 backdrop-blur-xl z-10 border-b border-border/50 flex justify-between items-center relative">
                    <div>
                        <h3 className="text-xl font-extrabold text-foreground tracking-tight">
                            {step === 1 ? "Initialize Mission" : "Configure Deployment"}
                        </h3>
                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">
                            {step === 1 ? "Phase I: Intelligence Gathering" : "Phase II: Vector Alignment"}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground/40 hover:text-foreground hover:bg-secondary p-2.5 rounded-2xl transition-all border border-transparent hover:border-border/60"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {step === 1 ? (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/60 rounded-[2rem] bg-secondary/20 hover:bg-secondary/30 transition-all group relative overflow-hidden">
                                {uploadingPdf ? (
                                    <div className="flex flex-col items-center text-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest animate-pulse">Decrypting Protocol...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition-transform">
                                            <Upload size={32} />
                                        </div>
                                        <h3 className="text-lg font-extrabold text-foreground mb-2">Upload Mission Briefing</h3>
                                        <p className="text-[13px] text-muted-foreground text-center max-w-xs mb-8 font-medium leading-relaxed">
                                            Provide the project documentation in PDF format (Max 2MB). Our AI will analyze the content for deployment.
                                        </p>
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <button className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20 pointer-events-none">
                                            Select File
                                        </button>
                                    </>
                                )}
                            </div>
                            {fileError && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-xs font-bold flex items-center gap-3">
                                    <X size={16} />
                                    {fileError}
                                </div>
                            )}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setStep(2)}
                                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-orange-500 transition-colors"
                                >
                                    Skip to Manual Entry
                                </button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            {/* {parsedText && (
                                <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl space-y-3">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                                        <FileText size={14} />
                                        Extracted Intelligence
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 italic">
                                        "{parsedText}"
                                    </p>
                                </div>
                            )} */}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 col-span-2">
                                    <label className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.projectName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                                        className="w-full px-5 py-3.5 bg-secondary/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-foreground placeholder:text-muted-foreground/30 text-sm"
                                        placeholder="Project Alpha"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                                        <Calendar size={12} className="mr-2" />
                                        Deadline
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.deadline}
                                        onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                                        className="w-full px-5 py-3.5 bg-secondary/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-foreground text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">
                                        <Layers size={12} className="mr-2" />
                                        Tech Stack
                                    </label>
                                    <select
                                        required
                                        value={formData.techStackId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, techStackId: e.target.value }))}
                                        className="w-full px-5 py-3.5 bg-secondary/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-bold text-foreground text-sm"
                                    >
                                        <option value="">Select Stack</option>
                                        {techStacks.map(stack => (
                                            <option key={stack._id} value={stack._id}>{stack.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80 ml-1">Mission briefing</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-5 py-3.5 bg-secondary/50 border border-border/50 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-foreground text-sm min-h-[100px] resize-none"
                                    placeholder="Describe the mission objectives..."
                                />
                            </div>

                            {/* Member Selection */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <label className="flex items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Assign Task Force</label>
                                    <div className="relative group/search">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within/search:text-orange-500 transition-colors" />
                                        <input
                                            type="text"
                                            value={memberSearch}
                                            onChange={(e) => setMemberSearch(e.target.value)}
                                            placeholder="Search personnel..."
                                            className="pl-9 pr-4 py-1.5 bg-secondary/30 border border-border/50 rounded-xl text-[10px] font-bold text-foreground outline-none focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 w-48 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="border border-border rounded-2xl overflow-hidden bg-secondary/20 h-48 overflow-y-auto custom-scrollbar">
                                    {isUsersLoading ? (
                                        <div className="p-8 text-center animate-pulse flex flex-col items-center">
                                            <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4" />
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Scanning Grid...</p>
                                        </div>
                                    ) : systemUsers.filter(u => u.role === "User" && (u.name.toLowerCase().includes(memberSearch.toLowerCase()) || u.email.toLowerCase().includes(memberSearch.toLowerCase()))).length === 0 ? (
                                        <div className="p-10 text-center">
                                            <p className="text-xs text-muted-foreground font-medium italic">No personnel found.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border/40">
                                            {systemUsers.filter(u => u.role === "User" && (u.name.toLowerCase().includes(memberSearch.toLowerCase()) || u.email.toLowerCase().includes(memberSearch.toLowerCase()))).map(user => {
                                                const memberData = selectedMembers?.find((m: any) => m.user === user._id);
                                                const isSelected = !!memberData;
                                                return (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => toggleMemberSelection(user._id)}
                                                        className={`flex items-center p-3 cursor-pointer transition-all ${isSelected ? 'bg-orange-500/5' : 'hover:bg-muted/50'}`}
                                                    >
                                                        <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center transition-all ${isSelected ? 'bg-orange-500 border-orange-500 shadow-sm shadow-orange-500/20' : 'border-border/60 bg-white'}`}>
                                                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                                                        </div>
                                                        <div className="flex items-center flex-1">
                                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-[10px] mr-3 border border-orange-500/20">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-xs font-bold text-foreground">{user.name}</div>
                                                                <div className="text-[9px] text-muted-foreground/60 font-medium">{user.email}</div>
                                                            </div>
                                                        </div>
                                                        {isSelected && (
                                                            <p className="text-[9px] font-bold bg-white border border-border px-2 py-1 rounded-md focus:outline-none">Manager</p>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 py-3.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-xl transition-all border border-border/50 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft size={14} />
                                    Phase I
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-[2] py-3.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Commit Deployment
                                            <ArrowRight size={14} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
