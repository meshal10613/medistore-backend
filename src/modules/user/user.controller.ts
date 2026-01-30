import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";
import { User } from "../../../generated/prisma/client";

const getCurrentUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await userService.getCurrentUser(req);
        res.status(200).json({
            success: true,
            message: "Current user fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "All users fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const adminStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.adminStats();
        res.status(200).json({
            success: true,
            message: "Admin stats fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const sellerStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.sellerStats();
        res.status(200).json({
            success: true,
            message: "Seller stats fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const customerStats = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const result = await userService.customerStats(user as Partial<User>);
        res.status(200).json({
            success: true,
            message: "Customer stats fetched successfully!",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const user = req.user;

        await userService.updateUser(
            user as User, // actor
            id as string, // target user id
            req.body, // update payload
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully!",
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    getCurrentUser,
    getAllUsers,
    adminStats,
    sellerStats,
    customerStats,
    updateUser,
};
