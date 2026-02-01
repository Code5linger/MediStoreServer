import { Router } from 'express';
import { MedicineController } from './medicine.controller';

const router = Router();

router.post('/', MedicineController.createMedicine);

export const MedicineRouter = router;
