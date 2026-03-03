import { model } from "mongoose"
import projectSchema from "./project.schema"

const ProjectModel = model("Project", projectSchema)
export default ProjectModel