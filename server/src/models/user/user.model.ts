import { model } from "mongoose"
import userSchema from "./user.schema"

const UserModel = model("User", userSchema)
export default UserModel