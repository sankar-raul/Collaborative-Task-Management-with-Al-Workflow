import TaskService from "@/services/task.service";
import { ITask } from "@/types/interface/task.interface";
import { Request, Response } from "express";

export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      deadline,
      projectId,
      requiredSkills,
      priority,
      status,
      assignedTo,
    } = req.body || ({} as Partial<ITask>);
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Title and Project ID are required" });
    }
    const task = await TaskService.createTask({
      title,
      description,
      projectId,
      deadline,
      requiredSkills,
      priority,
      status,
      assignedTo,
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const task = await TaskService.getTaskById(taskId);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const updates = req.body as Partial<ITask>;
    const updatedTask = await TaskService.updateTask(taskId, updates);
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;
    await TaskService.deleteTask(taskId);
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTasksByProjectId = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.projectId as string;
    const tasks = await TaskService.getTasksByProjectId(projectId);
    res.status(200).json({ success: true, data: tasks, total: tasks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTasksByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const tasks = await TaskService.getTasksByUserId(userId);
    res.status(200).json({ success: true, data: tasks, total: tasks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const { userId } = req.body as { userId: string };
    const updatedTask = await TaskService.assignTask(taskId, userId);
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeTaskStatus = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id as string;
    const { status } = req.body as { status: string };
    const updatedTask = await TaskService.changeTaskStatus(taskId, status);
    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOverdueTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskService.getOverdueTasks();
    res.status(200).json({ success: true, data: tasks, total: tasks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  console.log("op")
  const userId = req.user?.userId as string;
  try {
    const tasks = await TaskService.getTasksByUserId(userId);
    res.status(200).json({ success: true, data: tasks, total: tasks.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};