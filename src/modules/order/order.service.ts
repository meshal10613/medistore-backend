import { OrderStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

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
    const result = await prisma.order.findUnique({
        where: { id },
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

export const orderService = {
    getAllOrders,
    getOrderById,
    createOrder,
};
