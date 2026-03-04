import React, { useState } from "react";
import { TASKS } from "../profileData";
import type { TaskItem } from "../profileData";
import { CheckCircle2, Clock, AlertCircle, Eye, Circle } from "lucide-react";

const STATUS_CONFIG: Record<
  TaskItem["status"],
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  "not-started": { label: "Not Started", icon: <Circle size={13} />, color: "text-gray-500", bg: "bg-gray-100" },
  "in-progress": { label: "In Progress", icon: <Clock size={13} />, color: "text-yellow-600", bg: "bg-yellow-50" },
  "under-review": { label: "Under Review", icon: <Eye size={13} />, color: "text-purple-600", bg: "bg-purple-50" },
  done: { label: "Done", icon: <CheckCircle2 size={13} />, color: "text-green-600", bg: "bg-green-50" },
  overdue: { label: "Overdue", icon: <AlertCircle size={13} />, color: "text-red-600", bg: "bg-red-50" },
};

const PRIORITY_COLOR: Record<TaskItem["priority"], string> = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-blue-400",
};

const ALL_STATUSES = ["all", "in-progress", "done", "overdue", "under-review", "not-started"] as const;

const TasksTab: React.FC = () => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? TASKS : TASKS.filter((t) => t.status === filter);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-gray-700">My Tasks</h3>
        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors ${
                filter === s
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s as TaskItem["status"]]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">No tasks found.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((task) => {
            const sc = STATUS_CONFIG[task.status];
            return (
              <li
                key={task.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className={`mt-0.5 shrink-0 ${sc.color}`}>{sc.icon}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <p className="text-xs text-gray-400">{task.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-6 sm:pl-0 shrink-0">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.color}`}
                  >
                    {sc.label}
                  </span>
                  <span className={`text-xs font-semibold capitalize ${PRIORITY_COLOR[task.priority]}`}>
                    {task.priority}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{task.due}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default TasksTab;
