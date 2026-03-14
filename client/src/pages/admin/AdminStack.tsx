import React, { useState, useEffect } from "react";
import { Database, Plus, Trash2, Edit2, X, Check, Search, Layers, Cpu } from "lucide-react";
import { api } from "../../utils/api";
import type { TechStack } from "../../@types/interface/StackInterface";
import SkillsInput from "@/components/shared/SkillsInput";

export const AdminStack = () => {
    const [stacks, setStacks] = useState<TechStack[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStack, setEditingStack] = useState<TechStack | null>(null);
    const [formData, setFormData] = useState<{ name: string; skills: string[] }>({ name: "", skills: [] });
    const [actionLoading, setActionLoading] = useState(false);

    const fetchStacks = async () => {
        try {
            setLoading(true);
            const response = await api.stack.getAllStacks();
            if (response.success) {
                setStacks(response.data);
            }
        } catch (err) {
            setError("Failed to fetch tech stacks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStacks();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this stack?")) return;
        try {
            const response = await api.stack.deleteStack(id);
            if (response.success) {
                setStacks(stacks.filter(s => s._id !== id));
            }
        } catch (err) {
            alert("Error deleting stack");
        }
    };

    const handleOpenModal = (stack?: TechStack) => {
        if (stack) {
            setEditingStack(stack);
            setFormData({ name: stack.name, skills: stack.skills });
        } else {
            setEditingStack(null);
            setFormData({ name: "", skills: [] });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            if (editingStack) {
                const response = await api.stack.updateStack(editingStack._id, { name: formData.name, skills: formData.skills });
                if (response.success) {
                    setStacks(stacks.map(s => s._id === editingStack._id ? response.data : s));
                    setIsModalOpen(false);
                }
            } else {
                const response = await api.stack.createStack({ name: formData.name, skills: formData.skills });
                if (response.success) {
                    setStacks([...stacks, response.data]);
                    setIsModalOpen(false);
                }
            }
        } catch (err) {
            alert("Error processing stack");
        } finally {
            setActionLoading(false);
        }
    };

    const filteredStacks = stacks.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && stacks.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500/20 border-b-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                            <Cpu className="w-6 h-6 text-orange-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-foreground tracking-tight">Tech Stack Master</h1>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Universal Logic Registry Protocol</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20"
                >
                    <Plus size={20} /> Initialize New Tech
                </button>
            </div>

            {/* Content Card */}
            <div className="bg-card rounded-xl border border-border/50 shadow-2xl shadow-black/5 overflow-hidden">
                <div className="p-5 border-b border-border/50 bg-secondary/30 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-orange-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Scan registries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 bg-card border border-border/50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all font-bold text-sm text-foreground placeholder:text-muted-foreground/30"
                        />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                        Registry Count: <span className="text-orange-600 ml-1.5">{filteredStacks.length} Active Nodes</span>
                    </div>
                </div>

                {filteredStacks.length === 0 ? (
                    <div className="p-32 text-center">
                        <div className="w-20 h-20 bg-muted/50 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-border/40">
                            <Database className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No Clusters Found</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Initialize the first node to begin deployment</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/40">
                                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Stack Designation</th>
                                    <th className="px-10 py-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Skill Matrix</th>
                                    <th className="px-10 py-6 text-right text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {filteredStacks.map((stack) => (
                                    <tr key={stack._id} className="group hover:bg-secondary/20 transition-all duration-300">
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold text-base border border-orange-500/20 group-hover:scale-110 transition-transform">
                                                    {stack.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-foreground group-hover:text-orange-600 transition-colors uppercase tracking-tight">{stack.name}</div>
                                                    <div className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">Vector ID: {stack._id.slice(-8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex flex-wrap gap-2 max-w-md">
                                                {stack.skills.map((skill, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 bg-orange-500/5 text-orange-700 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-orange-500/10 group-hover:bg-orange-500/10 transition-colors">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => handleOpenModal(stack)}
                                                    className="p-3 text-muted-foreground/40 hover:text-orange-600 hover:bg-orange-500/10 rounded-xl transition-all border border-transparent hover:border-orange-500/20"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(stack._id)}
                                                    className="p-3 text-muted-foreground/40 hover:text-rose-600 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card rounded-xl w-full max-w-lg shadow-2xl overflow-hidden border border-border/50 animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/30 relative">

                            <div>
                                <h3 className="text-2xl font-bold text-foreground tracking-tight">
                                    {editingStack ? "Modify Cluster" : "Initiate Cluster"}
                                </h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">Operational Protocol Sigma</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground/40 hover:text-foreground hover:bg-secondary p-2.5 rounded-2xl transition-all border border-transparent hover:border-border/60">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80 ml-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-secondary/50 border border-border/50 rounded-xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground/30"
                                    placeholder="e.g. MERN STACK"
                                />
                            </div>
                            <div className="space-y-3">
                                <SkillsInput
                                    skills={formData.skills}
                                    setSkills={(skills) => setFormData({ ...formData, skills })}
                                />
                                <p className="text-[9px] font-medium text-muted-foreground/40 ml-1">Press Enter, Space, or Comma to add a skill</p>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-2xl transition-all border border-border/50"
                                >
                                    Abort
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-[2] py-4 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 disabled:opacity-50 transition-all font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center"
                                >
                                    {actionLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        editingStack ? "Commit Modifications" : "Confirm Initiation"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
