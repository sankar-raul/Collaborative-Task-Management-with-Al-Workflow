import ProjectService from "@/services/project.service";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const getAsignedProjects = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId as unknown as Types.ObjectId;
        const projects = await ProjectService.getUserProjects(userId);
        res.status(200).json({ success: true, data: projects, total: projects.length });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const getUserProjectRole = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const userId = req.user.userId as unknown as Types.ObjectId;
        const role = await ProjectService.getUserProjectRole(projectId, userId);
        res.status(200).json({ success: true, data: role });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};