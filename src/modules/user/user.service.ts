import { Request } from "express";
import { prisma } from "../../lib/prisma";

const getCurrentUser = async(req: Request) => {
	const user = req.user;
	return user;
};

const getAllUsers = async() => {
	const result = await prisma.user.findMany();
	return result;
};

export const userService = {
	getCurrentUser,
	getAllUsers,
};