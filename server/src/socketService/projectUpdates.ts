import { io } from "@/index";
import { userIdToSocketId } from "@/redisStore/redisStore";
import { IProject } from "@/types/interface/project.interface";
import { IProjectMember } from "@/types/interface/projectMember.interface";
import { ITask } from "@/types/interface/task.interface";

class ProjectNotification {
  // task created, task asigned, taskstatus update, comment created, memmer added to project, member removed from project, project updated, project deleted
  static taskCreated(projectId: string, task: ITask) {
    io.to(`project_${projectId}`).emit("taskCreated", task);
  }

  static async taskAssigned(task: ITask, assignedTo: string) {
    const socketId = await userIdToSocketId(assignedTo);
    socketId?.forEach((socket_id: string) => {
      io.to(socket_id).emit("taskAssigned", task);
    });
  }

  static taskStatusUpdated(projectId: string, task: ITask) {
    io.to(`project_${projectId}`).emit("taskStatusUpdated", task);
  }

  static taskUpdated(projectId: string, task: ITask) {
    io.to(`project_${projectId}`).emit("taskUpdated", task);
  }

  static taskDeleted(projectId: string, taskId: string) {
    io.to(`project_${projectId}`).emit("taskDeleted", { taskId });
  }

  static commentCreated(projectId: string, commentId: string) {
    io.to(`project_${projectId}`).emit("commentCreated", { commentId });
  }

  static memberAdded(projectId: string, member: IProjectMember) {
    io.to(`project_${projectId}`).emit("memberAdded", member);
  }

  static memberRemoved(projectId: string, memberId: string) {
    io.to(`project_${projectId}`).emit("memberRemoved", { memberId });
  }

  static projectUpdated(projectId: string, project: IProject) {
    io.to(`project_${projectId}`).emit("projectUpdated", { projectId });
  }

  static projectDeleted(projectId: string) {
    io.to(`project_${projectId}`).emit("projectDeleted", { projectId });
  }

  static projectCreated(projectId: string, project: IProject) {
    io.to(`project_${projectId}`).emit("projectCreated", { project });
  }
}

export default ProjectNotification;
