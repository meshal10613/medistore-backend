import { NextFunction, Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async(req: Request, res: Response, next: NextFunction) => {
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
}

export const orderController = {
	createOrder,
};