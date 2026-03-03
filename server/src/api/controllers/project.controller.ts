import ProjectService from "@/services/project.service";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const createProject = async (req: Request, res: Response) => {
    try {
        const { projectName, description, members } = req.body;
        const project = await ProjectService.createProject({ projectName, description, members });
        res.status(201).json({ success: true, data: project });
        return
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await ProjectService.getProjects(page, limit);
        res.status(200).json({ success: true, data: result });
        return
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const project = await ProjectService.getProjectById(projectId);
        res.status(200).json({ success: true, data: project });
        return
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const updateData = req.body;
        const project = await ProjectService.updateProject(projectId, updateData);
        res.status(200).json({ success: true, data: project });
        return
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        await ProjectService.deleteProject(projectId);
        res.status(200).json({ success: true, message: "Project deleted successfully" });
        return
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const addProjectMember = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const { userId, role } = req.body;
        const project = await ProjectService.addMember({
            projectId,
            userId,
            role
        });
        res.status(200).json({ success: true, data: project });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeProjectMember = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const userId = req.body.userId as Types.ObjectId;
        const project = await ProjectService.removeMember(projectId, userId);
        res.status(200).json({ success: true, data: project });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const updateProjectMemberRole = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const { userId, role } = req.body;
        const project = await ProjectService.updateMemberRole({
            projectId,
            userId,
            role
        });
        res.status(200).json({ success: true, data: project });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const getProjectMembers = async (req: Request, res: Response) => {
    try {
        const projectId = req.params.id as string;
        const members = await ProjectService.getProjectMembers(projectId);
        res.status(200).json({ success: true, data: members });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};

export const getUserProjects = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId  as unknown as Types.ObjectId;
        const projects = await ProjectService.getUserProjects(userId);
        res.status(200).json({ success: true, data: projects });
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
};
