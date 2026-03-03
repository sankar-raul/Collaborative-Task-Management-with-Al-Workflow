import { model } from "mongoose"
import taskSchema from "./task.schema"

const TaskModel = model("Task", taskSchema)
export default TaskModel