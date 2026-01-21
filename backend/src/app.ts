import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import userRoutes from "./modules/user/user.route";
import { errorHandler } from "./middlewares/error.middleware";
import dotenv from "dotenv"

dotenv.config();
export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.all(/^\/api\/auth\/.*$/, toNodeHandler(auth));

app.use(express.json());


app.use("/api/user", userRoutes);



app.use(errorHandler);