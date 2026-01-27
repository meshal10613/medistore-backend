import { Medicine } from "../../../generated/prisma/client";
import { MedicineWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../middleware/appError";

const getAllMedicines = async ({
    search,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
}: {
    search: string | undefined;
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}) => {
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
    const result = await prisma.medicine.findMany({
        take: limit,
        skip: skip,
        where: {
            AND: andConditions,
        },
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            category: {
                select: { id: true, name: true },
            },
            seller: true,
        },
    });

    const total = await prisma.medicine.count({
        where: {
            AND: andConditions,
        },
    });
    return {
        data: result,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
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
