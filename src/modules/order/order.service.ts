import { Order, OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const getAllOrders = async (status?: string) => {
    const whereClause = status ? { status: status as OrderStatus } : {};

    const result = await prisma.order.findMany({
        where: whereClause,
        include: {
            customer: true,
            items: {
                include: {
                    medicine: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    return result;
};

const getOrderById = async (id: string) => {
    const result = await prisma.order.findMany({
        where: { customerId: id },
        include: {
            customer: true,
            items: {
                include: {
                    medicine: true,
                },
            },
        },
    });
    return result;
};

const createOrder = async (orderData: any) => {
    const totalAmount = orderData.items.reduce(
        (sum: any, item: any) => sum + item.price * item.quantity,
        0,
    );
    orderData.totalAmount = totalAmount;

    const result = await prisma.order.create({
        data: {
            customerId: orderData.customerId,
            shippingAddress: orderData.shippingAddress,
            totalAmount,
            items: {
                create: orderData.items.map((item: any) => ({
                    medicineId: item.medicineId,
                    quantity: item.quantity,
                    price: item.price,
                })),
            },
        },
        include: {
            customer: true,
            items: {
                include: {
                    medicine: true,
                },
            },
        },
    });
    return result;
};

const deleteOrderById = async (id: string) => {
    const order = await prisma.order.findUnique({
        where: { id },
    });
    if (!order) {
        throw new AppError("Order not found", 404);
    }

    const result = await prisma.order.delete({
        where: { id },
    });
    return result;
};

//! currently only status update is allowed
const updateOrderById = async (id: string, orderData: Order) => {
    const order = await prisma.order.findUnique({
        where: { id },
    });
    if (!order) {
        throw new AppError("Order not found", 404);
    }
    const status = orderData.status;
    return await prisma.order.update({
        where: { id },
        data: { status },
        include: {
            customer: true,
            items: {
                include: {
                    medicine: true,
                },
            },
        },
    });
};

export const orderService = {
    getAllOrders,
    getOrderById,
    createOrder,
    deleteOrderById,
    updateOrderById,
};
