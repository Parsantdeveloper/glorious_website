import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./utils/auth";
import userRoutes from "./modules/user/user.route";
import bannerRoutes from "./modules/banner/banner.route";
import uploadRoutes from "./modules/uploads/upload.route";
import categoryRoutes from "./modules/category/category.route";
import brandRouter from "./modules/brand/brand.route";
import productRouter from "./modules/product/product.route";
import { errorHandler } from "./middlewares/error.middleware";
import dotenv from "dotenv"
import cron from "node-cron";
import { deleteTempImage } from "./modules/uploads/uploads.controller";

dotenv.config();
export const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
);
cron.schedule("*/15 * * * *", async () => {
  await deleteTempImage();
});

app.use(helmet());
app.use(morgan("dev")); 
app.all(/^\/api\/auth\/.*$/, toNodeHandler(auth));

app.use(express.json());


app.use("/api/user", userRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/brand", brandRouter);
app.use("/api/product", productRouter);

app.use(errorHandler);