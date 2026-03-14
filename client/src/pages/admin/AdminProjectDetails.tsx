import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Plus, LayoutGrid, Users, Settings } from "lucide-react";
import { api } from "../../utils/api";

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
        requiredSkills: [],
        assignedTo: "",
        deadline: "",
        status: "To Do" as any,
        estimatedTime: 0
    });

    const wrapAction = (action: (...args: any[]) => Promise<any>) => async (...args: any[]) => {
        const res = await action(...args);
        if (res && !res.success) alert(res.message);
        return res;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary/20 border-b-primary"></div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="p-8 max-w-6xl mx-auto space-y-6">
                <button
                    onClick={() => navigate("/admin/projects")}
                    className="flex items-center text-muted-foreground hover:text-foreground font-black text-xs uppercase tracking-widest transition-all"
                >
                    <ArrowLeft className="w-5 h-5 mr-3" />
                    Return to Projects
                </button>
                <div className="p-10 bg-rose-500/10 text-rose-500 rounded-[2rem] border border-rose-500/20 font-bold shadow-sm">
                    {error || "Project resource not found or decommissioned."}
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto min-h-screen space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <button
                onClick={() => navigate("/admin/projects")}
                className="flex items-center text-muted-foreground hover:text-foreground font-bold text-[10px] uppercase tracking-[0.2em] transition-all group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Project Master Registry
            </button>

            <ProjectHeader
                project={project}
                taskCount={tasks.length}
                showActions={true}
                onEdit={() => setIsEditProjectModalOpen(true)}
                onDelete={() => setIsDeleteProjectModalOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/20">
                                    <LayoutGrid className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-[800] text-foreground tracking-[-0.02em]">Project Backlog</h3>
                                    <p className="text-[9px] uppercase font-black tracking-[0.25em] text-muted-foreground/30 mt-1">Vector Management Protocol</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="flex items-center gap-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-6 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-orange-500/20"
                            >
                                <Plus size={18} /> Deploy New Task
                            </button>
                        </div>

                        {tasks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/40 rounded-3xl bg-muted/20">
                                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-5">
                                    <Settings className="w-8 h-8 text-muted-foreground/30 animate-spin-slow" />
                                </div>
                                <p className="text-lg font-bold text-foreground mb-1 tracking-tight">Operational Registry Clear</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Initialize the first vector to begin deployment</p>
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

                <div className="lg:col-span-4 space-y-8">
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
                        onApprove={async (id) => {
                            const res = await api.members.approveMember(id);
                            if (res.success) window.location.reload(); // Quick fix to refresh data if useProjectData doesn't expose refresh
                        }}
                        onReject={async (id) => {
                            if (!window.confirm("Reject this member's registration?")) return;
                            const res = await api.members.rejectMember(id);
                            if (res.success) window.location.reload();
                        }}
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
                        requiredSkills: newTask.requiredSkills || [],
                        deadline: newTask.deadline ? new Date(newTask.deadline).toISOString() : undefined
                    };
                    const res = await handleCreateTask(taskData);
                    if (res?.success) {
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
