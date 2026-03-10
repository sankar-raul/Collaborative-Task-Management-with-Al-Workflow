import { IUser } from "@/types/interface/user.interface";
import { calculateScore } from "./calculateTaskScore";
import { ITask } from "@/types/interface/task.interface";
import ProjectService from "@/services/project.service";
import TaskModel from "@/models/task/task.model";
const rankMembers = async (task: ITask, k: number = 1) => {
  try {
    // Get all project members with their details
    const memberSkills = await ProjectService.getProjectMembersWithSkills(
      task.projectId.toString(),
    );
    // console.log("Project Members:", memberSkills);

    // Get all tasks for this project
    const projectTasks = await TaskModel.find({ projectId: task.projectId })
      .populate("assignedTo", "name email skills availabilityHours currentWorkload");
    // console.log("Project Tasks:", projectTasks);

    // Create a map of userId to their tasks
    const userTaskDetails = new Map<string, { totalTasks: number; totalEstimatedTime: number }>();
    projectTasks.forEach((projectTask) => {
      if (projectTask.assignedTo) {
        const userId = (projectTask.assignedTo as any)._id.toString();
        userTaskDetails.set(userId, {
          totalTasks: (userTaskDetails.get(userId)?.totalTasks || 0) + 1,
          totalEstimatedTime: (userTaskDetails.get(userId)?.totalEstimatedTime || 0) + (projectTask.eastimatedTime || 0),
        });
      }
    });

    // Map members with their tasks and scores
    const rankedMembers = memberSkills.map((member) => {
      const userId = (member.user as any)._id.toString();
      const score = calculateScore(task, member.user as unknown as IUser, userTaskDetails.get(userId)) * 100;
      console.log(`Member: ${(member.user as any).name}, Tasks: ${userTaskDetails.get(userId)?.totalTasks}, Score: ${score}`);
      
      return {
        user: member.user,
        role: member.role,
        totalTasks: userTaskDetails.get(userId)?.totalTasks + 1 || 0,
        totalEstimatedTime: userTaskDetails.get(userId)?.totalEstimatedTime + task.eastimatedTime || 0,
        score: Number(score.toFixed(2)),
      };
    });

    rankedMembers.sort((a, b) => b.score - a.score);
    
    return k == -1 ? rankedMembers : rankedMembers.slice(0, k);
  } catch (error) {
    console.log("Error in rankMembers:", error);
    throw error.message || "Error ranking members";
  }
};

export default rankMembers;
