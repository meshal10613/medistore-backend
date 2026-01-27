import { Router } from "express";
import { orderController } from "./order.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", auth(Role.SELLER, Role.ADMIN), orderController.getAllOrders);
router.get("/:id", auth(Role.SELLER, Role.ADMIN), orderController.getOrderById);

router.post(
    "/",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    orderController.createOrder,
);

router.delete(
    "/:id",
    auth(Role.ADMIN, Role.SELLER),
    orderController.deleteOrderById,
);

router.patch(
    "/:id",
    auth(Role.ADMIN, Role.SELLER),
    orderController.updateOrderById,
);

export const orderRoutes: Router = router;
