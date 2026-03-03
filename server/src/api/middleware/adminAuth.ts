import { Request, Response, NextFunction } from "express";
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "Admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
    }
    next();
}
export default adminAuth;