import TaskModel from "@/models/task/task.model";
import { ITask } from "@/types/interface/task.interface";
import ProjectService from "./project.service";
import { Types } from "mongoose";
import ProjectNotification from "@/socketService/projectUpdates";
import rankMembers from "@/utils/rankMembers";
import UserModel from "@/models/user/user.model";

class TaskService {
  static async createTask({
    title,
    description = "",
    status = "To Do",
    projectId,
    priority = "Medium",
    requiredSkills = [],
    assignedTo = null,
    deadline = null,
    eastimatedTime = 0,
  }: ITask) {
    try {
      const task = new TaskModel({
        title,
        description,
        status,
        projectId,
        priority,
        requiredSkills,
        eastimatedTime,
        ...(assignedTo && { assignedTo }),
        ...(deadline && { deadline }),
      });
      console.log(task)
      if (!assignedTo) {
        const rankedMembers = await rankMembers(task, 1);
        console.log(rankedMembers)
        const assignedUser = rankedMembers[0]?.user._id.toString() || null;
        task.assignedTo = assignedUser as unknown as Types.ObjectId;
      }
      await task.save();
      await ProjectNotification.taskAssigned(task, task.assignedTo as unknown as string);
      ProjectNotification.taskCreated(projectId as unknown as string, task);
      return task;
    } catch (error) {
      console.log(error.message);
      throw error.message || "Error creating task";
    }
  }

  static async getMemberRanking({ 
    priority,
    requiredSkills,
    projectId,
    eastimatedTime, // in hours
  } : Partial<ITask>) {
    const dummyTask = new TaskModel({
      priority,
      requiredSkills,
      projectId,
      eastimatedTime,
    });
    const rankedMembers = await rankMembers(dummyTask, -1);
    // console.log(rankedMembers)
    return rankedMembers;
  }

  static async getTaskById(taskId: string) {
    try {
      // Implement logic to fetch a task by its ID
      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      throw error.message || "Error fetching task by ID";
    }
  }

  static async updateTask(taskId: string, updates: Partial<ITask>) {
    try {
      // Implement logic to update a task by its ID
      const task = await TaskModel.findByIdAndUpdate(taskId, updates, {
        new: true,
      });
      if (!task) {
        throw new Error("Task not found");
      }
      ProjectNotification.taskUpdated(
        task.projectId as unknown as string,
        task,
      );
      return task;
    } catch (error) {
      throw error.message || "Error updating task";
    }
  }

  static async deleteTask(taskId: string) {
    try {
      // Implement logic to delete a task by its ID
      const task = await TaskModel.findByIdAndDelete(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      ProjectNotification.taskDeleted(
        task.projectId as unknown as string,
        taskId,
      );
      return task;
    } catch (error) {
      throw error.messgae || "Error deleting task";
    }
  }

  static async getTasksByProjectId(projectId: string) {
    try {
      // Implement logic to fetch all tasks for a specific project
      const tasks = await TaskModel.find({ projectId });
      return tasks;
    } catch (error) {
      throw error.message || "Error fetching tasks for project";
    }
  }

  static async assignTask(taskId: string, userId: string) {
    try {
      // Implement logic to assign a task to a user
      const task = await TaskModel.findByIdAndUpdate(
        taskId,
        { assignedTo: userId },
        { new: true },
      );
      if (!task) {
        throw new Error("Task not found");
      }
      const asignedUser = userId.toString();
      await ProjectNotification.taskAssigned(task, asignedUser);
      return task;
    } catch (error) {
      throw error.message || "Error assigning task";
    }
  }

  static async changeTaskStatus(taskId: string, status: string) {
    try {
      // Implement logic to change the status of a task
      const task = await TaskModel.findByIdAndUpdate(
        taskId,
        { status },
        { returnDocument: "after" },
      );
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      throw error.message || "Error changing task status";
    }
  }

  static async getTasksByUserId(userId: string) {
    try {
      // Implement logic to fetch all tasks assigned to a specific user
      const tasks = await TaskModel.find({ assignedTo: userId });
      return tasks;
    } catch (error) {
      throw error.message || "Error fetching tasks for user";
    }
  }

  static async getOverdueTasks() {
    try {
      // Implement logic to fetch all overdue tasks
      const now = new Date();
      const tasks = await TaskModel.find({
        deadline: { $lt: now },
        status: { $ne: "Done" },
      });
      return tasks;
    } catch (error) {
      throw error.message || "Error fetching overdue tasks";
    }
  }

  static async getProjectRoleByTaskId(taskId: string, userId: string) {
    try {
      // Implement logic to get the user's role in the project associated with the task
      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw new Error("Task not found");
      }
      const projectId = task.projectId;
      const role = await ProjectService.getUserProjectRole(
        projectId as unknown as string,
        userId as unknown as Types.ObjectId,
      );
      return role;
    } catch (error) {
      throw error.message || "Error fetching project role for task";
    }
  }
}

export default TaskService;
