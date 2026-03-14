import { ITechstack } from "@/types/interface/techstack.interface";
import { Schema } from "mongoose";

const techstackSchema = new Schema<ITechstack>(
  {
    name: {
        type: String,
        required: true
    },
    skills: [String]
  },
  { timestamps: true }
);
export default techstackSchema;