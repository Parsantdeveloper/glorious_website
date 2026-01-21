import {  Response } from "express";
import { ZodError } from "zod";


export const errorHandler = (
err: any,
// req: Request,
res: Response,
// next: NextFunction
) => {
if (err instanceof ZodError) {
return res.status(400).json(err);
}


return res.status(err.statusCode || 500).json({
message: err.message || "Internal Server Error",
});
};