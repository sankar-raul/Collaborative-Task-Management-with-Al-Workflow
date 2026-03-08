import ProjectService from "@/services/project.service";
import { Types } from "mongoose";
import { Socket } from "socket.io";

const joinToProjects = async (socket: Socket, userId: string) => {
    // Join the user to their project rooms
    const projects = await ProjectService.getUserProjects(userId as unknown as Types.ObjectId)
    projects.forEach((project) => {
        socket.join(`project_${project._id.toString()}`);
    });
}

export default joinToProjects;