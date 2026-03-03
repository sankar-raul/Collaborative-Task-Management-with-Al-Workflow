import { JWTSecurity } from "@/utils/security";
import type { Request, Response, NextFunction } from "express";
import type { IUserToken } from "@/types/interface/userToken.interface";

const softAuth = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        next();
        return;
    }
    
    try {
        const decoded = JWTSecurity.verifyToken(token);
        if (decoded) {
            (req as any).user = decoded as IUserToken;
        }
    } catch (error) {
        console.error("Error verifying token:", error);
    }
    
    next();
};

export default softAuth;