import React, { useMemo, useState } from 'react';
import { Calendar, Briefcase, Clock3, GripVertical, Circle } from 'lucide-react';
import type { Task } from '../../@types/interface/TasksInterface';

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
            badgeClass: 'text-emerald-700 bg-emerald-50'
        },
        {
            key: 'In Progress',
            title: 'In Progress',
            hint: 'This is actively being worked on',
            ringClass: 'ring-amber-400',
            badgeClass: 'text-amber-700 bg-amber-50'
        },
        {
            key: 'In Review',
            title: 'In Review',
            hint: 'Task is in review',
            ringClass: 'ring-sky-400',
            badgeClass: 'text-sky-700 bg-sky-50'
        },
        {
            key: 'Completed',
            title: 'Done',
            hint: 'This has been completed',
            ringClass: 'ring-violet-400',
            badgeClass: 'text-violet-700 bg-violet-50'
        }
    ];

const PRIORITY_CLASS: Record<Task['priority'], string> = {
    Low: 'bg-gray-100 text-gray-700',
    Medium: 'bg-blue-50 text-blue-700',
    High: 'bg-red-50 text-red-700',
    Critical: 'bg-orange-50 text-orange-700'
};

const TasksTab: React.FC<TasksTabProps> = ({ tasks, onStatusChange }) => {
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [activeDropStatus, setActiveDropStatus] = useState<BoardStatus | null>(null);

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
                <h3 className="text-xl font-bold text-gray-900">Assigned Tasks</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                    {tasks.length} Total
                </span>
            </div>

            {tasks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-auto scroll-smooth">
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
                                className={`rounded-3xl select-none bg-white border p-4 transition-colors min-h-110 [::-webkit-scrollbar]:bg-red-400 overflow-y-auto scroll-smooth ${
                                    activeDropStatus === column.key
                                        ? 'border-indigo-300 shadow-md shadow-indigo-100/60'
                                        : 'border-gray-100 shadow-sm'
                                }`}
                            >
                                <header className="pb-4 border-b border-gray-100 sticky top-0 bg-white shadow-xs rounded-2xl p-4 z-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Circle className={`w-4 h-4 ${column.ringClass}`} />
                                            <h4 className="text-xl font-bold text-gray-900">{column.title}</h4>
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 rounded-full px-2.5 py-1">
                                            {columnTasks.length}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{column.hint}</p>
                                </header>

                                <div className="mt-4 space-y-3 ">
                                    {columnTasks.map((task) => (
                                        <article
                                            key={task._id}
                                            draggable={Boolean(onStatusChange)}
                                            onDragStart={() => setDraggedTaskId(task._id)}
                                            onDragEnd={() => {
                                                setDraggedTaskId(null);
                                                setActiveDropStatus(null);
                                            }}
                                            className={`rounded-2xl border bg-white p-4 transition-all ${
                                                draggedTaskId === task._id ? 'border-indigo-200 shadow-md opacity-60' : 'border-gray-100 shadow-sm hover:shadow-md'
                                            } ${onStatusChange ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-bold text-gray-900">{task.title}</p>
                                                    {task.description && (
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                                                    )}
                                                </div>
                                                {onStatusChange && <GripVertical className="w-4 h-4 text-gray-300 mt-0.5" />}
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${PRIORITY_CLASS[task.priority]}`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${column.badgeClass}`}>
                                                    {task.status}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                                                <span className="inline-flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                                                </span>
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock3 className="w-3 h-3" />
                                                    {task.eastimatedTime ? `${task.eastimatedTime}h` : 'No estimate'}
                                                </span>
                                            </div>
                                        </article>
                                    ))}

                                    {columnTasks.length === 0 && (
                                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
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
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No tasks found for your account.</p>
                </div>
            )}

            {tasks.length > 0 && onStatusChange && (
                <div className="text-xs text-gray-500 flex items-center gap-2 bg-indigo-50/70 border border-indigo-100 rounded-2xl px-4 py-3">
                    <GripVertical className="w-4 h-4 text-indigo-500" />
                    Drag a task card and drop it into another column to change status.
                </div>
            )}
        </div>
    );
};

export default TasksTab;
