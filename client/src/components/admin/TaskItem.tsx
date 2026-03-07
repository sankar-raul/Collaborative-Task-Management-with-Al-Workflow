import React, { useState, useRef, useEffect } from "react";
import { Clock, Edit2, Trash2, MoreVertical } from "lucide-react";
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
        <div className="border border-gray-400 rounded-xl p-5 hover:bg-gray-50 transition group relative">
            {/* Title + Priority */}
            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-base font-semibold ${task.status === 'Completed' ? 'text-green-600' : 'text-gray-900'}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1">
                            {task.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                            ${task.priority === "Low"
                                ? "bg-green-100 text-green-700"
                                : task.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : task.priority === "High"
                                        ? "bg-orange-100 text-orange-700"
                                        : task.priority === "Critical"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {task.priority}
                    </span>

                    {showActions && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                title="Task Actions"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-150 origin-top-right">
                                    <button
                                        onClick={() => {
                                            onEdit(task);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 size={16} /> Edit Task
                                    </button>
                                    <div className="h-px bg-gray-50 my-1 mx-2" />
                                    <button
                                        onClick={() => {
                                            onDelete(task._id);
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 size={16} /> Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Skills */}
            {task.requiredSkills?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {task.requiredSkills.map((skill, index) => (
                        <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer Info */}
            <div className="flex justify-between items-center mt-4 text-xs text-gray-500">
                {/* Assigned User */}
                <div>
                    Assigned to:{" "}
                    <span className="font-medium text-gray-700">
                        {assignedMember?.user?.name || "Unassigned"}
                    </span>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "No deadline"}
                </div>
            </div>
        </div>
    );
};
