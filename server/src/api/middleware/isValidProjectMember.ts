import ProjectService from "@/services/project.service";
import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";

const isValidProjectMember = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId as unknown as Types.ObjectId;
    const projectId = req.params.id as string;
    const isAdmin = req.user?.role === "Admin";
    if (isAdmin) {
        return next();
    }
    // Check if the user is a member of the project
    const isMember =  await ProjectService.isUserProjectMember(projectId, userId);
    if (!isMember) {
        return res.status(403).json({ success: false, message: "Forbidden: You are not a member of this project." });
    }
    next();
}

export default isValidProjectMember;