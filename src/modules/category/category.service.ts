import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const getAllCategories = async() => {
	return await prisma.category.findMany({
		include: {
			medicines: true,
		}
	});
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

const deleteCategoryById = async(id: string) => {
	const category = await prisma.category.findUnique({
        where: { id },
    });
    if (!category) {
        throw new AppError("Category not found", 404);
    }

    const result = await prisma.category.delete({
        where: { id },
    });
    return result;
};	

export const categoryService = {
	getAllCategories,
    createCategory,
	deleteCategoryById,
};
