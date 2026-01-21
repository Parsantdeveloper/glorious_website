import { user } from "../generated/prisma/client";
import { session } from "../generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: user;
      session?:session;
    }
  }
}
