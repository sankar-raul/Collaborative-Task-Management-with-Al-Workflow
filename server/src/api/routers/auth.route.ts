import { Router } from "express";
import { registerUser, loginUser, me } from "../controllers/auth.controller";

const authRoute = Router();

authRoute.get("/me", me);
authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);

export default authRoute;