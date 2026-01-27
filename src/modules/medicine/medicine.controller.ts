import { NextFunction, Request, Response } from "express";
import { medicineService } from "./medicine.service";

const getAllMedicines = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const search = req.query.search as string | undefined;
        const medicines = await medicineService.getAllMedicines({ search });
        res.status(200).json({
            success: true,
            message: "Medicines retrieved successfully",
            data: medicines,
        });
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

export const medicineController = {
    getAllMedicines,
    createMedicine,
};
