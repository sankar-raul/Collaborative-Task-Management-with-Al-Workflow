import React from "react";
import type { KanbanColumn as KanbanColumnType } from "./kanbanData";
import TaskCard from "./TaskCard";
import { MoreHorizontal, Plus } from "lucide-react";

interface KanbanColumnProps {
  column: KanbanColumnType;
  showAddTask?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  showAddTask = false,
}) => {
  return (
    <div className="flex flex-col gap-3 min-w-0 w-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
          <h3 className="text-sm font-semibold text-gray-700">
            {column.title}
          </h3>
          <span className="text-xs font-medium text-gray-400">
            ({column.tasks.length})
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100">
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Add Task button (shown for first column) */}
      {showAddTask && (
        <button className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-dashed border-indigo-200 text-indigo-500 text-sm font-medium hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
          <Plus size={15} />
          Add Task
        </button>
      )}

      {/* Task cards */}
      <div className="flex flex-col gap-3">
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
