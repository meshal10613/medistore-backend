import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get(
    "/",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    reviewController.getAllReviews,
);
router.get(
    "/:id",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    reviewController.getReviewByUserId,
);

router.post(
    "/",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    reviewController.createReview,
);

router.delete(
    "/:id",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    reviewController.deleteReviewById,
);

router.patch(
    "/:id",
    auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN),
    reviewController.updateReviewById,
);

export const reviewRoutes: Router = router;
