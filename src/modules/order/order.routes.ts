import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.post(
    "/",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    orderController.createOrder,
);

export const orderRoutes: Router = router;
