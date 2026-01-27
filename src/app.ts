import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import globalErrorHandler from "./middleware/globalErrorHandler";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { categoryRoutes } from "./modules/category/category.routes";
import { medicineRoutes } from "./modules/medicine/medicine.routes";
import { orderRoutes } from "./modules/order/order.routes";
import { reviewRoutes } from "./modules/review/review.routes";

const app: Application = express();

//* Middlewares
app.use(
    cors({
        origin: config.better_auth.app_url!,
        credentials: true,
    }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World.....!");
});

//* Routes
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/medicine", medicineRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);

//* Error Handler
app.use(globalErrorHandler);
app.use((req: Request, res: Response) => {
    res.status(404).json({
        path: req.url,
        success: false,
        message: "Not Found!",
    });
});

export default app;
