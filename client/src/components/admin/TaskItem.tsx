import React, { useState, useRef, useEffect } from "react";
import { Clock, Edit2, Trash2, MoreVertical, Hash, User as UserIcon } from "lucide-react";
import type { Task } from "../../@types/interface/TasksInterface";

interface TaskItemProps {
    task: Task;
    project: any;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    showActions?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, project, onEdit, onDelete, showActions = true }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const assignedMember = project?.members?.find(
        (m: any) => m.user?._id === task.assignedTo
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-[1.25rem] p-5 hover:bg-card hover:border-primary/30 transition-all duration-300 group relative shadow-xs hover:shadow-xl hover:shadow-primary/5">
            {/* Title + Priority */}
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.25em] bg-primary/10 px-2 py-0.5 rounded-md">Task</span>
                        <div className={`h-1.5 w-1.5 rounded-full ${task.status === 'Completed' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                    </div>
                    <p className={`text-[17px] font-[800] tracking-[-0.02em] ${task.status === 'Completed' ? 'text-emerald-500 line-through opacity-60' : 'text-foreground'}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-[11px] text-muted-foreground mt-1.5 font-medium leading-relaxed line-clamp-2 tracking-tight">
                            {task.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-[0.2em] border transition-all
                            ${task.priority === "Low"
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : task.priority === "Medium"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    : task.priority === "High"
                                        ? "bg-rose-500/10 text-rose-500 border-rose-500/20 font-bold"
                                        : task.priority === "Critical"
                                            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20 border-rose-600"
                                            : "bg-secondary text-muted-foreground border-border/50"
                            }`}
                    >
                        {task.priority}
                    </span>

                    {showActions && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                className="p-2 text-muted-foreground/40 hover:text-foreground hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-border/60"
                                title="Action Node"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-3 w-56 bg-card rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right backdrop-blur-xl">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit(task);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-black text-foreground hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all uppercase tracking-widest group/btn"
                                    >
                                        <Edit2 size={16} className="text-primary group-hover/btn:text-primary-foreground transition-colors" /> Mod Task
                                    </button>
                                    <div className="h-px bg-border/40 my-1 mx-2" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(task._id);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-5 py-3 text-xs font-black text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl transition-all uppercase tracking-widest group/btn"
                                    >
                                        <Trash2 size={16} /> Erase Data
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Skills */}
            {task.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                    {task.requiredSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="text-[9px] font-black bg-secondary/80 text-muted-foreground px-2.5 py-0.5 rounded-lg uppercase tracking-wider border border-border/40"
                        >
                            <Hash className="w-2.5 h-2.5 inline mr-1 opacity-40" />
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer Info */}
            <div className="flex justify-between items-end mt-6 pt-5 border-t border-border/40">
                {/* Assigned User */}
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                        <UserIcon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] leading-none mb-1">Operator</p>
                        <p className="text-[11px] font-bold text-foreground">
                            {assignedMember?.user?.name || "Unassigned"}
                        </p>
                    </div>
                </div>

                {/* Deadline */}
                <div className="flex flex-col items-end">
                    <p className="text-[8px] font-black text-muted-foreground/30 uppercase tracking-[0.25em] leading-none mb-1">Timeline</p>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground/80">
                        <Clock size={12} className="text-primary/60" />
                        {task.deadline
                            ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : "Undetermined"}
                    </div>
                </div>
            </div>
        </div>
    );
};
