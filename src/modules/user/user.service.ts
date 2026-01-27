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
        totalOrders,
        placedCount,
        processingCount,
        shippedCount,
        deliveredCount,
        cancelledCount,
        totalCategories,
        totalMedicines,
        totalReviews,
    ] = await prisma.$transaction([
        prisma.user.count(),
        prisma.user.count({ where: { role: Role.CUSTOMER } }),
        prisma.user.count({ where: { role: Role.SELLER } }),
        prisma.user.count({ where: { role: Role.ADMIN } }),
        prisma.order.count(),
        prisma.order.count({ where: { status: OrderStatus.PLACED } }),
        prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
        prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
        prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
        prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
        prisma.category.count(),
        prisma.medicine.count(),
        prisma.review.count(),
    ]);

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
        order: {
            total: totalOrders,
            placed: placedCount,
            processing: processingCount,
            shipped: shippedCount,
            delivered: deliveredCount,
            cancelled: cancelledCount,
        },
        review: {
            total: totalReviews,
        },
    };
};

const sellerStats = async () => {
    const [
        totalOrders,
        placedCount,
        processingCount,
        shippedCount,
        deliveredCount,
        cancelledCount,
        totalCategories,
        totalMedicines,
        totalReviews,
    ] = await prisma.$transaction([
        prisma.order.count(),
        prisma.order.count({ where: { status: OrderStatus.PLACED } }),
        prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
        prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
        prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
        prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
        prisma.category.count(),
        prisma.medicine.count(),
        prisma.review.count(),
    ]);

    return {
        category: {
            total: totalCategories,
        },
        medicine: {
            total: totalMedicines,
        },
        order: {
            total: totalOrders,
            placed: placedCount,
            processing: processingCount,
            shipped: shippedCount,
            delivered: deliveredCount,
            cancelled: cancelledCount,
        },
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
