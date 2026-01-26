import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/me",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    userController.getCurrentUser,
);

export const userRoutes = router;
