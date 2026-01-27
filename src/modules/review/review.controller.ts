import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";
import { success } from "better-auth";

const getAllReviews = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await reviewService.getAllReviews();
        res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getReviewByUserId = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const result = await reviewService.getReviewByUserId(id as string);
        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const createReview = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await reviewService.createReview(req.body);
        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const deleteReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await reviewService.deleteReviewById(id as string);
        res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error: any) {
        next(error);
    }
};

const updateReviewById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await reviewService.updateReviewById(id as string, req.body);
        res.status(200).json({
            success: true,
            message: "Review updated successfully",
        });
    } catch (error: any) {
        next(error);
    }
};

export const reviewController = {
    getAllReviews,
    getReviewByUserId,
    createReview,
    deleteReviewById,
    updateReviewById,
};
