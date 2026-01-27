import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const getAllReviews = async () => {
    return await prisma.review.findMany();
};

const getReviewByUserId = async (userId: string) => {
    return await prisma.review.findMany({
        where: {
            userId: userId,
        },
    });
};

const createReview = async (payload: Review) => {
    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: {
            id: payload.userId,
        },
    });
    if (!userExists) {
        throw new AppError("User does not exist", 404);
    }

    // Check if medicine exists
    const medicineExists = await prisma.medicine.findUnique({
        where: {
            id: payload.medicineId,
        },
    });
    if (!medicineExists) {
        throw new AppError("Medicine does not exist", 404);
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new AppError("Rating must be between 1 and 5", 400);
    }

    return await prisma.review.create({
        data: payload,
    });
};

const deleteReviewById = async (id: string) => {
    // 1️⃣ Validate review
    const review = await prisma.review.findUnique({
        where: { id },
    });

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    // 2️⃣ Delete review
    await prisma.review.delete({
        where: { id },
    });
};

const updateReviewById = async (
    reviewId: string,
    payload: {
        rating: number;
        comment: string;
    },
) => {
    // 1️⃣ Validate review
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError("Review not found", 404);
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new AppError("Rating must be between 1 and 5", 400);
    }

    return await prisma.review.update({
		where: { id: reviewId },
		data: payload,
	});
};

export const reviewService = {
    getAllReviews,
    getReviewByUserId,
    createReview,
    deleteReviewById,
    updateReviewById,
};
