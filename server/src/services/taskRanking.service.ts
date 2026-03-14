import TaskModel from "@/models/task/task.model";
import { ITask } from "@/types/interface/task.interface";
import { IUser } from "@/types/interface/user.interface";
import { IUserStat } from "@/types/interface/userstat.interface";
import { calculateScore } from "@/utils/calculateTaskScore";
import { Types } from "mongoose";
import TaskService from "./task.service";

const WORK_HOURS_PER_WEEK = 40;
const MAX_WORKLOAD = 5;
const PRIORITY_MAP = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

class TaskRankingService {
  static calculateScore({
    task,
    userStat,
  }: {
    task: ITask;
    userStat: IUserStat;
  }) {
    const priorityScore = PRIORITY_MAP[task.priority] / 4;
    const overlap = task.requiredSkills.filter((skill) =>
      userStat.skills.includes(skill),
    ).length;

    const skillMatch = overlap / task.requiredSkills.length;

    const workloadScore = 1 - (userStat?.totalTasks || 0) / MAX_WORKLOAD;
    const availlableHours =
      userStat.availabilityHours - userStat?.totalEstimatedTime || 0;
    const availabilityScore =
      (availlableHours - task.eastimatedTime) / WORK_HOURS_PER_WEEK;
    return (
      0.35 * priorityScore +
      0.4 * skillMatch +
      0.15 * workloadScore +
      0.1 * availabilityScore
    );
  }

  static async getWorkLoads(stackId: string) {
    const userTaskStats = await TaskModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $match: {
          "user.skills": {
            $in: [stackId],
          }, // e.g. "React" or "Python"
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          priority: 1,
          eastimatedTime: 1,
          assignedTo: "$user._id",
          name: "$user.name",
          email: "$user.email",
          skills: "$user.skills",
        },
      },
    ]);

    return userTaskStats as IUserStat[];
  }

  static async rankTasksByMembers(task: ITask, techstack: string, project_id: Types.ObjectId) {
    try {
      const workloadByMember = await this.getWorkLoads(techstack);
      workloadByMember.forEach((member) => {
        member.score = this.calculateScore({ task, userStat: member });
      });
      const rankedMembers = workloadByMember.sort((a, b) => b.score - a.score);
      task.assignedTo = rankedMembers[0]?.userId || null;
      task.projectId = project_id;
      task.status = "To Do";
      return task;
    } catch (error) {
      console.log("Error in rankTasksByMembers:", error);
      throw error.message || "Error ranking tasks by members";
    }
  }

  static async rankMembersAndAssignTask(tasks: ITask[], techstack: string, project_id: Types.ObjectId) {
    try {
      const assignedTasks = await Promise.all(
        tasks.map((task) =>
          this.rankTasksByMembers(task, techstack, project_id),
        ),
      );
      const newTasks = await TaskService.createAndAssignTask(assignedTasks);
      return newTasks as ITask[];
    } catch (error) {
      console.log("Error in rankMembers:", error);
      throw error.message || "Error ranking members";
    }
  }
}

export default TaskRankingService;
