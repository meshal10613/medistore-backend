import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";
import paginationAndSorting from "../../helper/pagination_sorting.helper";

const getAllMedicines = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const search = req.query.search as string | undefined;
        const { page, limit, skip, sortBy, sortOrder } = paginationAndSorting(
            req.query,
        );
        const medicines = await medicineService.getAllMedicines({
            search,
            page,
            limit,
            skip,
            sortBy,
            sortOrder,
        });
        res.status(200).json({
            success: true,
            message: "Medicines retrieved successfully",
            data: medicines,
        });
    } catch (error: any) {
        next(error);
    }
};

const getMedicineById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const { id } = req.params;
    const result = await medicineService.getMedicineById(id as string);
    res.status(200).json({
        success: true,
        message: "Medicine retrieved successfully",
        data: result,
    });
    try {
    } catch (error: any) {
        next(error);
    }
};

const createMedicine = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const medicineData = req.body;
        const result = await medicineService.createMedicine(medicineData);
        res.status(201).json({
            success: true,
            message: "Medicine created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const deleteMedicineById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { id } = req.params;
        await medicineService.deleteMedicineById(id as string);
        res.status(200).json({
            success: true,
            message: "Medicine deleted successfully",
        });
    } catch (error: any) {
        next(error);
    }
};

const updateMedicineId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const medicineData = req.body;
        const result = await medicineService.updateMedicineId(id as string, medicineData);
        res.status(200).json({
            success: true,
            message: "Medicine updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
}

export const medicineController = {
    getAllMedicines,
    getMedicineById,
    createMedicine,
    deleteMedicineById,
    updateMedicineId
};
