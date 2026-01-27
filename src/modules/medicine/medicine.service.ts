import { Medicine } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const getAllMedicines = async ({ search }: { search: string | undefined }) => {
    const andConditions: MedicineWhereInput[] = [];
    if (search) {
        andConditions.push({
            OR: [
                { name: { contains: search as string, mode: "insensitive" } },
                {
                    description: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    manufacturer: {
                        contains: search as string,
                        mode: "insensitive",
                    },
                },
                {
                    category: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                },
            ],
        });
    }
    const medicines = await prisma.medicine.findMany({
		where: {
			AND: andConditions,
		},
        include: {
            category: {
                select: { id: true, name: true },
            },
            seller: true,
        },
    });
    return medicines;
};

const createMedicine = async (payload: Medicine) => {
    const {
        name,
        description,
        price,
        stock,
        manufacturer,
        imageUrl,
        categoryId,
        sellerId,
    } = payload;

    // 1️⃣ Validate seller
    const seller = await prisma.user.findUnique({
        where: { id: sellerId },
    });

    if (!seller) {
        throw new AppError("Seller not found", 404);
    }

    // 2️⃣ Validate category
    const category = await prisma.category.findUnique({
        where: { id: categoryId },
    });

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    // 3️⃣ Create medicine
    const medicine = await prisma.medicine.create({
        data: {
            name,
            description,
            price,
            stock,
            manufacturer,
            imageUrl,
            categoryId,
            sellerId,
        },
    });

    return medicine;
};

export const medicineService = {
    getAllMedicines,
    createMedicine,
};
