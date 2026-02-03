import { Router } from 'express';
import { MedicineController } from './medicine.controller';
import auth, { UserRole } from '../../middleware/auth';

const router = Router();

router.post('/', auth(UserRole.SELLER), MedicineController.createMedicine);

router.get('/', MedicineController.getAllMedicine);

router.get('/sellers', MedicineController.getAllSellers);

router.put('/:id', auth(UserRole.SELLER), MedicineController.updateMedicine);
router.delete('/:id', auth(UserRole.SELLER), MedicineController.deleteMedicine);

export const MedicineRouter = router;
