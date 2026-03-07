import { Request, Response, NextFunction } from "express";

const managerAdminAuth = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== "Admin" && req.user?.role !== "Manager") {
        return res.status(403).json({ message: "Forbidden: Admins or Managers only" });
    }
    next();
}

export default managerAdminAuth;
