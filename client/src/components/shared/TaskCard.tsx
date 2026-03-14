import React from 'react';
import { Calendar, Clock3, GripVertical } from 'lucide-react';
import type { Task } from '../../@types/interface/TasksInterface';

interface TaskCardProps {
    task: Task;
    statusBadgeClass: string;
    onTitleClick?: (task: Task) => void;
    draggable?: boolean;
    isDragging?: boolean;
    showDragHandle?: boolean;
    onDragStart?: React.DragEventHandler<HTMLElement>;
    onDragEnd?: React.DragEventHandler<HTMLElement>;
}

const PRIORITY_CLASS: Record<Task['priority'], string> = {
    Low: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
    High: 'bg-rose-500/10 text-rose-500 border border-rose-500/20',
    Critical: 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
};

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    statusBadgeClass,
    onTitleClick,
    draggable = false,
    isDragging = false,
    showDragHandle = false,
    onDragStart,
    onDragEnd
}) => {
    return (
        <article
            draggable={draggable}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className={`rounded-2xl border bg-card p-4 transition-all ${
                isDragging ? 'border-primary ring-4 ring-primary/10 opacity-60' : 'border-border/60 shadow-xs hover:shadow-md hover:border-border'
            } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    {onTitleClick ? (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onTitleClick(task);
                            }}
                            className="font-bold text-foreground text-left cursor-alias hover:text-primary transition-colors line-clamp-1"
                        >
                            {task.title}
                        </button>
                    ) : (
                        <p className="font-bold text-foreground line-clamp-1">{task.title}</p>
                    )}
                    {task.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                    )}
                </div>
                {showDragHandle && <GripVertical className="w-4 shrink-0 h-4 text-muted-foreground/30 mt-0.5" />}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider ${PRIORITY_CLASS[task.priority]}`}>
                    {task.priority}
                </span>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider border border-current/20 ${statusBadgeClass}`}>
                    {task.status}
                </span>
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary/60" />
                    {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No deadline'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="w-3.5 h-3.5 text-primary/60" />
                    {task.eastimatedTime ? `${task.eastimatedTime}h` : 'N/A'}
                </span>
            </div>
        </article>
    );
};

export default TaskCard;