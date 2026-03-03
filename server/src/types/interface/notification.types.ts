import { Types } from "mongoose";

export interface INotification {
  userId: Types.ObjectId;
  projectId: Types.ObjectId;
  message: string;
  readStatus: boolean;
}