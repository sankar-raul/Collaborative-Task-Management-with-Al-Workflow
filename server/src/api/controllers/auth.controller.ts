import AuthService from "@/services/auth.service";
import type { Request, Response } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, skills=[], availabilityHours=40, currentWorkload=0 } = req.body;
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required",
                success: false,
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false,
            });
        }
        const newUser = await AuthService.register({ name, email, password, role: "User", skills, availabilityHours, currentWorkload });
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: newUser.user,
            auth: {
                access_token: newUser.access_token,
            }
        });
        return;
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const loginResult = await AuthService.login({ email, password });
        if (!loginResult) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({
            message: "Login successful",
            success: true,
            user: loginResult.user,
            auth: {
                access_token: loginResult.access_token,
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Server error" });
    }
};