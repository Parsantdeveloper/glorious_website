import { Request,Response,NextFunction } from "express";
export function requireAdmin(req:Request, res:Response, next:NextFunction) {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
