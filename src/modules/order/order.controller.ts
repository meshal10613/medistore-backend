import { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service";

const getAllOrders = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { status } = req.query;

        const result = await orderService.getAllOrders(
            status as string | undefined,
        );
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const result = await orderService.getOrderById(id as string);
        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderData = req.body;
        const result = await orderService.createOrder(orderData);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const deleteOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const result = await orderService.deleteOrderById(id as string);
        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const updateOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        const orderData = req.body;
        const result = await orderService.updateOrderById(
            id as string,
            orderData,
        );
        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

export const orderController = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrderById,
    updateOrderById,
};
