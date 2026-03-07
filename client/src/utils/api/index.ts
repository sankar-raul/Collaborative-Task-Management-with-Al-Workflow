import { login, me, register } from "./auth/auth.api";
import { getAllMembers, getMemberById, getAssignedProjects, searchMembers, updateMe } from "./members/members.api";
import { getProjects, createProject, getProjectById, deleteProject, updateProject, addProjectMember, removeProjectMember, updateProjectMemberRole } from "./projects/projects.api";
import { assignTask, changeTaskStatus, createTask, deleteTask, getAllTasks, getOverdueTasks, getTaskById, getTasksByProject, getTasksByUser, updateTask } from "./tasks/tasks.api";

export const api = {
    auth: {
        me,
        login,
        register
    },
    members: {
        getAllMembers,
        getMemberById,
        getAssignedProjects,
        searchMembers,
        updateMe
    },
    projects: {
        getProjects,
        createProject,
        getProjectById,
        deleteProject,
        updateProject,
        addProjectMember,
        removeProjectMember,
        updateProjectMemberRole
    },
    tasks: {
        createTask,
        getAllTasks,
        getTaskById,
        getTasksByProject,
        getTasksByUser,
        updateTask,
        deleteTask,
        changeTaskStatus,
        assignTask,
        getOverdueTasks
    }
};
