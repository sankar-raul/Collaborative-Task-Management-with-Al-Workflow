import { ITask } from "@/types/interface/task.interface";
import { Schema } from "mongoose";

const taskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
    },
    requiredSkills: [{ type: String }],
    assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    status: {
      type: String,
      enum: [ "Backlog", "Assigned", "In Progress", "In Review", "Completed" ],
      required: true,
    },
    deadline: { type: Date },
  },
  { timestamps: true }
);
export default taskSchema;