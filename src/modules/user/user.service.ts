import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { Role } from "../../../generated/prisma/enums";

const getCurrentUser = async(req: Request) => {
	const user = req.user;
	return user;
};

const getAllUsers = async() => {
	const result = await prisma.user.findMany();
	return result;
};

const updateUserStatus = async(userId: string, role: Role) => {
	await prisma.user.update({
		where: { id: userId },
		data: { role },
	});
};

export const userService = {
	getCurrentUser,
	getAllUsers,
	updateUserStatus
};