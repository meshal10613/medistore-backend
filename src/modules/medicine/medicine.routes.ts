import { Router } from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { medicineController } from "./medicine.controller";

const router = Router();

router.get("/", medicineController.getAllMedicines);

router.post("/", auth(Role.SELLER), medicineController.createMedicine);

export const medicineRoutes: Router = router;