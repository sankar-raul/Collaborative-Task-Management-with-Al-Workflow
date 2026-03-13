import TasksTab from "../../components/user/TasksTab";
import { useUserTasks } from "../../hooks/useUserTasks";

function KanbanSkeleton() {
    return (
        <div className="space-y-4 animate-pulse h-full overflow-hidden grid grid-rows-[max-content_1fr] pb-2">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="h-7 w-40 bg-gray-200 rounded-lg" />
                <div className="h-6 w-16 bg-indigo-100 rounded-full" />
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, colIdx) => (
                    <div key={colIdx} className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4 min-h-110 h-full">
                        {/* Column header */}
                        <div className="pb-4 border-b border-gray-100 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 rounded-full bg-gray-200" />
                                    <div className="h-6 w-24 bg-gray-200 rounded-lg" />
                                </div>
                                <div className="h-5 w-7 bg-gray-100 rounded-full" />
                            </div>
                            <div className="h-4 w-36 bg-gray-100 rounded-md" />
                        </div>

                        {/* Cards */}
                        <div className="mt-4 space-y-3">
                            {Array.from({ length: colIdx === 0 ? 2 : colIdx === 3 ? 1 : colIdx === 2 ? 3 : 0 }).map((_, cardIdx) => (
                                <div key={cardIdx} className="rounded-2xl border border-gray-100 bg-white p-4 space-y-3">
                                    <div className="h-5 w-3/4 bg-gray-200 rounded-md" />
                                    <div className="h-4 w-full bg-gray-100 rounded-md" />
                                    <div className="flex gap-2">
                                        <div className="h-5 w-12 bg-gray-100 rounded-md" />
                                        <div className="h-5 w-14 bg-gray-100 rounded-md" />
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-4 w-20 bg-gray-100 rounded-md" />
                                        <div className="h-4 w-16 bg-gray-100 rounded-md" />
                                    </div>
                                </div>
                            ))}

                            {/* Empty drop zone placeholder when no cards */}
                            {colIdx !== 0 && colIdx !== 3 && colIdx !== 2 && (
                                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function UserTasks() {
    const { tasks, loading, updateTaskStatus } = useUserTasks();

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 h-full overflow-hidden">
            {loading ? (
                <KanbanSkeleton />
            ) : (
                <TasksTab tasks={tasks} onStatusChange={updateTaskStatus} />
            )}
        </div>
    );
}
