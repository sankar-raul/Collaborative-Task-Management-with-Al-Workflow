import { ROLE } from "@/constants/role.constant";
import AIService from "@/services/ai.service";
import PdfParserService from "@/services/pdfParser.service";
import ProjectService from "@/services/project.service";
import TaskRankingService from "@/services/taskRanking.service";
import { MulterRequest } from "@/types/express";
import { Request, Response } from "express";
import { Types } from "mongoose";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Unknown error";
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      description = "",
      members = [],
      deadline,
    } = req.body || {};
    if (!projectName) {
      res
        .status(400)
        .json({ success: false, message: "Project name is required" });
      return;
    }
    const project = await ProjectService.createProject({
      projectName,
      description,
      members,
      deadline,
    });
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const createProjectByAI = async (req: Request, res: Response) => {
  try {
    const {
      projectName,
      description,
      deadline,
      members = [],
      techStackId,
    } = req.body;

    if (!projectName) {
      res
        .status(400)
        .json({ success: false, message: "Project name is required" });
      return;
    }

    if (!description || !deadline || !techStackId) {
      return res.status(400).json({
        success: false,
        message: "description, deadline and techStack are required",
      });
    }

    const project = await ProjectService.createProject({
      projectName,
      description,
      members,
      deadline,
    });
    const tasks = await AIService.generateTasks(
      description,
      deadline,
      techStackId,
    );
    await TaskRankingService.rankMembersAndAssignTask(
      tasks,
      techStackId,
      project._id as unknown as Types.ObjectId,
    );
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to generate tasks: ${getErrorMessage(error)}`,
    });
  }
};

export const getProjects = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { projects, pagination } = await ProjectService.getProjects(
      page,
      limit,
    );
    res.status(200).json({ success: true, data: projects, pagination });
    return;
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
    return;
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
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    await ProjectService.deleteProject(projectId);
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const addProjectMember = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id as string;
    const { userId, role = ROLE["USER"] } = req.body;
    const project = await ProjectService.addMember({
      projectId,
      userId,
      role,
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
    if (!userId) {
      res.status(400).json({ success: false, message: "User ID is required" });
      return;
    }
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
      role,
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
    const userId = req.user.userId as unknown as Types.ObjectId;
    const projects = await ProjectService.getUserProjects(userId);
    res.status(200).json({ success: true, data: projects });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getTotalProjectsCount = async (req: Request, res: Response) => {
  try {
    const count = await ProjectService.getTotalProjectsCount();
    res.status(200).json({ success: true, data: count });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const createProjectFromPdf = async (
  req: MulterRequest,
  res: Response,
) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const parsed = await PdfParserService.parsePDF(file.buffer);

    // Save project to DB
    // const newProject = await Project.create(project);

    res.json({
      success: true,
      parsedText: parsed.text.slice(0, 500), // preview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating project: ${getErrorMessage(error)}`,
    });
  }
};
