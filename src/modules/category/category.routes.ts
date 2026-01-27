import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();

router.post(
    "/",
    auth(Role.ADMIN, Role.SELLER),
    categoryController.createCategory,
);

export const categoryRoutes: Router = router;
