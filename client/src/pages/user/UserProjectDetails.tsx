import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "../../context/auth";
import { useUsers } from "../../context/users";
import { ProjectModals } from "../../components/admin/ProjectModals";
import { TaskModals } from "../../components/admin/TaskModals";
import { TaskItem } from "../../components/admin/TaskItem";
import { useProjectData } from "../../hooks/useProjectData";
import { ProjectHeader } from "../../components/project/ProjectHeader";
import { TeamMembersList } from "../../components/project/TeamMembersList";
import type { Task } from "../../@types/interface/TasksInterface";
import type { IProjectMember } from "../../@types/interface/ProjectInterface";
import { api } from "../../utils/api";

const UserProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { member } = useAuth();
    const { systemUsers, isLoading: isLoadingUsers, error: usersError } = useUsers();

    const {
        project,
        members,
        tasks,
        loading,
        error,
        actionLoading,
        handleAddMember,
        handleRemoveMember,
        handleUpdateMemberRole,
        handleUpdateProject,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask
    } = useProjectData({ projectId: id });

    // Modals
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
    const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<IProjectMember | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [newTask, setNewTask] = useState<Partial<Task>>({
        title: "",
        description: "",
        priority: "Medium",
        requiredSkills: [],
        assignedTo: "",
        deadline: "",
        status: "To Do",
        eastimatedTime: 0
    });

    const projectMember = project?.members?.find((m: IProjectMember) => {
        const userId = typeof m.user === 'string' ? m.user : m.user?._id;
        return userId === member?._id;
    });
    const isManager = projectMember?.role === "Manager" || member?.role === "Admin";

    const wrapAction = <T extends unknown[], R>(action: (...args: T) => Promise<R>) => async (...args: T): Promise<R> => {
        const res = await action(...args);
        if (res && typeof res === 'object' && 'success' in res && !res.success && 'message' in res) {
            alert(String(res.message));
        }
        return res;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-bold gap-2">
                    <ArrowLeft className="w-5 h-5" /> Back
                </button>
                <div className="bg-rose-500/10 text-rose-500 p-8 rounded-3xl border border-rose-500/20 italic font-medium flex items-center justify-center shadow-xs">
                    {error || "Project not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-muted-foreground hover:text-foreground transition-all hover:-translate-x-1 font-bold gap-2">
                <ArrowLeft className="w-5 h-5" /> Back to Projects
            </button>

            <ProjectHeader
                project={project}
                taskCount={tasks.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-foreground">Recent Tasks</h3>
                                <p className="text-xs text-muted-foreground mt-1 font-medium">Manage and monitor progress of project tasks.</p>
                            </div>
                            {isManager && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-primary/10 active:scale-95 hover:opacity-90"
                                >
                                    <Plus size={18} /> Create Task
                                </button>
                            )}
                        </div>

                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center bg-secondary/30 rounded-2xl border border-dashed border-border/60">
                                <p className="text-sm font-bold text-foreground">No tasks created yet</p>
                                <p className="text-xs mt-1 text-muted-foreground">Tasks will appear here when you add them to the project.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tasks.map((task) => (
                                    <TaskItem
                                        key={task._id}
                                        task={task}
                                        project={project}
                                        onEdit={(task) => {
                                            setSelectedTask(task);
                                            setIsEditTaskModalOpen(true);
                                        }}
                                        onDelete={wrapAction(handleDeleteTask)}
                                        showActions={isManager}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <TeamMembersList
                        members={members}
                        isManager={isManager}
                        actionLoading={actionLoading}
                        currentUserId={member?._id}
                        onAdd={isManager ? () => setIsAddMemberModalOpen(true) : undefined}
                        onRemove={isManager ? (memberItem: IProjectMember) => {
                            setMemberToDelete(memberItem);
                            setIsDeleteMemberModalOpen(true);
                        } : undefined}
                        onUpdateRole={isManager ? async (userId: string, role: string) => {
                            await wrapAction(handleUpdateMemberRole)(userId, role);
                            return;
                        } : undefined}
                    />
                </div>
            </div>

            <ProjectModals
                project={project}
                isEditProjectModalOpen={isEditProjectModalOpen}
                setIsEditProjectModalOpen={setIsEditProjectModalOpen}
                isDeleteProjectModalOpen={isDeleteProjectModalOpen}
                setIsDeleteProjectModalOpen={setIsDeleteProjectModalOpen}
                isAddMemberModalOpen={isAddMemberModalOpen}
                setIsAddMemberModalOpen={setIsAddMemberModalOpen}
                isDeleteMemberModalOpen={isDeleteMemberModalOpen}
                setIsDeleteMemberModalOpen={setIsDeleteMemberModalOpen}
                memberToDelete={memberToDelete}
                handleUpdateProject={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const res = await handleUpdateProject({
                        projectName: formData.get("projectName") as string,
                        description: formData.get("description") as string,
                        status: formData.get("status") as string,
                    });
                    if (res && res.success) setIsEditProjectModalOpen(false);
                }}
                handleDeleteProject={async () => { navigate("/admin/projects") }}
                handleAddMember={async (userId, role) => {
                    const res = await handleAddMember(userId, role);
                    if (res && res.success) setIsAddMemberModalOpen(false);
                }}
                handleRemoveMember={async (userId) => {
                    const res = await handleRemoveMember(userId);
                    if (res && res.success) setIsDeleteMemberModalOpen(false);
                }}
                actionLoading={actionLoading}
                systemUsers={systemUsers}
                isLoadingUsers={isLoadingUsers}
                usersError={usersError}
                isManager={isManager}
                currentUser={member}
            />

            <TaskModals
                project={project}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                isEditTaskModalOpen={isEditTaskModalOpen}
                setIsEditTaskModalOpen={setIsEditTaskModalOpen}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                newTask={newTask}
                setNewTask={setNewTask}
                handleCreateTask={async (e) => {
                    e.preventDefault();
                    type CreationPayload = Omit<Parameters<typeof api.tasks.createTask>[0], 'projectId'>;
                    const taskData: CreationPayload = {
                        title: newTask.title || "",
                        priority: (newTask.priority || "Medium") as CreationPayload['priority'],
                        status: (newTask.status || "To Do") as CreationPayload['status'],
                        requiredSkills: newTask.requiredSkills || [],
                        description: newTask.description,
                        assignedTo: typeof newTask.assignedTo === 'string' ? newTask.assignedTo : undefined,
                        deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : undefined,
                        eastimatedTime: newTask.eastimatedTime
                    };
                    const res = await handleCreateTask(taskData);
                    if (res && res.success) {
                        setIsCreateModalOpen(false);
                        setNewTask({
                            title: "",
                            description: "",
                            priority: "Medium",
                            requiredSkills: [],
                            assignedTo: "",
                            deadline: "",
                            status: "To Do",
                            eastimatedTime: 0
                        });
                    }
                }}
                handleUpdateTask={async (taskId, taskData) => {
                    const res = await handleUpdateTask(taskId, taskData);
                    if (res && res.success) setIsEditTaskModalOpen(false);
                }}
                actionLoading={actionLoading}
                isManager={isManager}
                currentUser={member}
            />
        </div>
    );
};

export default UserProjectDetails;
