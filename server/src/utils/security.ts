import config from "@/config/config";
import { IUserToken } from "@/types/interface/userToken.interface";
import jwt from "jsonwebtoken"
import argon2 from "argon2"

export class JWTSecurity {

    static generateToken(userId: string, role: string): string {
        return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: config.ACCESS_TOKEN_AGE });
    }
    static verifyToken(token: string): IUserToken | null {
        try {
            return jwt.verify(token, process.env.JWT_SECRET) as IUserToken;
        } catch (error) {
            return null;
        }
    }
}

export class PasswordSecurity {
    static async hashPassword(password: string) {
        const hashedPassword = await argon2.hash(password);
        return hashedPassword;
    }
    static async comparePassword(password: string, hash: string) {
         const isValid = await argon2.verify(hash, password);
         return isValid;
    }
}