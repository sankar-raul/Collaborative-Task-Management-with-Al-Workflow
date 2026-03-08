import { io } from "@/index";
import { userIdToSocketId } from "@/redisStore/redisStore";
import ProjectNotification from "./projectUpdates";
import { IProject } from "@/types/interface/project.interface";

const connectMembersToProject = async (
  projectId: string,
  project: IProject,
  memberIds: string[],
) => {
  const socketIds = await Promise.all(
    memberIds.map((memberId) => {
      return userIdToSocketId(memberId);
    }),
  );
  socketIds.forEach((socketId) => {
    socketId?.forEach((id: string) => {
      io.sockets.sockets.get(id)?.join(`project_${projectId}`);
    });
  });
  ProjectNotification.projectCreated(projectId, project);
};

export default connectMembersToProject;
