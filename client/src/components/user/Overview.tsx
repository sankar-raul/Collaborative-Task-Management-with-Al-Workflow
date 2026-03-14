import React, { useState } from 'react';
import { Mail, Phone, Briefcase, MapPin, Edit2, ChevronRight, X } from 'lucide-react';
import { api } from '../../utils/api';
import type { Task } from '../../@types/interface/TasksInterface';
import type { Project } from '../../@types/interface/ProjectInterface';

interface OverviewProps {
    user: any;
    tasks: Task[];
    projects: Project[];
    taskStats: {
        assigned: number;
        inProgress: number;
        inReview: number;
        completed: number;
        overdue: number;
    };
    onUserUpdate?: (updatedUser: any) => void;
}

const Overview: React.FC<OverviewProps> = ({ user, tasks, projects, taskStats, onUserUpdate }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [editForm, setEditForm] = useState({
        name: user.name || '',
        skills: user.skills ? user.skills.join(', ') : ''
    });

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            const skillsArray = editForm.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
            const res = await api.members.updateMe({ name: editForm.name, skills: skillsArray });
            if (res.success) {
                if (onUserUpdate) onUserUpdate(res.data);
                setIsEditModalOpen(false);
            } else {
                alert("Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {/* Left Column - Employee Overview */}
            <div className="lg:col-span-12 xl:col-span-5 bg-card border border-border shadow-sm rounded-3xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-foreground">Employee Overview</h3>
                    <button
                        onClick={() => {
                            setEditForm({ name: user.name || '', skills: user.skills ? user.skills.join(', ') : '' });
                            setIsEditModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl text-sm font-bold transition-all border border-primary/10"
                    >
                        <Edit2 className="w-4 h-4" /> Edit
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="bg-secondary p-3 rounded-2xl">
                            <Mail className="w-5 h-5 text-muted-foreground/60" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">{user.email}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Mail Address</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-secondary p-3 rounded-2xl">
                            <Phone className="w-5 h-5 text-muted-foreground/60" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">+91 87054 85673</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Phone Number </p>
                        </div>
                    </div>


                    <div className="flex items-start gap-4">
                        <div className="bg-secondary p-3 rounded-2xl">
                            <Briefcase className="w-5 h-5 text-muted-foreground/60" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Product Development</p>
                            <p className="text-xs text-muted-foreground mt-0.5">January 2024</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="bg-secondary p-3 rounded-2xl">
                            <MapPin className="w-5 h-5 text-muted-foreground/60" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-foreground">Kolkata, WB</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Current Location</p>
                        </div>
                    </div>
                </div>

                {/* Skills Section Integrated */}
                <div className="mt-8 pt-8 border-t border-border/50">
                    <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-4">Expertise & Skills</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.skills?.map((skill: string, i: number) => (
                            <span
                                key={i}
                                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-primary/10 text-primary border border-primary/20"
                            >
                                {skill}
                            </span>
                        ))}
                        {(!user.skills || user.skills.length === 0) && (
                            <p className="text-xs text-muted-foreground italic">No skills listed.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column - Stats and Projects */}
            <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                {/* Task Overview Card */}
                <div className="bg-card border border-border shadow-sm rounded-3xl p-8">
                    <h3 className="text-xl font-bold text-foreground mb-8">Task Overview</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {[
                            { label: 'Assigned', count: taskStats.assigned, color: 'text-blue-500' },
                            { label: 'In Progress', count: taskStats.inProgress, color: 'text-indigo-500' },
                            { label: 'In Review', count: taskStats.inReview, color: 'text-purple-500' },
                            { label: 'Completed', count: taskStats.completed, color: 'text-emerald-500' },
                            { label: 'Overdue', count: taskStats.overdue, color: 'text-rose-500' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center group cursor-default">
                                <p className={`text-2xl font-black mb-1 transition-transform group-hover:scale-110 ${stat.color}`}>{stat.count}</p>
                                <p className="text-[10px] md:text-sm font-bold text-muted-foreground uppercase tracking-tight">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Project Membership Card */}
                <div className="bg-card border border-border shadow-sm rounded-3xl p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-foreground">Project Membership</h3>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 space-y-6 w-full">
                            {projects.length > 0 ? (
                                projects.slice(0, 3).map((project, idx) => {
                                    const userMember = project.members.find((m: any) => m.user._id === user._id || m.user === user._id);
                                    const colors = ['bg-purple-500', 'bg-cyan-500', 'bg-orange-500'];

                                    return (
                                        <div key={project._id} className="flex items-center gap-4 group cursor-pointer">
                                            <div className={`w-2 h-2 rounded-full ${colors[idx % 3]}`}></div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-foreground transition-colors group-hover:text-primary">{project.projectName}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{userMember?.role || 'Member'}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground italic">No project memberships found.</p>
                            )}
                            <p className="text-xs text-muted-foreground pt-4 border-t border-border/50 flex items-center gap-1">
                                Tasks · count <span className="font-bold text-foreground">{tasks.length}</span>
                            </p>
                        </div>

                        {/* Chart Placeholder */}
                        <div className="relative w-40 h-40 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 drop-shadow-sm">
                                <path
                                    className="text-secondary"
                                    strokeDasharray="100, 100"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                />
                                <path
                                    className="text-primary"
                                    strokeDasharray={`${Math.min(100, (tasks.length / 10) * 100)}, 100`}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.8"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-foreground leading-none">{projects.length}</span>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 animate-in zoom-in-95 duration-200 border border-border">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-foreground">Edit Profile</h3>
                            <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all text-foreground"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-border/50 bg-secondary text-muted-foreground/60 outline-none cursor-not-allowed"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">Email address cannot be changed</p>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-muted-foreground mb-2">Skills</label>
                                <input
                                    type="text"
                                    value={editForm.skills}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, skills: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all text-foreground"
                                    placeholder="e.g. React, Node.js, Design (comma separated)"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="flex-1 py-3 bg-secondary text-sm font-bold text-foreground hover:bg-secondary/80 rounded-xl border border-border transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="flex-1 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:opacity-90 transition-all shadow-md shadow-primary/10 active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Overview;
