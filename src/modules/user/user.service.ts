import { Request } from "express";
import { auth } from "../../lib/auth";

const getCurrentUser = async(req: Request) => {
	const user = req.user;
	return user;
};

export const userService = {
	getCurrentUser,
};