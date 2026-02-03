import { Router } from 'express';
import { MedicineController } from './medicine.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

router.post('/', auth(UserRole.SELLER), MedicineController.createMedicine);

router.get('/', MedicineController.getAllMedicine);

router.get('/sellers', MedicineController.getAllSellers);

export const MedicineRouter = router;
