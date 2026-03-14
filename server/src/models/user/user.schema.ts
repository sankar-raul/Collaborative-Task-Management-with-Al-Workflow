import { IUser } from "@/types/interface/user.interface";
import { Schema } from "mongoose";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Manager", "User"],
      required: true,
    },
    isApproved: { type: Boolean, default: false },
    skills: [{ type: String }],
    availabilityHours: { type: Number, required: true },
    currentWorkload: { type: Number, required: true },
    },
    { timestamps: true }
  );
export default userSchema;