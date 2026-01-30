import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { categoryController } from "./category.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

router.post(
    "/",
    auth(Role.ADMIN, Role.SELLER),
    categoryController.createCategory,
);

router.delete("/:id", auth(Role.ADMIN, Role.SELLER), categoryController.deleteCategoryById);

router.patch("/:id", auth(Role.ADMIN, Role.SELLER), categoryController.updateCategoryById);

export const categoryRoutes: Router = router;
