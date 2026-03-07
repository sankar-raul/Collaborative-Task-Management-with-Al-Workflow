import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus } from "lucide-react";

import { useUsers } from "../../context/users";
import { ProjectModals } from "../../components/admin/ProjectModals";
import { TaskModals } from "../../components/admin/TaskModals";
import { TaskItem } from "../../components/admin/TaskItem";
import { useProjectData } from "../../hooks/useProjectData";
import { ProjectHeader } from "../../components/project/ProjectHeader";
import { TeamMembersList } from "../../components/project/TeamMembersList";
import type { Task } from "../../@types/interface/TasksInterface";

export const AdminProjectDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { systemUsers } = useUsers();

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
        handleDeleteProject,
        handleCreateTask,
        handleUpdateTask,
        handleDeleteTask
    } = useProjectData({ projectId: id });

    // Component Local State for Modals
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
    const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
    const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
    const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] = useState(false);
    const [isDeleteMemberModalOpen, setIsDeleteMemberModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<any>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        priority: "Medium" as "Low" | "Medium" | "High" | "Critical",
        requiredSkills: "",
        assignedTo: "",
        deadline: "",
        status: "To Do" as any
    });

    const wrapAction = (action: (...args: any[]) => Promise<any>) => async (...args: any[]) => {
        const res = await action(...args);
        if (res && !res.success) alert(res.message);
        return res;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <button
                    onClick={() => navigate("/admin/projects")}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Projects
                </button>
                <div className="p-6 bg-red-50 text-red-600 rounded-lg">
                    {error || "Project not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen">
            <button
                onClick={() => navigate("/admin/projects")}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back to Projects
            </button>

            <ProjectHeader
                project={project}
                taskCount={tasks.length}
                showActions={true}
                onEdit={() => setIsEditProjectModalOpen(true)}
                onDelete={() => setIsDeleteProjectModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-lg font-bold text-gray-900">Recent Tasks</h3>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
                            >
                                <Plus size={18} /> Create Task
                            </button>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                                <p className="text-sm font-bold text-gray-900">No tasks yet</p>
                                <p className="text-xs mt-1">Start by creating a task for the team</p>
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
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <TeamMembersList
                        members={project.members}
                        isManager={true}
                        actionLoading={actionLoading}
                        onAdd={() => setIsAddMemberModalOpen(true)}
                        onRemove={(member) => {
                            setMemberToDelete(member);
                            setIsDeleteMemberModalOpen(true);
                        }}
                        onUpdateRole={wrapAction(handleUpdateMemberRole)}
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
                    });
                    if (res && res.success) setIsEditProjectModalOpen(false);
                    else if (res) alert(res.message);
                }}
                handleDeleteProject={async () => {
                    const res = await handleDeleteProject();
                    if (res && res.success) navigate("/admin/projects");
                    else if (res) alert(res.message);
                }}
                handleAddMember={async (userId, role) => {
                    const res = await handleAddMember(userId, role);
                    if (res && res.success) setIsAddMemberModalOpen(false);
                    else if (res) alert(res.message);
                }}
                handleRemoveMember={async (userId) => {
                    const res = await handleRemoveMember(userId);
                    if (res && res.success) setIsDeleteMemberModalOpen(false);
                    else if (res) alert(res.message);
                }}
                actionLoading={actionLoading}
                systemUsers={systemUsers}
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
                        requiredSkills: newTask.requiredSkills.split(",").map(s => s.trim()).filter(s => s !== ""),
                        deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : undefined
                    };
                    const res = await handleCreateTask(taskData);
                    if (res?.success) {
                        setIsCreateModalOpen(false);
                        setNewTask({
                            title: "",
                            description: "",
                            priority: "Medium",
                            requiredSkills: "",
                            assignedTo: "",
                            deadline: "",
                            status: "To Do"
                        });
                    } else if (res) alert(res.message);
                }}
                handleUpdateTask={async (taskId, taskData) => {
                    const res = await handleUpdateTask(taskId, taskData);
                    if (res?.success) setIsEditTaskModalOpen(false);
                    else if (res) alert(res.message);
                }}
                actionLoading={actionLoading}
            />
        </div>
    );
};
