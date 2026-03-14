import TaskModel from "@/models/task/task.model";
import { ITask } from "@/types/interface/task.interface";
import { IUser } from "@/types/interface/user.interface";
import { calculateScore } from "@/utils/calculateTaskScore";

class TaskRankingService {
  static async pl(userId: string) {
    const projectTasks = await TaskModel.find({ assignedTo: userId }).populate(
      "assignedTo",
      "name email skills availabilityHours currentWorkload",
    );
    // const totalRecords = projectTasks.length;
    // const totalEstimatedTime = projectTasks.reduce(
    //     (sum, task) => sum + (task.eastimatedTime || 0),
    //     0,
    // );


    // Create a map of userId to their tasks
    
  }

  static rankTasksByMembers(task: ITask, members: IUser[]) {
    try {
      const rankedMembers = members.map((member) => {
        const score = calculateScore(task, member, -1) * 100;
      });
    } catch (error) {
      console.log("Error in rankTasksByMembers:", error);
      throw error.message || "Error ranking tasks by members";
    }
  }
}

export default TaskRankingService;
