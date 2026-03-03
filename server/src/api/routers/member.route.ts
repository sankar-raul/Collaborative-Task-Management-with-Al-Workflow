import { Router } from "express";
import { getAllUsers, getAsignedProjects, getUserProjectRole } from "../controllers/member.controller"
import adminAuth from "../middleware/adminAuth";

const memberRoute = Router()

memberRoute.get("/projects", getAsignedProjects) // get all projects assigned to the user
memberRoute.get("/projects/:id/role", getUserProjectRole) // get the role of the user in a specific project
memberRoute.get("/all", adminAuth, getAllUsers) // get all users in the system with pagination

export default memberRoute;