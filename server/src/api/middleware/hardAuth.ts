import { NextFunction, Request, Response } from "express";

const hardAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    } else {
        next();
    }
};

export default hardAuth;