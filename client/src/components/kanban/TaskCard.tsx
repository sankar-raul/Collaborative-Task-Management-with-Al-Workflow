import React from "react";
import type { Task } from "./kanbanData";
import TaskTag from "./TaskTag";
import AvatarStack from "./AvatarStack";
import { CheckCircle2, ChevronsUp, Plus } from "lucide-react";

interface TaskCardProps {
  task: Task;
}

const STATUS_LABEL: Record<Task["status"], string> = {
  "not-started": "Not started yet",
  "in-progress": "", // shown as progress bar
  "under-review": "Under Review",
  done: "Task finished",
};

function getProgressColor(pct: number): string {
  if (pct <= 33) return "bg-red-400";
  if (pct <= 66) return "bg-orange-400";
  return "bg-yellow-400";
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const statusLabel = STATUS_LABEL[task.status];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      {/* Tags row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {task.tags.map((tag, i) => (
          <TaskTag key={i} label={tag.label} color={tag.color} />
        ))}
        <button className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors">
          <Plus size={11} />
        </button>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-gray-800 leading-snug">
        {task.title}
      </p>

      {/* Status / progress */}
      {task.status === "in-progress" && task.progress !== undefined ? (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500">{task.progress}% completed</span>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getProgressColor(task.progress)} transition-all duration-300`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <span className="text-xs text-gray-400">{statusLabel}</span>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <button
            title={task.completed ? "Completed" : "Mark complete"}
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
              task.completed
                ? "text-green-500"
                : "text-gray-300 hover:text-indigo-400"
            }`}
          >
            <CheckCircle2 size={18} />
          </button>
          <button
            title="High priority"
            className="text-red-400 hover:text-red-500 transition-colors"
          >
            <ChevronsUp size={18} />
          </button>
        </div>
        <AvatarStack avatars={task.avatars} extra={task.extraAvatars} />
      </div>
    </div>
  );
};

export default TaskCard;
