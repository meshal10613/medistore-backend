import express, { Application, Request, Response } from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import globalErrorHandler from "./middleware/globalErrorHandler";
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";

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
app.use("/api/auth", userRoutes);
app.all("/api/auth/*splat", toNodeHandler(auth));

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
