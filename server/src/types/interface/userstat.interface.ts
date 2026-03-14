import { Types } from "mongoose";

export interface IUserStat {
  userId: Types.ObjectId;
  name: string;
  email: string;
  skills: string[];
  availabilityHours: number;
  currentWorkload: number;
  totalTasks: number;
  totalEstimatedTime: number;
  score?: number; // Optional score field for task ranking
}