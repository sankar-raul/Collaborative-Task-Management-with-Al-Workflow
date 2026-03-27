import { login, me, register } from "./auth/auth.api";
import { getAllMembers, getMemberById, getAssignedProjects, searchMembers, updateMe, approveMember, rejectMember } from "./members/members.api";
import { getProjects, createProject, getProjectById, deleteProject, updateProject, addProjectMember, removeProjectMember, updateProjectMemberRole, uploadPdf, createProjectByAI, getProjectMembers } from "./projects/projects.api";
import { assignTask, changeTaskStatus, createTask, deleteTask, getAllTasks, getOverdueTasks, getRanking, getTaskById, getTasksByProject, getTasksByUser, updateTask } from "./tasks/tasks.api";
import { createStack, deleteStack, getAllStacks, updateStack } from "./stack/stack.api";

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
        updateMe,
        approveMember,
        rejectMember
    },
    projects: {
        getProjects,
        createProject,
        getProjectById,
        deleteProject,
        updateProject,
        addProjectMember,
        removeProjectMember,
        updateProjectMemberRole,
        uploadPdf,
        createProjectByAI,
        getProjectMembers
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
        getOverdueTasks,
        getRanking
    },
    stack: {
        createStack,
        deleteStack,
        getAllStacks,
        updateStack
    }
};
