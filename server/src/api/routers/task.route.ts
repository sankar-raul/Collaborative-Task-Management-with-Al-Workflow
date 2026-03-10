import { Router } from "express";
import { createTask, getTaskById, updateTask, deleteTask, changeTaskStatus, getTasksByProjectId, getMemberRanking, getTasksByUserId, getOverdueTasks, assignTask, getAllTasks } from "../controllers/task.controller";
import memberRoleMiddlewareTask from "../middleware/memberRoleTask";
import adminAuth from "../middleware/adminAuth";
const taskRoute = Router()

taskRoute.post("/", memberRoleMiddlewareTask("Manager"), createTask) // Create a new task, only Managers and Admin can create tasks
taskRoute.get("/overdue", adminAuth, getOverdueTasks) // Get all overdue tasks for the authenticated user, only Admin can view overdue tasks
taskRoute.get("/get-all", getAllTasks) // Get all tasks assigned to the authenticated user
taskRoute.get("/project/:projectId", getTasksByProjectId) // Get all tasks for a specific project
taskRoute.get("/user/:userId", getTasksByUserId) // Get all tasks assigned to a specific user
taskRoute.get("/:id", getTaskById) // Get task details by ID, only project members and Admin can view task details
taskRoute.put("/:id", memberRoleMiddlewareTask("Manager"), updateTask) // Update task details by ID, only Managers and Admin can update task details
taskRoute.delete("/:id", memberRoleMiddlewareTask("Manager"), deleteTask) // Delete a task by ID, only Managers and Admin can delete tasks
taskRoute.put("/:id/status", changeTaskStatus) // Change task status by ID
taskRoute.put("/:id/assign", memberRoleMiddlewareTask("Manager"), assignTask) // Assign a task to a user by ID
taskRoute.get("/:projectId/ranking", memberRoleMiddlewareTask("Manager"), getMemberRanking)

export default taskRoute;