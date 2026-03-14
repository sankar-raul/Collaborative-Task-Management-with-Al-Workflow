import { IProject } from "@/types/interface/project.interface";
import { Schema } from "mongoose";

const projectSchema = new Schema<IProject>(
  {
    projectName: { type: String, required: true },
    description: { type: String },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: String, enum: ["Manager", "User"], required: true },
      },
    ],
    deadline: { type: String },
  },
  { timestamps: true }
);
export default projectSchema;