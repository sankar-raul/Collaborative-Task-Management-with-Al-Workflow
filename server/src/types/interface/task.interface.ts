import TASK_PRIORITY from "@/constants/taskPriority.constant";
import { TASK_STATUS } from "@/constants/taskStatus.constant";
import { Types } from "mongoose";

export interface ITask {
  title: string;
  description?: string;
  priority: typeof TASK_PRIORITY[keyof typeof TASK_PRIORITY];
  requiredSkills: string[];
  assignedTo?: Types.ObjectId;
  projectId: Types.ObjectId;
  status?: typeof TASK_STATUS[keyof typeof TASK_STATUS];
  deadline?: Date;
  eastimatedTime?: number; // in hours
}