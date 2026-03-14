import { model } from "mongoose"
import techstackSchema from "./techstack.schema"

const TechStackModel = model("Stack", techstackSchema)
export default TechStackModel