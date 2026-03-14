import TasksTab from "../../components/user/TasksTab";
import { useUserTasks } from "../../hooks/useUserTasks";

function KanbanSkeleton() {
    return (
        <div className="space-y-6 animate-pulse h-full overflow-hidden grid grid-rows-[max-content_1fr] pb-2">
            {/* Header */}
            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <div className="h-9 w-48 bg-muted rounded-xl" />
                    <div className="h-4 w-64 bg-muted/60 rounded-lg mt-2" />
                </div>
                <div className="h-10 w-32 bg-primary/10 rounded-xl" />
            </div>

            {/* Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, colIdx) => (
                    <div key={colIdx} className="rounded-[2.5rem] bg-card border border-border/50 shadow-sm p-6 min-h-[600px] h-full">
                        {/* Column header */}
                        <div className="pb-6 border-b border-border/40 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-muted" />
                                    <div className="h-7 w-32 bg-muted rounded-xl" />
                                </div>
                                <div className="h-6 w-9 bg-muted/50 rounded-lg" />
                            </div>
                            <div className="h-4 w-44 bg-muted/40 rounded-lg" />
                        </div>

                        {/* Cards */}
                        <div className="mt-6 space-y-4">
                            {Array.from({ length: colIdx === 0 ? 2 : colIdx === 3 ? 1 : colIdx === 2 ? 3 : 0 }).map((_, cardIdx) => (
                                <div key={cardIdx} className="rounded-2xl border border-border/40 bg-card p-5 space-y-4 shadow-xs">
                                    <div className="h-6 w-5/6 bg-muted rounded-lg" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-full bg-muted/60 rounded-lg" />
                                        <div className="h-4 w-4/5 bg-muted/60 rounded-lg" />
                                    </div>
                                    <div className="flex gap-2.5 pt-2">
                                        <div className="h-6 w-14 bg-muted/50 rounded-lg" />
                                        <div className="h-6 w-16 bg-muted/50 rounded-lg" />
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-border/20">
                                        <div className="h-4 w-24 bg-muted/40 rounded-lg" />
                                        <div className="h-4 w-16 bg-muted/40 rounded-lg" />
                                    </div>
                                </div>
                            ))}

                            {/* Empty drop zone placeholder when no cards */}
                            {colIdx !== 0 && colIdx !== 3 && colIdx !== 2 && (
                                <div className="rounded-3xl border-2 border-dashed border-border/30 bg-secondary/20 p-12 flex items-center justify-center">
                                    <div className="h-4 w-32 bg-muted/20 rounded-lg" />
                                </div>
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
        <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 h-full overflow-hidden p-6 md:p-0">
            {loading ? (
                <KanbanSkeleton />
            ) : (
                <TasksTab tasks={tasks} onStatusChange={updateTaskStatus} />
            )}
        </div>
    );
}
