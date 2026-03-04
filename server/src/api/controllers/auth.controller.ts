import AuthService from "@/services/auth.service";
import type { Request, Response } from "express";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const me = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        res.status(200).json({
            message: "User details retrieved successfully",
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Error retrieving user details:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, skills=[], availabilityHours=40, currentWorkload=0 } = req.body || {};
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
        const { user, access_token } = await AuthService.register({ name, email, password, role: "User", skills, availabilityHours, currentWorkload });
        res.status(201).json({
            message: "User registered successfully",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            auth: {
                access_token: access_token,
            }
        });
        return;
    } catch (error) {
        console.error("Error registering user:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body || {};
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Invalid email format",
                success: false,
             });
        }
        const { user, access_token, role } = await AuthService.login({ email, password });
        res.status(200).json({
            message: "Login successful",
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role,
            },
            auth: {
                access_token: access_token,
            }
        });
    } catch (error) {
        console.error("Error logging in user:", error.message);
        res.status(500).json({ 
            message: error?.message || "Internal server error",
            success: false,
         });
    }
};