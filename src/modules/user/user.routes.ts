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
router.get(
    "/",
    auth(Role.ADMIN),
    userController.getAllUsers,
);
router.get("/admin/stats", auth(Role.ADMIN), userController.adminStats);
router.get("/seller/stats", auth(Role.SELLER), userController.sellerStats);
router.get("/customer/stats", auth(Role.CUSTOMER), userController.customerStats);

router.patch("/:id", auth(Role.ADMIN, Role.SELLER, Role.CUSTOMER), userController.updateUser);

export const userRoutes: Router = router;
