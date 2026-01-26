import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service";

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

const updateUserStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        await userService.updateUserStatus(id as string, role);
        res.status(200).json({
            success: true,
            message: "User status updated successfully!",
        });
    } catch (error: any) {
        next(error);
    }
};

export const userController = {
    getCurrentUser,
    getAllUsers,
	updateUserStatus
};
