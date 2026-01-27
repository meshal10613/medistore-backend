import { NextFunction, Request, Response } from "express";
import { categoryService } from "./category.service";

const createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { name: category } = req.body;
        if (!category) {
            throw new Error("Category is required");
        }
        const result = await categoryService.createCategory(category);
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

export const categoryController = {
    createCategory,
};
