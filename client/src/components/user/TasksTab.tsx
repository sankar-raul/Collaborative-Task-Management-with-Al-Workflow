import React, { useMemo, useState } from 'react';
import { Briefcase, GripVertical, Circle, X, Calendar, Clock3 } from 'lucide-react';
import type { Task } from '../../@types/interface/TasksInterface';
import TaskCard from '../shared/TaskCard';

interface TasksTabProps {
    tasks: Task[];
    onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
}

type BoardStatus = 'To Do' | 'In Progress' | 'In Review' | 'Completed';

const STATUS_COLUMNS: Array<{
    key: BoardStatus;
    title: string;
    hint: string;
    ringClass: string;
    badgeClass: string;
}> = [
        {
            key: 'To Do',
            title: 'Todo',
            hint: "This item hasn't been started",
            ringClass: 'ring-emerald-400',
            badgeClass: 'text-emerald-500 bg-emerald-500/10'
        },
        {
            key: 'In Progress',
            title: 'In Progress',
            hint: 'This is actively being worked on',
            ringClass: 'ring-amber-400',
            badgeClass: 'text-amber-500 bg-amber-500/10'
        },
        {
            key: 'In Review',
            title: 'In Review',
            hint: 'Task is in review',
            ringClass: 'ring-sky-400',
            badgeClass: 'text-sky-500 bg-sky-500/10'
        },
        {
            key: 'Completed',
            title: 'Done',
            hint: 'This has been completed',
            ringClass: 'ring-violet-400',
            badgeClass: 'text-violet-500 bg-violet-500/10'
        }
    ];

const TasksTab: React.FC<TasksTabProps> = ({ tasks, onStatusChange }) => {
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [activeDropStatus, setActiveDropStatus] = useState<BoardStatus | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const boardTasks = useMemo(() => {
        const byStatus: Record<BoardStatus, Task[]> = {
            'To Do': [],
            'In Progress': [],
            'In Review': [],
            'Completed': []
        };

        tasks.forEach((task) => {
            // Keep existing "Assigned" state visible under Todo while preserving backend status.
            const bucket: BoardStatus = task.status === 'Assigned' ? 'To Do' : (task.status as BoardStatus);
            byStatus[bucket].push(task);
        });

        return byStatus;
    }, [tasks]);

    const handleDrop = (targetStatus: BoardStatus) => {
        if (!draggedTaskId || !onStatusChange) {
            setActiveDropStatus(null);
            return;
        }

        const task = tasks.find((item) => item._id === draggedTaskId);
        if (!task) {
            setDraggedTaskId(null);
            setActiveDropStatus(null);
            return;
        }

        const normalizedCurrent = task.status === 'Assigned' ? 'To Do' : task.status;
        if (normalizedCurrent !== targetStatus) {
            onStatusChange(draggedTaskId, targetStatus);
        }

        setDraggedTaskId(null);
        setActiveDropStatus(null);
    };

    return (
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 h-full overflow-hidden grid grid-rows-[max-content_1fr]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground tracking-tight">Assigned Tasks</h3>
                <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold">
                    {tasks.length} Total
                </span>
            </div>

            {tasks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-hidden custom-scrollbar pr-1">
                    {STATUS_COLUMNS.map((column) => {
                        const columnTasks = boardTasks[column.key];

                        return (
                            <section
                                key={column.key}
                                onDragOver={(event) => {
                                    if (!onStatusChange) return;
                                    event.preventDefault();
                                    setActiveDropStatus(column.key);
                                }}
                                onDragLeave={() => setActiveDropStatus((current) => (current === column.key ? null : current))}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    handleDrop(column.key);
                                }}
                                className={`rounded-3xl select-none bg-card/50 border p-4 transition-all min-h-[400px] overflow-y-auto flex flex-col ${
                                    activeDropStatus === column.key
                                        ? 'border-primary ring-4 ring-primary/5 bg-primary/5'
                                        : 'border-border'
                                }`}
                            >
                                <header className="pb-4 mb-4 border-b border-border/50 sticky top-0 bg-card/80 backdrop-blur-sm shadow-xs rounded-2xl p-4 z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Circle className={`w-3 h-3 fill-current ${column.ringClass.replace('ring-', 'text-')}`} />
                                            <h4 className="text-lg font-bold text-foreground">{column.title}</h4>
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                    <p className="text-[11px] font-medium text-muted-foreground mt-1.5 uppercase tracking-wide">{column.hint}</p>
                                </header>

                                <div className="space-y-3 flex-1">
                                    {columnTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            statusBadgeClass={column.badgeClass}
                                            onTitleClick={setSelectedTask}
                                            draggable={Boolean(onStatusChange)}
                                            isDragging={draggedTaskId === task._id}
                                            showDragHandle={Boolean(onStatusChange)}
                                            onDragStart={() => setDraggedTaskId(task._id)}
                                            onDragEnd={() => {
                                                setDraggedTaskId(null);
                                                setActiveDropStatus(null);
                                            }}
                                        />
                                    ))}

                                    {columnTasks.length === 0 && (
                                        <div className="h-full min-h-[100px] flex items-center justify-center rounded-2xl border border-dashed border-border/60 bg-secondary/30 p-6 text-center text-xs text-muted-foreground">
                                            Drop tasks here
                                        </div>
                                    )}
                                </div>
                            </section>
                        );
                    })}
                </div>
            )}

            {tasks.length === 0 && (
                <div className="text-center py-20 bg-secondary/50 rounded-3xl border border-dashed border-border/60">
                    <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No tasks found for your account.</p>
                </div>
            )}

            {tasks.length > 0 && onStatusChange && (
                <div className="text-xs text-muted-foreground flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4 mt-2">
                    <GripVertical className="w-4 h-4 text-primary" />
                    <p className="font-medium">Drag a task card and drop it into another column to change status.</p>
                </div>
            )}

            {selectedTask && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
                    onClick={() => setSelectedTask(null)}
                >
                    <div
                        className="w-full max-w-xl bg-card rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="px-8 py-6 border-b border-border/50 flex items-start justify-between gap-4 bg-linear-to-r from-secondary/30 to-card">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Task Overview</p>
                                <h4 className="text-2xl font-bold text-foreground tracking-tight">{selectedTask.title}</h4>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="p-2 w-10 h-10 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Description</p>
                                <div className="bg-secondary/40 p-5 rounded-2xl border border-border/30">
                                    <p className="text-foreground leading-relaxed">
                                        {selectedTask.description || 'No description provided.'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-border bg-secondary/30 p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Priority</p>
                                    <p className="font-bold text-foreground flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${
                                            selectedTask.priority === 'High' ? 'bg-rose-500' : 
                                            selectedTask.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'
                                        }`} />
                                        {selectedTask.priority}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-border bg-secondary/30 p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-2">Status</p>
                                    <p className="font-bold text-foreground">{selectedTask.status}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">Deadline</p>
                                    <div className="inline-flex items-center gap-3 text-foreground font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Calendar className="w-4 h-4 text-primary" />
                                        </div>
                                        {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'No deadline'}
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-border bg-card p-5">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-3">Estimated Time</p>
                                    <div className="inline-flex items-center gap-3 text-foreground font-medium">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Clock3 className="w-4 h-4 text-primary" />
                                        </div>
                                        {selectedTask.eastimatedTime ? `${selectedTask.eastimatedTime} hours` : 'No estimate'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">Required Expertise</p>
                                {selectedTask.requiredSkills?.length ? (
                                    <div className="flex flex-wrap gap-2.5">
                                        {selectedTask.requiredSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-4 py-2 rounded-xl text-xs font-bold bg-primary/10 text-primary border border-primary/20"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground/60 italic text-xs">No specific skills listed for this task.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksTab;
