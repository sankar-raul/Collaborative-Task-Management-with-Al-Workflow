import { Router } from "express";
import { getAllUsers, getAsignedProjects, getUserProjectRole, getMemberById, getMyDetails, searchMembers, updateMember, approveUser, rejectUser } from "../controllers/member.controller"
import managerAdminAuth from "../middleware/managerAdminAuth";

const memberRoute = Router()

memberRoute.get("/projects", getAsignedProjects) // get all projects assigned to the user
memberRoute.get("/projects/:id/role", getUserProjectRole) // get the role of the user in a specific project
memberRoute.get("/all", getAllUsers) // get all users in the system with pagination
memberRoute.get("/me", getMyDetails) // get the details of the logged in user
memberRoute.put("/me", updateMember) // update the details of the logged in user
memberRoute.get("/search", searchMembers) // search for users by name or email with pagination
memberRoute.get("/:id", getMemberById) // get the details of a specific user by id
memberRoute.put("/:id/approve", managerAdminAuth, approveUser) // approve a user's registration (only for Manager and Admin)
memberRoute.put("/:id/reject", managerAdminAuth, rejectUser) // reject a user's registration (only for Manager and Admin)

export default memberRoute;