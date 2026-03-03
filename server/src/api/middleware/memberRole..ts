import { Request, Response, NextFunction } from "express";
import ProjectService from "@/services/project.service";
import { Types } from "mongoose";
import { IUser } from "@/types/interface/user.interface";

const memberRoleMiddleware = (requiredRole: Exclude<IUser['role'], "Admin">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role; // Assuming req.user is populated by auth middleware
    if (userRole === "Admin") {
      // Admin has access to all routes
      next();
    } else {
      let projectId = req.params.id;
      if (!projectId) {
        projectId = req.body.projectId; // Try to get projectId from body if not in params
      }
      if (!projectId) {
        res
          .status(400)
          .json({ success: false, message: "Project ID is required" });
        return;
      }
      ProjectService.getUserProjectRole(
        projectId as string,
        req.user.userId as unknown as Types.ObjectId,
      )
        .then((role) => {
          if (role === requiredRole) {
            next();
          } else {
            res
              .status(403)
              .json({
                success: false,
                message: "Forbidden: Insufficient permissions",
              });
            return;
          }
        })
        .catch((error) => {
          res.status(500).json({ success: false, message: error.message });
          return;
        });
    }
  };
};

export default memberRoleMiddleware;
