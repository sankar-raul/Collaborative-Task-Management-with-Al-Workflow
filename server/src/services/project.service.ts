import ProjectModel from "@/models/project/project.model";
import { IProject } from "@/types/interface/project.interface";
import { IProjectMember } from "@/types/interface/projectMember.interface";
import { IUser } from "@/types/interface/user.interface";
import { Types } from "mongoose";

class ProjectService {
  static async getProjects(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [projects, total] = await Promise.all([
        ProjectModel.find().skip(skip).limit(limit),
        ProjectModel.countDocuments(),
      ]);
      return {
        projects,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  static async createProject({ projectName, description, members }: IProject) {
    try {
      const project = new ProjectModel({ projectName, description, members });
      await project.save();
      return project;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  static async getProjectById(projectId: string) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      console.error("Error fetching project by ID:", error);
      throw error;
    }
  }

  static async updateProject(projectId: string, updateData: Partial<IProject>) {
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        projectId,
        updateData,
        { new: true },
      );
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  static async deleteProject(projectId: string) {
    try {
      const project = await ProjectModel.findByIdAndDelete(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  static async addMember({
    projectId,
    userId,
    role = "User",
  }: {
    projectId: string;
    userId: Types.ObjectId;
    role?: Exclude<IUser["role"], "Admin">;
  }) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      if (project.members.find((member) => member.user === userId)) {
        throw new Error("User is already a member of the project");
      }
      const newMember: IProjectMember = {
        user: userId,
        role,
      };
      project.members.push(newMember);
      await project.save();
      return project;
    } catch (error) {
      console.error("Error adding member to project:", error);
      throw error;
    }
  }

  static async removeMember(projectId: string, userId: Types.ObjectId) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      const memberIndex = project.members.findIndex((member) =>
        member.user.equals(userId),
      );
      if (memberIndex === -1) {
        throw new Error("User is not a member of the project");
      }
      project.members.splice(memberIndex, 1);
      await project.save();
      return project;
    } catch (error) {
      console.error("Error removing member from project:", error);
      throw error;
    }
  }

  static async updateMemberRole({
    projectId,
    userId,
    role: newRole,
  }: {
    projectId: string;
    userId: Types.ObjectId;
    role: Exclude<IUser["role"], "Admin">;
  }) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      const member = project.members.find((member) =>
        member.user.equals(userId),
      );
      if (!member) {
        throw new Error("User is not a member of the project");
      }
      member.role = newRole;
      await project.save();
      return project;
    } catch (error) {
      console.error("Error updating member role in project:", error);
      throw error;
    }
  }

  static async getProjectMembers(projectId: string) {
    try {
      const project = await ProjectModel.findById(projectId).populate(
        "members.user",
        "name email",
      );
      if (!project) {
        throw new Error("Project not found");
      }
      return project.members;
    } catch (error) {
      console.error("Error fetching project members:", error);
      throw error;
    }
  }

  static async getUserProjects(userId: Types.ObjectId) {
    try {
      const projects = await ProjectModel.find({ "members.user": userId });
      return projects;
    } catch (error) {
      console.error("Error fetching user projects:", error);
      throw error;
    }
  }

  static async isUserProjectMember(projectId: string, userId: Types.ObjectId) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      return project.members.some((member) => member.user.equals(userId));
    } catch (error) {
      console.error("Error checking if user is project member:", error);
      throw error;
    }
  }

  static async getUserProjectRole(projectId: string, userId: Types.ObjectId) {
    try {
      const project = await ProjectModel.findById(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      const member = project.members.find((member) =>
        member.user.equals(userId),
      );
      if (!member) {
        throw new Error("User is not a member of the project");
      }
      return member.role;
    } catch (error) {
      console.error("Error fetching user project role:", error);
      throw error;
    }
  }
}

export default ProjectService;
