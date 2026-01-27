import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const getAllCategories = async() => {
	return await prisma.category.findMany();
}

const createCategory = async (category: string) => {
	const existingCategory = await prisma.category.findUnique({
		where: {
			name: category,
		},
	});
	if (existingCategory) {
		throw new AppError("Category already exists", 409);
	}
    return await prisma.category.create({
        data: {
            name: category,
        },
    });
};

export const categoryService = {
	getAllCategories,
    createCategory,
};
