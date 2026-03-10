import ProjectModel from "@/models/project/project.model";
import connectMembersToProject from "@/socketService/connectMembersToProject";
import ProjectNotification from "@/socketService/projectUpdates";
import { IProject } from "@/types/interface/project.interface";
import { IProjectMember } from "@/types/interface/projectMember.interface";
import { IUser } from "@/types/interface/user.interface";
import { Types } from "mongoose";

class ProjectService {
  static async getProjects(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;
      const [projects, total] = await Promise.all([
        ProjectModel.find()
          .skip(skip)
          .limit(limit)
          .populate("members.user", "name email"),
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
      throw error;
    }
  }

  static async createProject({
    projectName,
    description = "",
    members = [],
  }: IProject) {
    try {
      const project = new ProjectModel({ projectName, description, members });
      await project.save();
      await connectMembersToProject(
        project._id.toString(),
        project,
        members.map((m) => m.user.toString()),
      );
      return project;
    } catch (error) {
      throw error;
    }
  }

  static async getProjectById(projectId: string) {
    try {
      const project = await ProjectModel.findById(projectId).populate(
        "members.user",
        "name email",
      );
      if (!project) {
        throw new Error("Project not found");
      }
      return project;
    } catch (error) {
      throw error;
    }
  }

  static async updateProject(projectId: string, updateData: Partial<IProject>) {
    try {
      const project = await ProjectModel.findByIdAndUpdate(
        projectId,
        updateData,
        { returnDocument: "after" },
      ).populate("members.user", "name email");
      if (!project) {
        throw new Error("Project not found");
      }
      ProjectNotification.projectUpdated(projectId, project);
      return project;
    } catch (error) {
      throw error;
    }
  }

  static async deleteProject(projectId: string) {
    try {
      const project = await ProjectModel.findByIdAndDelete(projectId);
      if (!project) {
        throw new Error("Project not found");
      }
      ProjectNotification.projectDeleted(projectId);
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
      const isUserAlreadyMember = await ProjectService.isUserProjectMember(
        projectId,
        userId,
      );
      if (isUserAlreadyMember) {
        throw new Error("User is already a member of the project");
      }
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
      
      // Connect the new member to the project socket room
      await connectMembersToProject(projectId, project, [userId.toString()]);
      
      ProjectNotification.memberAdded(projectId, newMember);
      await project.populate("members.user", "name email");
      return project;
    } catch (error) {
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
      ProjectNotification.memberRemoved(projectId, userId.toString());
      await project.populate("members.user", "name email");
      return project;
    } catch (error) {
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
      ProjectNotification.memberRoleUpdated(projectId, member);
      await project.populate("members.user", "name email");
      return project;
    } catch (error) {
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
      throw error;
    }
  }

  static async getProjectMembersWithSkills(projectId: string) {
    try {
      const project = await ProjectModel.findById(projectId)
        .populate(
          "members.user",
          "name email skills availabilityHours currentWorkload",
        )
        // console.log(project)
      if (!project) {
        throw new Error("Project not found");
      }
      return project.members;
    } catch (error) {
      throw error;
    }
  }

  static async getUserProjects(userId: Types.ObjectId) {
    try {
      const projects = await ProjectModel.find({
        "members.user": userId,
      }).populate("members.user", "name email").sort({ updatedAt: -1 });
      return projects.map((project) => ({
        ...project.toObject(),
        userRole: project.members.find((member) => member.user.equals(userId))
          ?.role,
      }));
    } catch (error) {
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
      throw error;
    }
  }

  static async getTotalProjectsCount() {
    try {
      const count = await ProjectModel.countDocuments();
      return count;
    } catch (error) {
      throw error;
    }
  }

  static async getProjectByTaskId(taskId: string) {
    try {
      const project = await ProjectModel.findOne({
        "tasks._id": taskId,
      }).populate("members.user", "name email");
      if (!project) {
        throw new Error("Project not found for the given task ID");
      }
      return project;
    } catch (error) {
      throw error;
    }
  }
}

export default ProjectService;
