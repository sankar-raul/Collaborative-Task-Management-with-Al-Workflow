import UserModel from "@/models/user/user.model";
import { IUser } from "@/types/interface/user.interface";
import { JWTSecurity, PasswordSecurity } from "@/utils/security";

class AuthService {
    static async register({
        email,
        name,
        password,
        role,
        stacks = [],
        skills = [],
        availabilityHours = 40,
    }:IUser) {
        try {
            const existingUser = await AuthService.checkDuplicateEmail(email);
            if (existingUser) {
                throw new Error("Email already in use");
            }
            const passwordHash = await PasswordSecurity.hashPassword(password);
            const newUser = new UserModel({
                name,
                email,
                stacks,
                password: passwordHash,
                role: "User",
                skills: skills,
                availabilityHours: availabilityHours || 40,
                currentWorkload: 0,
            });
            await newUser.save();
            const access_token = JWTSecurity.generateToken({
                userId: String(newUser._id),
                role: newUser.role,
                email: newUser.email,
                name: newUser.name,
            });
            return {
                user: newUser,
                access_token,
            };
        } catch (error) {
            throw new Error(error.message || "Registration failed");
        }
    }
    static async login({
        email,
        password,
    }: { email: string; password: string }) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("Invalid email or password");
            }
            const isPasswordValid = await PasswordSecurity.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid email or password");
            }
            const access_token = JWTSecurity.generateToken({
                userId: String(user._id),
                role: user.role,
                email: user.email,
                name: user.name,
            });
            return {
                user,
                access_token,
                role: user.role,
            };
        } catch (error) {
            // console.error("Error logging in:", error);
            throw new Error(error.message || "Login failed");
        }
    }
    static async logout(userId: string) {
        // Implement logout logic, e.g., invalidating JWT token
    }
    static async refreshToken(userId: string) {
        // Implement token refresh logic, e.g., generating new JWT token
    }
    static async forgotPassword(email: string) {
        // Implement forgot password logic, e.g., sending reset link to email
    }
    static async resetPassword(token: string, newPassword: string) {
        // Implement reset password logic, e.g., validating token and updating password
    }
    static async verifyEmail(token: string) {
        // Implement email verification logic, e.g., validating token and activating user account
    }
    static async changePassword(userId: string, currentPassword: string, newPassword: string) {
        // Implement change password logic, e.g., validating current password and updating to new password
    }

    static async checkDuplicateEmail(email: string) {
        if (await UserModel.findOne({ email })) {
            return true;
        } else {
            return false;
        }
    }
}

export default AuthService;