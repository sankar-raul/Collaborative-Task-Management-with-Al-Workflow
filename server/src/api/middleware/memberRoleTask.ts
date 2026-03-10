import { Request, Response, NextFunction } from "express";
import ProjectService from "@/services/project.service";
import TaskService from "@/services/task.service";
import { Types } from "mongoose";
import { IUser } from "@/types/interface/user.interface";
import { IUserToken } from "@/types/interface/userToken.interface";

const memberRoleMiddlewareTask = (
  requiredRole: Exclude<IUser["role"], "Admin">,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {
      role: userRole,
      userId,
    } = req.user || {} as Partial<IUserToken>;
    if (userRole === "Admin") {
      next();
      return;
    }
    try {
      let taskId = req.params.id;
      const projectId = req.body?.projectId;
      if (!taskId && projectId) {
        const role = await ProjectService.getUserProjectRole(projectId, userId as unknown as Types.ObjectId);
        if (role === requiredRole) {
          next();
          return
        } else {
          res.status(403).json({
            success: false,
            message: "Forbidden: Insufficient permissions",
          });
          return;
        }
      }

      if (!taskId) {
        res.status(400).json({
          success: false,
          message: "Task ID is required",
        });
        return;
      }

      // Get task to find associated project
     const role = await TaskService.getProjectRoleByTaskId(
        taskId as string,
        userId,
      );
      if (role === requiredRole) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: "Forbidden: Insufficient permissions",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default memberRoleMiddlewareTask;
