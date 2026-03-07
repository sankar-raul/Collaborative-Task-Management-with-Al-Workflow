import MemberService from "@/services/membet.service";
import ProjectService from "@/services/project.service";
import { Request, Response } from "express";
import { Types } from "mongoose";

export const getAsignedProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId as unknown as Types.ObjectId;
    const projects = await ProjectService.getUserProjects(userId);
    res
      .status(200)
      .json({ success: true, data: projects, total: projects.length });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getMemberById = async (req: Request, res: Response) => {
  try {
    const memberId = req.params.id as string;
    const member = await MemberService.getMemberById(memberId);
    res.status(200).json({ success: true, data: member });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const getMyDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId as unknown as Types.ObjectId;
    const member = await MemberService.getMemberById(userId.toString());
    res.status(200).json({ success: true, data: member });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const searchMembers = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { members, pagination } = await MemberService.searchMembers(
      query,
      page,
      limit,
    );
    res.status(200).json({ success: true, data: members, pagination });
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

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { members, pagination } = await MemberService.getAllMembers(
      page,
      limit,
    );
    res.status(200).json({
      success: true,
      data: members,
      pagination,
    });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};

export const updateMember = async (req: Request, res: Response) => {
  try {
    const memberId = req.user.userId as string;
    const updateData = req.body as Partial<{
      name?: string;
      email?: string;
      skills?: string[];
      availabilityHours?: number;
    }>;
    const updatedMember = await MemberService.updateMember(
      memberId,
      updateData,
    );
    res.status(200).json({ success: true, data: updatedMember });
    return;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
    return;
  }
};
