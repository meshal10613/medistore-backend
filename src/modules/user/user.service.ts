import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { Role, UserStatus } from "../../../generated/prisma/enums";
import { APIError } from "better-auth";
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
    updateUser,
};
