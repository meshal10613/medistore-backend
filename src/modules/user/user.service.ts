import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { OrderStatus, Role, UserStatus } from "../../../generated/prisma/enums";
import { AppError } from "../../middleware/appError";
import { User } from "../../../generated/prisma/client";

interface UpdateUserPayload {
    name?: string;
    image?: string | null;
    role?: Role;
    status?: UserStatus;
}

const getCurrentUser = async (req: Request) => {
    const user = req.user;
    return user;
};

const getAllUsers = async () => {
    const result = await prisma.user.findMany();
    return result;
};

const adminStats = async () => {
    const [
        totalCount,
        customerCount,
        sellerCount,
        adminCount,
        totalCategories,
        totalMedicines,
        totalReviews,
    ] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.CUSTOMER } }),
        prisma.user.count({ where: { role: Role.SELLER } }),
        prisma.user.count({ where: { role: Role.ADMIN } }),
        prisma.category.count(),
        prisma.medicine.count(),
        prisma.review.count(),
    ]);

    // Orders: group by status + sum totalAmount
    const orderStats = await prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
        _sum: { totalAmount: true },
    });

    const orderData: any = {
        total: 0,
        placed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        placedAmount: 0,
        processingAmount: 0,
        shippedAmount: 0,
        deliveredAmount: 0,
        cancelledAmount: 0,
    };

    let totalOrders = 0;

    for (const s of orderStats) {
        const status = s.status.toLowerCase();
        orderData[status] = s._count.status;
        orderData[`${status}Amount`] = s._sum.totalAmount || 0;
        totalOrders += s._count.status;
    }

    orderData.total = totalOrders;

    return {
        user: {
            total: totalCount,
            customer: customerCount,
            seller: sellerCount,
            admin: adminCount,
        },
        category: {
            total: totalCategories,
        },
        medicine: {
            total: totalMedicines,
        },
        order: orderData,
        review: {
            total: totalReviews,
        },
    };
};

const sellerStats = async () => {
    const [
        totalCategories,
        totalMedicines,
        totalReviews,
    ] = await prisma.$transaction([
        prisma.category.count(),
        prisma.medicine.count(),
        prisma.review.count(),
    ]);

    //  Orders: group by status + sum totalAmount
    const orderStats = await prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
        _sum: { totalAmount: true },
    });

    const orderData: any = {
        total: 0,
        placed: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        placedAmount: 0,
        processingAmount: 0,
        shippedAmount: 0,
        deliveredAmount: 0,
        cancelledAmount: 0,
    };

    let totalOrders = 0;

    for (const s of orderStats) {
        const status = s.status.toLowerCase();
        orderData[status] = s._count.status;
        orderData[`${status}Amount`] = s._sum.totalAmount || 0;
        totalOrders += s._count.status;
    }

    orderData.total = totalOrders;

    return {
        category: {
            total: totalCategories,
        },
        medicine: {
            total: totalMedicines,
        },
        order: orderData,
        review: {
            total: totalReviews,
        },
    };
};

const updateUser = async (
    actor: User,
    targetUserId: string,
    payload: UpdateUserPayload,
) => {
    const targetUser = await prisma.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, role: true },
    });

    if (!targetUser) {
        throw new AppError("User not found", 404);
    }

    const isSelf = actor.id === targetUserId;

    let updateData: UpdateUserPayload = {};

    // admin rules
    if (actor.role === Role.ADMIN) {
        if (payload.name !== undefined) updateData.name = payload.name;
        if (payload.image !== undefined) updateData.image = payload.image;
        if (payload.role !== undefined) updateData.role = payload.role;
        if (payload.status !== undefined) updateData.status = payload.status;
    } else {
        // seller /customer rules
        if (!isSelf) {
            throw new AppError("You can only update your own profile", 403);
        }

        if (payload.role !== undefined || payload.status !== undefined) {
            throw new AppError(
                "You are not allowed to update role or status",
                403,
            );
        }

        if (payload.name !== undefined) updateData.name = payload.name;
        if (payload.image !== undefined) updateData.image = payload.image;
    }

    // Nothing to update safeguard
    if (Object.keys(updateData).length === 0) {
        throw new AppError("No valid fields to update", 400);
    }

    return prisma.user.update({
        where: { id: targetUserId },
        data: updateData,
    });
};

export const userService = {
    getCurrentUser,
    getAllUsers,
    adminStats,
    sellerStats,
    updateUser,
};
