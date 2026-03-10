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

const UserProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { member } = useAuth();
    const { systemUsers, isLoading: isLoadingUsers, error: usersError } = useUsers();

    const {
        project,
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
    const [memberToDelete, setMemberToDelete] = useState<any>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "Medium" as "Low" | "Medium" | "High" | "Critical",
        requiredSkills: [],
        assignedTo: "",
        deadline: "",
        status: "To Do" as any,
        estimatedTime: 0
    });

    const projectMember = project?.members?.find((m: any) => m.user?._id === member?.id);
    const isManager = projectMember?.role === "Manager" || member?.role === "Admin";

    const wrapAction = (action: (...args: any[]) => Promise<any>) => async (...args: any[]) => {
        const res = await action(...args);
        if (res && !res.success) alert(res.message);
        return res;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 mb-6">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back
                </button>
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 italic">
                    {error || "Project not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="px-8 py-3 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
            </button>

            <ProjectHeader
                project={project}
                taskCount={tasks.length}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mt-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                            {isManager && (
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-100 active:scale-95"
                                >
                                    <Plus size={18} /> Create Task
                                </button>
                            )}
                        </div>

                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                                <p className="text-sm font-medium">No tasks created</p>
                                <p className="text-xs mt-1">Tasks will appear here when added</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
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
                        members={project.members}
                        isManager={isManager}
                        actionLoading={actionLoading}
                        currentUserId={member?.id}
                        onAdd={isManager ? () => setIsAddMemberModalOpen(true) : undefined}
                        onRemove={isManager ? (memberItem) => {
                            setMemberToDelete(memberItem);
                            setIsDeleteMemberModalOpen(true);
                        } : undefined}
                        onUpdateRole={isManager ? wrapAction(handleUpdateMemberRole) : undefined}
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
                    const taskData = {
                        ...newTask,
                        requiredSkills: newTask.requiredSkills || [],
                        deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : undefined
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
                            estimatedTime: 0
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
