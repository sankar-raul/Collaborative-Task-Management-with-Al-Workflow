import { IUser } from "@/types/interface/user.interface";
import { calculateScore } from "./calculateTaskScore";
import { ITask } from "@/types/interface/task.interface";
import ProjectService from "@/services/project.service";
import TaskService from "@/services/task.service";
const rankMembers = async (task: ITask, k: number = 1) => {
  try {
    const memberSkills = await ProjectService.getProjectMembersWithSkills(
      task.projectId.toString(),
    );
    const tasks = await TaskService.getTasksByProjectId(task.projectId as any as string)
    
    const rankedMembers = memberSkills.map((member) => {
      const score = calculateScore(task, member.user as unknown as IUser);
      return {
        user: member.user,
        role: member.role,
        score,
      };
    });
    rankedMembers.sort((a, b) => b.score - a.score);
    // console.log(rankedMembers)
    return k == -1 ? rankMembers : rankedMembers.slice(0, k);
  } catch (error) {
    console.log(error)
    throw error.message || "Error ranking members";
  }
};

export default rankMembers;
