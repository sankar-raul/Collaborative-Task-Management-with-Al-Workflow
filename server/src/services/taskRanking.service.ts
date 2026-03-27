import TaskModel from "@/models/task/task.model";
import { ITask } from "@/types/interface/task.interface";
import { IUser } from "@/types/interface/user.interface";
import { IUserStat } from "@/types/interface/userstat.interface";
import { calculateScore } from "@/utils/calculateTaskScore";
import { Types } from "mongoose";
import TaskService from "./task.service";
import UserModel from "@/models/user/user.model";

const WORK_HOURS_PER_WEEK = 40;
const MAX_WORKLOAD = 50;
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
    // console.log(task, userStat)
    const overlap = task.requiredSkills.filter((skill) =>
      userStat.skills.includes(skill),
    ).length;

    const skillMatch = overlap / task.requiredSkills.length;

    const workloadScore = 1 - (userStat?.totalTasks || 0) / MAX_WORKLOAD;
    const availlableHours =
      userStat.availabilityHours - userStat?.totalEstimatedTime || 0;
    const availabilityScore =
      (availlableHours - task.eastimatedTime) / WORK_HOURS_PER_WEEK;
    //   console.log(priorityScore, workloadScore, availabilityScore)
    return (
      0.35 * priorityScore +
      0.4 * skillMatch +
      0.15 * workloadScore +
      0.1 * availabilityScore
    );
  }

  static async getWorkLoads(stackId: string) {
    if (!Types.ObjectId.isValid(stackId)) {
      return [];
    }

    const stackObjectId = new Types.ObjectId(stackId);

    const usersWithWorkload = await UserModel.aggregate([
      {
        $match: {
          stacks: { $in: [stackObjectId] },
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "assignedTo",
          as: "tasks",
        },
      },
      {
        $addFields: {
          totalTasks: { $size: "$tasks" },
          totalEstimatedTime: {
            $sum: {
              $map: {
                input: "$tasks",
                as: "task",
                in: { $ifNull: ["$$task.eastimatedTime", 0] },
              },
            },
          },
        },
      },
      {
        $project: {
          userId: "$_id",
          name: 1,
          email: 1,
          skills: 1,
          availabilityHours: 1,
          totalTasks: 1,
          totalEstimatedTime: 1,
          _id: 0,
        },
      },
    ]);
    // console.log(usersWithWorkload)
    return usersWithWorkload as IUserStat[];
  }

  static async rankTasksByMembers(
    task: ITask,
    techstack: string,
    project_id: Types.ObjectId,
  ) {
    try {
      const workloadByMember = await this.getWorkLoads(techstack);

      // return () => {
    // use closure here to calculate score for each member based on the task and their workload
      // }
      workloadByMember.forEach((member) => {
        member.score = this.calculateScore({ task, userStat: member });
      });
      const rankedMembers = workloadByMember.sort((a, b) => b.score - a.score);
      task.assignedTo = rankedMembers[0]?.userId || null;
      task.projectId = project_id;
      task.status = "To Do";
    //   console.log(task, rankedMembers[0])
      return task;
    } catch (error) {
      console.log("Error in rankTasksByMembers:", error);
      throw error.message || "Error ranking tasks by members";
    }
  }

  static async rankMembersAndAssignTask(
    tasks: ITask[],
    techstack: string,
    project_id: Types.ObjectId,
    totalProjectHours: number,
  ) {
    try {
      const assignedTasks = await Promise.all(
        tasks.map((task) =>
          this.rankTasksByMembers(task, techstack, project_id),
        ),
      );
      console.log(assignedTasks)
      const newTasks = await TaskService.createAndAssignTask(assignedTasks);
      console.log(newTasks)
      return newTasks as ITask[];
    } catch (error) {
      console.log("Error in rankMembers:", error);
      throw error.message || "Error ranking members";
    }
  }
}

export default TaskRankingService;
