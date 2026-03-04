import KanbanBoard from "../../components/kanban/KanbanBoard";

export const TeamWorkload = () => {
  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 h-full min-h-0">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Team Workload
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Monitor team workload and manage active tasks across all stages.
        </p>
      </div>

      {/* Kanban board */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
};

