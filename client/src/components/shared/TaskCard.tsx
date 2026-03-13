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
    Low: 'bg-gray-100 text-gray-700',
    Medium: 'bg-blue-50 text-blue-700',
    High: 'bg-red-50 text-red-700',
    Critical: 'bg-orange-50 text-orange-700'
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
            className={`rounded-2xl border bg-white p-4 transition-all ${
                isDragging ? 'border-indigo-200 shadow-md opacity-60' : 'border-gray-100 shadow-sm hover:shadow-md'
            } ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    {onTitleClick ? (
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                onTitleClick(task);
                            }}
                            className="font-bold text-gray-900 text-left cursor-alias hover:underline transition-colors"
                        >
                            {task.title}
                        </button>
                    ) : (
                        <p className="font-bold text-gray-900">{task.title}</p>
                    )}
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    )}
                </div>
                {showDragHandle && <GripVertical className="w-4 shrink-0 h-4 text-gray-300 mt-0.5" />}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${PRIORITY_CLASS[task.priority]}`}>
                    {task.priority}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${statusBadgeClass}`}>
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
    );
};

export default TaskCard;