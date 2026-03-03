import { Router } from "express";
import { getAsignedProjects, getUserProjectRole } from "../controllers/member.controller"

const memberRoute = Router()

memberRoute.get("/projects", getAsignedProjects) // get all projects assigned to the user
memberRoute.get("/projects/:id/role", getUserProjectRole) // get the role of the user in a specific project

export default memberRoute;