import { Router } from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, addProjectMember, removeProjectMember, getProjectMembers, updateProjectMemberRole } from "../controllers/project.controller";
import adminAuth from "../middleware/adminAuth";
import isValidProjectMember from "../middleware/isValidProjectMember";
import memberRoleMiddleware from "../middleware/memberRole.";
const projectRouter = Router();

projectRouter.post("/", adminAuth, createProject); // Only Admin can create a project
projectRouter.get("/", adminAuth, getProjects); // Admin can view all projects
projectRouter.get("/:id", isValidProjectMember, getProjectById); // Only project members can view project details
projectRouter.put("/:id", memberRoleMiddleware("Manager"), updateProject); // Only Managers and Admin can update project details
projectRouter.delete("/:id", adminAuth, deleteProject); // Only Admin can delete a project
projectRouter.post("/:id/members", memberRoleMiddleware("Manager"), addProjectMember); // Only Managers and Admin can add members to a project
projectRouter.delete("/:id/members", memberRoleMiddleware("Manager"), removeProjectMember); // Only Managers and Admin can remove members from a project
projectRouter.get("/:id/members", isValidProjectMember, getProjectMembers) // Only project members can view project members
projectRouter.put("/:id/members", adminAuth, updateProjectMemberRole) // Only Admin can update project member roles

export default projectRouter;