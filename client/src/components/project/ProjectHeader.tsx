import {
    CheckCircle2,
    Users,
    CheckCircle,
    SquarePen,
    Trash2,
    Briefcase
} from "lucide-react";
import type { Project } from "../../@types/interface/ProjectInterface";

interface ProjectHeaderProps {
    project: Project;
    taskCount: number;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

export const ProjectHeader = ({
    project,
    taskCount,
    onEdit,
    onDelete,
    showActions = false
}: ProjectHeaderProps) => {
    return (
        <div className="bg-card border border-border shadow-sm rounded-3xl p-8 mb-8 relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            {showActions && (
                <div className="absolute top-6 right-8 flex gap-3 z-30">
                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(); }}
                            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-card border border-border shadow-md text-muted-foreground hover:text-primary hover:border-primary/30 rounded-xl transition-all active:scale-90"
                            title="Edit Project"
                        >
                            <SquarePen className="w-5 h-5" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(); }}
                            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-card border border-border shadow-md text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 rounded-xl transition-all active:scale-90"
                            title="Delete Project"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            )}

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 shadow-sm w-fit">
                        <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-[800] text-foreground tracking-[-0.04em] leading-[1.1] mb-1">
                            {project.projectName}
                        </h1>
                        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed font-medium tracking-tight">
                            {project.description || "No project description provided"}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-8">
                    <div className="flex items-center gap-2.5 bg-emerald-500/10 px-4 py-2 rounded-2xl text-emerald-500 font-bold border border-emerald-500/20 text-sm shadow-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="capitalize">
                            {project.status || "In Progress"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 bg-blue-500/10 px-4 py-2 rounded-2xl text-blue-500 font-bold border border-blue-500/20 text-sm shadow-xs">
                        <Users className="w-4 h-4" />
                        <span>
                            {project.members?.length || 0} Members
                        </span>
                    </div>

                    <div className="flex items-center gap-2.5 bg-primary/10 px-4 py-2 rounded-2xl text-primary font-bold border border-primary/20 text-sm shadow-xs">
                        <CheckCircle className="w-4 h-4" />
                        <span>
                            {taskCount} Tasks
                        </span>
                    </div>

                    {project.deadline && (
                        <div className="flex items-center gap-2.5 bg-amber-500/10 px-4 py-2 rounded-2xl text-amber-500 font-bold border border-amber-500/20 text-sm shadow-xs">
                            <span className="text-[10px] uppercase tracking-widest opacity-60">Deadline:</span>
                            <span>
                                {new Date(project.deadline).toLocaleDateString(undefined, {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
